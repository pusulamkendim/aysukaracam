import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { itemId } = await params;
  const { quantity } = await request.json();

  if (!quantity || quantity < 1) {
    return NextResponse.json({ error: "Geçersiz miktar" }, { status: 400 });
  }

  const cartItem = await prisma.cartItem.updateMany({
    where: { id: itemId, userId: session.user.id },
    data: { quantity },
  });

  if (cartItem.count === 0) {
    return NextResponse.json({ error: "Öğe bulunamadı" }, { status: 404 });
  }

  return NextResponse.json({ message: "Güncellendi" });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { itemId } = await params;

  const deleted = await prisma.cartItem.deleteMany({
    where: { id: itemId, userId: session.user.id },
  });

  if (deleted.count === 0) {
    return NextResponse.json({ error: "Öğe bulunamadı" }, { status: 404 });
  }

  return NextResponse.json({ message: "Silindi" });
}
