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
  const { name, memberUserIds } = await request.json();

  // Grup adını güncelle
  if (name) {
    await prisma.group.update({ where: { id }, data: { name } });
  }

  if (memberUserIds !== undefined) {
    // Mevcut üyeleri al
    const currentMembers = await prisma.groupMember.findMany({
      where: { groupId: id },
      select: { userId: true },
    });
    const currentIds = currentMembers.map((m) => m.userId);
    const newIds: string[] = memberUserIds;

    const addedIds = newIds.filter((uid) => !currentIds.includes(uid));
    const removedIds = currentIds.filter((uid) => !newIds.includes(uid));

    // Üyeleri güncelle
    if (removedIds.length > 0) {
      await prisma.groupMember.deleteMany({
        where: { groupId: id, userId: { in: removedIds } },
      });
    }
    if (addedIds.length > 0) {
      await prisma.groupMember.createMany({
        data: addedIds.map((userId) => ({ groupId: id, userId })),
        skipDuplicates: true,
      });
    }

    // Bu gruba bağlı aktif derslerin enrollment'larını sync et
    const linkedClasses = await prisma.class.findMany({
      where: { groupId: id, isActive: true },
      select: { id: true },
    });

    for (const cls of linkedClasses) {
      // Çıkarılan üyelerin grup kaynaklı enrollment'larını sil
      if (removedIds.length > 0) {
        await prisma.enrollment.deleteMany({
          where: {
            classId: cls.id,
            userId: { in: removedIds },
            source: "group",
          },
        });
      }

      // Eklenen üyeleri derse kaydet
      if (addedIds.length > 0) {
        await prisma.enrollment.createMany({
          data: addedIds.map((userId) => ({
            userId,
            classId: cls.id,
            source: "group",
          })),
          skipDuplicates: true,
        });
      }
    }
  }

  const group = await prisma.group.findUnique({
    where: { id },
    include: {
      members: { include: { user: { select: { id: true, name: true, email: true } } } },
      _count: { select: { members: true, classes: true } },
    },
  });

  return NextResponse.json(group);
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

  await prisma.group.delete({ where: { id } });

  return NextResponse.json({ message: "Grup silindi" });
}
