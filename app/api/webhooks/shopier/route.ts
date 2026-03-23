import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendPaymentConfirmation, sendPaymentNotificationToAdmin } from "@/lib/mail";

/**
 * Shopier Webhook Handler
 *
 * Events:
 *  - order.created    → Sipariş oluşturuldu (ödeme alındı)
 *  - order.fulfilled  → Sipariş kargolandı/tamamlandı
 *  - refund.requested → İade talebi
 *  - refund.updated   → İade güncellendi (succeeded/failed)
 *  - product.created  → Ürün oluşturuldu (bilgi amaçlı)
 *  - product.updated  → Ürün güncellendi (bilgi amaçlı)
 *  - order.addressUpdated → Adres güncellendi (bilgi amaçlı)
 *
 * Headers:
 *  - Shopier-Event: event type
 *  - Shopier-Signature: HMAC SHA-256 signature
 *  - Shopier-Timestamp: Unix epoch seconds
 *  - Shopier-Webhook-Id: idempotency key
 *  - Shopier-Account-Id: shop account id
 */

function verifySignature(rawBody: string, signature: string | null, token: string): boolean {
  if (!signature || !token) return false;
  const expected = crypto.createHmac("sha256", token).update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const event = request.headers.get("shopier-event");
  const signature = request.headers.get("shopier-signature");
  const webhookId = request.headers.get("shopier-webhook-id");
  const webhookToken = process.env.SHOPIER_WEBHOOK_TOKEN;

  console.log(`Shopier webhook [${event}] id=${webhookId}`);

  // İmza doğrulama
  if (webhookToken && !verifySignature(rawBody, signature, webhookToken)) {
    console.log("Shopier webhook: imza doğrulanamadı");
    return NextResponse.json({ error: "Geçersiz imza" }, { status: 403 });
  }

  try {
    const body = JSON.parse(rawBody);

    switch (event) {
      case "order.created":
        await handleOrderCreated(body);
        break;
      case "order.fulfilled":
        await handleOrderFulfilled(body);
        break;
      case "refund.requested":
      case "refund.updated":
        await handleRefund(body);
        break;
      default:
        console.log(`Shopier webhook: işlenmedi [${event}]`);
    }

    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    console.error("Shopier webhook hatası:", error);
    return NextResponse.json({ error: "İşlem hatası" }, { status: 500 });
  }
}

/**
 * order.created: Ödeme alındı, sipariş oluşturuldu
 * Payload: Shopier Order model (id, paymentStatus, shippingInfo.email, lineItems, totals, etc.)
 */
async function handleOrderCreated(order: {
  id: string;
  paymentStatus: string;
  shippingInfo?: { email?: string; firstName?: string; lastName?: string; phone?: string };
  billingInfo?: { email?: string };
  lineItems?: { productId: string; title: string; quantity: number; price: string; total: string }[];
  totals?: { total: string };
  currency?: string;
}) {
  const shopierOrderId = order.id;
  const buyerEmail = order.shippingInfo?.email || order.billingInfo?.email || "";
  const isPaid = order.paymentStatus === "paid";

  console.log("order.created:", { shopierOrderId, buyerEmail, isPaid, lineItems: order.lineItems });

  if (!isPaid) return;

  // Shopier productId ile eşleşen ürünleri bul
  const shopierProductIds = (order.lineItems || []).map((item) => item.productId);
  const matchedProducts = shopierProductIds.length > 0
    ? await prisma.product.findMany({
        where: { gumroadId: { in: shopierProductIds } },
      })
    : [];

  // 1. Email ile kullanıcıyı bul
  let user = buyerEmail
    ? await prisma.user.findUnique({ where: { email: buyerEmail.toLowerCase() } })
    : null;

  // 2. Email eşleşmezse, ürünü PENDING siparişte arayan kullanıcıyı bul
  if (!user && matchedProducts.length > 0) {
    const pendingOrder = await prisma.order.findFirst({
      where: {
        status: "PENDING",
        items: { some: { productId: { in: matchedProducts.map((p) => p.id) } } },
      },
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });
    if (pendingOrder) {
      user = pendingOrder.user;
      console.log("Shopier webhook: email eşleşmedi, PENDING sipariş ile eşleştirildi:", user.email);
    }
  }

  if (!user) {
    console.log("Shopier webhook: kullanıcı bulunamadı:", buyerEmail, "productIds:", shopierProductIds);
    return;
  }

  // Bekleyen siparişi bul veya yeni oluştur
  let dbOrder = await prisma.order.findFirst({
    where: { userId: user.id, status: "PENDING" },
    orderBy: { createdAt: "desc" },
  });

  if (dbOrder) {
    // Mevcut PENDING siparişi onayla
    await prisma.order.update({
      where: { id: dbOrder.id },
      data: {
        status: "PAID",
        gumroadSaleId: shopierOrderId,
      },
    });
  } else {
    // Sistemde PENDING sipariş yok — Shopier'dan direkt gelen sipariş
    const totalKurus = order.totals?.total
      ? Math.round(parseFloat(order.totals.total) * 100)
      : 0;

    dbOrder = await prisma.order.create({
      data: {
        userId: user.id,
        status: "PAID",
        totalAmount: totalKurus,
        gumroadSaleId: shopierOrderId,
        items: {
          create: matchedProducts.map((p) => {
            const lineItem = (order.lineItems || []).find((li) => li.productId === p.gumroadId);
            return {
              productId: p.id,
              quantity: lineItem?.quantity || 1,
              price: p.price,
            };
          }),
        },
      },
    });
  }

  // Enrollment oluştur — siparişteki ürünlerin derslerine kaydet
  const orderWithItems = await prisma.order.findUnique({
    where: { id: dbOrder.id },
    include: {
      items: {
        include: {
          product: { include: { classes: { where: { isActive: true } } } },
        },
      },
    },
  });

  if (orderWithItems) {
    for (const item of orderWithItems.items) {
      for (const cls of item.product.classes) {
        await prisma.enrollment.upsert({
          where: {
            userId_classId: { userId: user.id, classId: cls.id },
          },
          update: {},
          create: { userId: user.id, classId: cls.id },
        });
      }
    }

    // Sepeti temizle
    await prisma.cartItem.deleteMany({ where: { userId: user.id } });

    // Mail bildirimleri
    const itemNames = orderWithItems.items.map((i) => i.product.name);
    const totalFormatted = `${(orderWithItems.totalAmount / 100).toLocaleString("tr-TR")} ₺`;
    await sendPaymentConfirmation(buyerEmail, user.name || "", itemNames, totalFormatted);
    await sendPaymentNotificationToAdmin(user.name || "", buyerEmail, itemNames, totalFormatted);
  }

  console.log(`Sipariş onaylandı: ${dbOrder.id} (Shopier: ${shopierOrderId})`);
}

/**
 * order.fulfilled: Sipariş tamamlandı/kargolandı
 */
async function handleOrderFulfilled(order: { id: string }) {
  const dbOrder = await prisma.order.findFirst({
    where: { gumroadSaleId: order.id },
  });

  if (dbOrder) {
    console.log(`Sipariş tamamlandı: ${dbOrder.id} (Shopier: ${order.id})`);
  }
}

/**
 * refund.requested / refund.updated: İade işlemi
 */
async function handleRefund(body: {
  orderId?: string;
  id?: string;
  status?: string;
  refunds?: { status: string }[];
}) {
  // refund.updated payload'ında order model gelir, refunds array içinde status var
  const shopierOrderId = body.orderId || body.id;
  if (!shopierOrderId) return;

  const refundSucceeded = body.status === "succeeded" ||
    body.refunds?.some((r) => r.status === "succeeded");

  const dbOrder = await prisma.order.findFirst({
    where: { gumroadSaleId: shopierOrderId },
  });

  if (dbOrder) {
    await prisma.order.update({
      where: { id: dbOrder.id },
      data: { status: refundSucceeded ? "REFUNDED" : dbOrder.status },
    });
    console.log(`İade işlendi: ${dbOrder.id} status=${refundSucceeded ? "REFUNDED" : "unchanged"}`);
  }
}
