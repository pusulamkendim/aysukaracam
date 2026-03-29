import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendPaymentConfirmation, sendPaymentNotificationToAdmin } from "@/lib/mail";

/**
 * Shopier ödeme sonrası callback
 * Kullanıcı ödemeyi tamamladıktan sonra Shopier buraya POST eder
 * ve kullanıcıyı siteye geri yönlendirir.
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    console.log("Shopier callback:", JSON.stringify(data));

    const apiSecret = process.env.SHOPIER_API_SECRET || "";
    const orderId = data.platform_order_id || "";
    const paymentStatus = data.payment_status || "";
    const randomNr = data.random_nr || "";
    const totalValue = data.total_order_value || "";
    const currency = data.currency || "";

    // İmza doğrulama
    const receivedSignature = data.signature || "";
    if (apiSecret && receivedSignature) {
      const hashData = `${randomNr}${orderId}${totalValue}${currency}`;
      const expectedSignature = crypto
        .createHmac("sha256", apiSecret)
        .update(hashData)
        .digest("base64");

      if (receivedSignature !== expectedSignature) {
        console.log("Shopier callback: imza doğrulanamadı");
        const baseUrl = process.env.AUTH_URL || "https://aysu.pusulamkendim.com";
        return NextResponse.redirect(new URL("/cart?payment=failed", baseUrl));
      }
    }

    const isSuccess = paymentStatus === "1";
    const baseUrl = process.env.AUTH_URL || "https://aysu.pusulamkendim.com";

    if (isSuccess && orderId) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          user: true,
          items: {
            include: {
              product: { include: { classes: { where: { isActive: true } } } },
            },
          },
        },
      });

      if (order && order.status === "PENDING") {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: "PAID",
            gumroadSaleId: `callback_${Date.now()}`,
          },
        });

        // Enrollment oluştur
        for (const item of order.items) {
          for (const cls of item.product.classes) {
            await prisma.enrollment.upsert({
              where: {
                userId_classId: { userId: order.userId, classId: cls.id },
              },
              update: {},
              create: { userId: order.userId, classId: cls.id },
            });
          }
        }

        // Sepeti temizle
        await prisma.cartItem.deleteMany({ where: { userId: order.userId } });

        // Mail bildirimleri
        const itemNames = order.items.map((i) => i.product.name);
        const totalFormatted = `${(order.totalAmount / 100).toLocaleString("tr-TR")} ₺`;
        await sendPaymentConfirmation(order.user.email, order.user.name || "", itemNames, totalFormatted);
        await sendPaymentNotificationToAdmin(order.user.name || "", order.user.email, itemNames, totalFormatted);

        console.log(`Sipariş onaylandı (callback): ${order.id}`);
      }

      return NextResponse.redirect(new URL("/dashboard?payment=success", baseUrl));
    }

    return NextResponse.redirect(new URL("/cart?payment=failed", baseUrl));
  } catch (error) {
    console.error("Shopier callback hatası:", error);
    const baseUrl = process.env.AUTH_URL || "https://aysu.pusulamkendim.com";
    return NextResponse.redirect(new URL("/cart?payment=failed", baseUrl));
  }
}
