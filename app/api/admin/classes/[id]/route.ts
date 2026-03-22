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

  // Sadece class modeline ait alanları al
  const classData: Record<string, unknown> = {};
  if (body.title !== undefined) classData.title = body.title;
  if (body.description !== undefined) classData.description = body.description;
  if (body.type !== undefined) classData.type = body.type;
  if (body.productId !== undefined) classData.productId = body.productId || null;
  if (body.scheduledAt !== undefined) classData.scheduledAt = body.scheduledAt ? new Date(body.scheduledAt) : null;
  if (body.duration !== undefined) classData.duration = body.duration;
  if (body.recordingUrl !== undefined) classData.recordingUrl = body.recordingUrl;
  if (body.isActive !== undefined) classData.isActive = body.isActive;

  try {
    const cls = await prisma.class.update({
      where: { id },
      data: classData,
    });

    // Enrollment'ları güncelle (varsa)
    if (body.enrolledUserIds !== undefined) {
      // Bu dersin tekrarlayan serisi var mı kontrol et
      const relatedClassIds = [id];

      if (cls.zoomMeetingId && body.applyToSeries !== false) {
        // Aynı Zoom linkine sahip gelecek dersleri bul
        const relatedClasses = await prisma.class.findMany({
          where: {
            zoomMeetingId: cls.zoomMeetingId,
            isActive: true,
            scheduledAt: { gte: new Date() },
            id: { not: id },
          },
          select: { id: true },
        });
        relatedClassIds.push(...relatedClasses.map((c) => c.id));
      }

      // Tüm ilgili derslerin enrollment'larını güncelle
      for (const classId of relatedClassIds) {
        await prisma.enrollment.deleteMany({
          where: { classId },
        });

        if (body.enrolledUserIds.length > 0) {
          await prisma.enrollment.createMany({
            data: body.enrolledUserIds.map((userId: string) => ({
              userId,
              classId,
            })),
            skipDuplicates: true,
          });
        }
      }
    }

    return NextResponse.json(cls);
  } catch (error) {
    console.error("Ders güncelleme hatası:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Güncelleme başarısız" },
      { status: 500 }
    );
  }
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
