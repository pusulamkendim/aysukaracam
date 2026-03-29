import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createShopierProduct, updateShopierProduct, deleteShopierProduct } from "@/lib/shopier";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();

  // Mevcut ürünü al
  const existing = await prisma.product.findUnique({ where: { id } });

  // Deaktive ediliyorsa Shopier'dan sil
  if (body.isActive === false && existing?.gumroadId) {
    try {
      await deleteShopierProduct(existing.gumroadId);
      body.gumroadId = null;
    } catch (error) {
      console.error("Shopier silme hatası:", error);
    }
  }

  // Tekrar aktif ediliyorsa ve Shopier'da yoksa yeniden oluştur
  if (body.isActive === true && !existing?.gumroadId && existing?.price && existing.price > 0) {
    try {
      const shopierProduct = await createShopierProduct({
        title: body.name || existing.name,
        description: body.description || existing.description || existing.name,
        price: body.price ?? existing.price,
        imageUrl: body.image || existing.image || undefined,
      });
      body.gumroadId = shopierProduct.id;
    } catch (error) {
      console.error("Shopier yeniden oluşturma hatası:", error);
    }
  }

  // Shopier'da güncelle (shopier ID varsa, deaktive değilse)
  if (body.isActive !== false && existing?.gumroadId && (body.name || body.description || body.price !== undefined)) {
    try {
      await updateShopierProduct(existing.gumroadId, {
        title: body.name,
        description: body.description,
        price: body.price,
      });
    } catch (error) {
      console.error("Shopier güncelleme hatası:", error);
    }
  }

  const product = await prisma.product.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(product);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const permanent = searchParams.get("permanent") === "true";

  const product = await prisma.product.findUnique({
    where: { id },
    include: { _count: { select: { orderItems: true } } },
  });

  if (!product) {
    return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
  }

  // Shopier'dan sil
  if (product.gumroadId) {
    try {
      await deleteShopierProduct(product.gumroadId);
    } catch (error) {
      console.error("Shopier silme hatası:", error);
    }
  }

  if (permanent) {
    // Siparişi olan ürün kalıcı silinemez
    if (product._count.orderItems > 0) {
      return NextResponse.json(
        { error: "Bu ürüne ait sipariş var, kalıcı olarak silinemez" },
        { status: 400 }
      );
    }

    await prisma.cartItem.deleteMany({ where: { productId: id } });
    await prisma.class.updateMany({ where: { productId: id }, data: { productId: null } });
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ message: "Ürün kalıcı olarak silindi" });
  }

  // Deaktive et
  await prisma.product.update({
    where: { id },
    data: { isActive: false, gumroadId: null },
  });

  return NextResponse.json({ message: "Ürün devre dışı bırakıldı" });
}
