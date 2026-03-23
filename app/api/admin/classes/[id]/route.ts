import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEnrollmentNotification } from "@/lib/mail";
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
  if (body.groupId !== undefined) classData.groupId = body.groupId || null;

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

      // Mevcut enrollment'ları al (yeni eklenen kişilere mail göndermek için)
      const existingEnrollments = await prisma.enrollment.findMany({
        where: { classId: id },
        select: { userId: true },
      });
      const existingUserIds = new Set(existingEnrollments.map((e) => e.userId));

      for (const classId of relatedClassIds) {
        // Sadece bireysel enrollment'ları sil, grup source olanları koru
        await prisma.enrollment.deleteMany({
          where: { classId, source: { not: "group" } },
        });

        // source=group olanları da sil (grup değiştiyse yeniden oluşacak)
        await prisma.enrollment.deleteMany({
          where: { classId, source: "group" },
        });

        // Bireysel enrollment'ları oluştur
        if (body.enrolledUserIds.length > 0) {
          await prisma.enrollment.createMany({
            data: body.enrolledUserIds.map((userId: string) => ({
              userId,
              classId,
            })),
            skipDuplicates: true,
          });
        }

        // Grup enrollment'ları oluştur
        const groupId = body.groupId !== undefined ? (body.groupId || null) : cls.groupId;
        if (groupId) {
          const groupMembers = await prisma.groupMember.findMany({
            where: { groupId },
            select: { userId: true },
          });
          if (groupMembers.length > 0) {
            await prisma.enrollment.createMany({
              data: groupMembers.map((m) => ({
                userId: m.userId,
                classId,
                source: "group" as const,
              })),
              skipDuplicates: true,
            });
          }
        }

        // Seri derslerine de groupId uygula
        if (classId !== id) {
          await prisma.class.update({
            where: { id: classId },
            data: { groupId: body.groupId !== undefined ? (body.groupId || null) : undefined },
          });
        }
      }

      // Yeni eklenen kullanıcılara mail gönder
      const allNewUserIds = new Set<string>(body.enrolledUserIds || []);
      const groupId = body.groupId !== undefined ? (body.groupId || null) : cls.groupId;
      if (groupId) {
        const gm = await prisma.groupMember.findMany({
          where: { groupId },
          select: { userId: true },
        });
        for (const m of gm) allNewUserIds.add(m.userId);
      }
      const addedUserIds = [...allNewUserIds].filter((uid) => !existingUserIds.has(uid));
      if (addedUserIds.length > 0) {
        const addedUsers = await prisma.user.findMany({
          where: { id: { in: addedUserIds } },
          select: { email: true, name: true },
        });
        for (const u of addedUsers) {
          sendEnrollmentNotification(
            u.email,
            u.name || "",
            cls.title,
            cls.scheduledAt?.toISOString() || null,
            cls.duration,
            cls.zoomJoinUrl,
          ).catch(() => {});
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
