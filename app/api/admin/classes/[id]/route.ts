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
  const body = await request.json();

  const { enrolledUserIds, ...classData } = body;

  if (classData.scheduledAt) {
    classData.scheduledAt = new Date(classData.scheduledAt);
  }

  const cls = await prisma.class.update({
    where: { id },
    data: classData,
  });

  // Enrollment'ları güncelle (varsa)
  if (enrolledUserIds !== undefined) {
    // Mevcut enrollment'ları sil
    await prisma.enrollment.deleteMany({
      where: { classId: id },
    });

    // Yenilerini oluştur
    if (enrolledUserIds.length > 0) {
      await prisma.enrollment.createMany({
        data: enrolledUserIds.map((userId: string) => ({
          userId,
          classId: id,
        })),
        skipDuplicates: true,
      });
    }
  }

  return NextResponse.json(cls);
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

  await prisma.class.update({
    where: { id },
    data: { isActive: false },
  });

  return NextResponse.json({ message: "Ders devre dışı bırakıldı" });
}
