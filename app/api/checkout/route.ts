import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    return NextResponse.json({ error: "Sepet boş" }, { status: 400 });
  }

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Sipariş oluştur
  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      totalAmount,
      status: "PENDING",
      items: {
        create: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
      },
    },
  });

  // Sepeti temizle
  await prisma.cartItem.deleteMany({
    where: { userId: session.user.id },
  });

  // Her ürün için Shopier linklerini oluştur
  const shopUsername = process.env.SHOPIER_SHOP_USERNAME || "necipyoga";
  const checkoutItems = cartItems.map((item) => ({
    name: item.product.name,
    quantity: item.quantity,
    price: item.product.price,
    shopierUrl: item.product.gumroadId
      ? `https://www.shopier.com/${shopUsername}/${item.product.gumroadId}`
      : null,
  }));

  return NextResponse.json({
    orderId: order.id,
    totalAmount,
    checkoutItems,
  });
}
