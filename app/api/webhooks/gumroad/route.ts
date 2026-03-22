import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const sellerId = formData.get("seller_id") as string;
    const saleId = formData.get("sale_id") as string;
    const orderId = formData.get("custom_fields[order_id]") as string;
    const productPermalink = formData.get("product_permalink") as string;

    // Seller ID doğrulama
    if (sellerId !== process.env.GUMROAD_SELLER_ID) {
      return NextResponse.json({ error: "Geçersiz seller" }, { status: 403 });
    }

    if (!orderId) {
      // orderId yoksa custom field'lardan bulmaya çalış
      // Gumroad bazen farklı formatta gönderebilir
      console.log("Gumroad webhook: orderId bulunamadı, formData:", Object.fromEntries(formData));
      return NextResponse.json({ message: "OK" }, { status: 200 });
    }

    // Siparişi güncelle
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "PAID",
        gumroadSaleId: saleId,
        gumroadPermalink: productPermalink,
      },
      include: {
        items: { include: { product: { include: { classes: true } } } },
        user: true,
      },
    });

    // Siparişteki ürünlere ait derslere enrollment oluştur
    for (const item of order.items) {
      for (const cls of item.product.classes) {
        await prisma.enrollment.upsert({
          where: {
            userId_classId: {
              userId: order.userId,
              classId: cls.id,
            },
          },
          update: {},
          create: {
            userId: order.userId,
            classId: cls.id,
          },
        });
      }
    }

    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    console.error("Gumroad webhook hatası:", error);
    return NextResponse.json({ error: "İşlem hatası" }, { status: 500 });
  }
}
