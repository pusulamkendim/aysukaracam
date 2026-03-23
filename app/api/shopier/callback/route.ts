import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Shopier ödeme sonrası callback endpoint'i
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

    console.log("Shopier callback:", data);

    const apiSecret = process.env.SHOPIER_CLIENT_SECRET || "";
    const orderId = data.platform_order_id || "";
    const paymentStatus = data.payment_status || data.status || "";
    const installment = data.installment || "";
    const paymentId = data.payment_id || data.random_nr || "";

    // İmza doğrulama
    const receivedSignature = data.signature || "";
    if (apiSecret && receivedSignature) {
      const hashData = `${data.random_nr || ""}${orderId}${data.total_order_value || ""}${data.currency || ""}`;
      const expectedSignature = crypto
        .createHmac("sha256", apiSecret)
        .update(hashData)
        .digest("base64");

      if (receivedSignature !== expectedSignature) {
        console.log("Shopier callback: imza doğrulanamadı");
        return NextResponse.redirect(new URL("/cart?error=signature", process.env.AUTH_URL || "https://aysu.pusulamkendim.com"));
      }
    }

    // Ödeme başarılı mı?
    const isSuccess = paymentStatus === "1" || paymentStatus === "success" || paymentStatus === "paid";

    if (isSuccess && orderId) {
      // Siparişi onayla
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
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
            gumroadSaleId: paymentId || `shopier_callback_${Date.now()}`,
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

        console.log(`Sipariş onaylandı (callback): ${order.id}`);
      }

      // Başarılı ödeme → dashboard'a yönlendir
      const baseUrl = process.env.AUTH_URL || "https://aysu.pusulamkendim.com";
      return NextResponse.redirect(new URL("/dashboard?payment=success", baseUrl));
    }

    // Başarısız ödeme → sepete yönlendir
    const baseUrl = process.env.AUTH_URL || "https://aysu.pusulamkendim.com";
    return NextResponse.redirect(new URL("/cart?payment=failed", baseUrl));
  } catch (error) {
    console.error("Shopier callback hatası:", error);
    const baseUrl = process.env.AUTH_URL || "https://aysu.pusulamkendim.com";
    return NextResponse.redirect(new URL("/cart?error=callback", baseUrl));
  }
}
