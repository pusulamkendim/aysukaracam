import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Webhook token doğrulama
    const signature = request.headers.get("x-shopier-hmac-sha256");
    const webhookToken = process.env.SHOPIER_WEBHOOK_TOKEN;

    if (webhookToken && signature) {
      const rawBody = JSON.stringify(body);
      const expectedSignature = crypto
        .createHmac("sha256", webhookToken)
        .update(rawBody)
        .digest("hex");

      if (signature !== expectedSignature) {
        console.log("Shopier webhook: imza doğrulanamadı");
        return NextResponse.json({ error: "Geçersiz imza" }, { status: 403 });
      }
    }

    const shopierOrderId = String(body.id || body.order_id || "");
    const buyerEmail = body.buyer_email || body.email || "";
    const productId = body.product_id ? String(body.product_id) : null;

    console.log("Shopier webhook alındı:", { shopierOrderId, buyerEmail, productId, body });

    // Siparişi Shopier order ID ile bul
    let order = await prisma.order.findFirst({
      where: { gumroadSaleId: `shopier_${shopierOrderId}` },
    });

    if (!order) {
      // E-posta ile kullanıcıyı bul
      const user = await prisma.user.findUnique({
        where: { email: buyerEmail },
      });

      if (!user) {
        console.log("Shopier webhook: kullanıcı bulunamadı:", buyerEmail);
        return NextResponse.json({ message: "OK" }, { status: 200 });
      }

      // Bekleyen sipariş var mı kontrol et
      order = await prisma.order.findFirst({
        where: {
          userId: user.id,
          status: "PENDING",
        },
        orderBy: { createdAt: "desc" },
      });

      if (order) {
        // Siparişi onayla
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: "PAID",
            gumroadSaleId: `shopier_${shopierOrderId}`,
          },
        });
      }
    } else {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "PAID" },
      });
    }

    // Sipariş bulunduysa enrollment oluştur
    if (order) {
      const orderWithItems = await prisma.order.findUnique({
        where: { id: order.id },
        include: {
          items: {
            include: {
              product: { include: { classes: true } },
            },
          },
        },
      });

      if (orderWithItems) {
        for (const item of orderWithItems.items) {
          for (const cls of item.product.classes) {
            await prisma.enrollment.upsert({
              where: {
                userId_classId: {
                  userId: orderWithItems.userId,
                  classId: cls.id,
                },
              },
              update: {},
              create: {
                userId: orderWithItems.userId,
                classId: cls.id,
              },
            });
          }
        }
      }
    }

    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    console.error("Shopier webhook hatası:", error);
    return NextResponse.json({ error: "İşlem hatası" }, { status: 500 });
  }
}
