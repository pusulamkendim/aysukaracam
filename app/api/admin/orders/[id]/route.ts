import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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
  const { status } = await request.json();

  if (!["PENDING", "PAID", "FAILED", "REFUNDED"].includes(status)) {
    return NextResponse.json({ error: "Geçersiz durum" }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status },
  });

  // Ödendi olarak işaretlendiğinde sepeti temizle + enrollment oluştur
  if (status === "PAID") {
    await prisma.cartItem.deleteMany({
      where: { userId: order.userId },
    });

    // Enrollment oluştur
    const orderWithItems = await prisma.order.findUnique({
      where: { id },
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
    }
  }

  return NextResponse.json(order);
}
