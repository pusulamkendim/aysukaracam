import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateShopierProduct } from "@/lib/shopier";
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

  // Shopier'da güncelle (shopier ID varsa)
  if (existing?.gumroadId && (body.name || body.description || body.price !== undefined)) {
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
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  const { id } = await params;

  await prisma.product.update({
    where: { id },
    data: { isActive: false },
  });

  return NextResponse.json({ message: "Ürün devre dışı bırakıldı" });
}
