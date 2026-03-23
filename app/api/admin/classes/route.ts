import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createZoomMeeting } from "@/lib/zoom";
import { sendEnrollmentNotification } from "@/lib/mail";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  const classes = await prisma.class.findMany({
    orderBy: { scheduledAt: "asc" },
    include: {
      product: { select: { name: true } },
      group: {
        select: {
          id: true,
          name: true,
          members: {
            include: { user: { select: { id: true, name: true, email: true, phone: true } } },
          },
        },
      },
      enrollments: {
        select: {
          user: { select: { id: true, name: true, email: true, phone: true } },
          source: true,
        },
      },
      _count: { select: { enrollments: true } },
    },
  });

  return NextResponse.json(classes);
}

export async function POST(request: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  const body = await request.json();
  const repeatWeeks = body.repeatWeeks || 1; // Kaç hafta tekrarlansın (1 = tek ders)
  const scheduledAt = body.scheduledAt ? new Date(body.scheduledAt) : null;

  // Zoom recurring meeting oluştur (tekrarlayan + canlı ise)
  let zoomMeetingId: string | null = null;
  let zoomJoinUrl: string | null = null;
  let zoomStartUrl: string | null = null;

  if (body.type === "LIVE" && scheduledAt && body.createZoom) {
    try {
      const dayOfWeek = scheduledAt.getDay(); // 0=Sun, 1=Mon...
      const zoomDayMap: Record<number, string> = { 0: "1", 1: "2", 2: "3", 3: "4", 4: "5", 5: "6", 6: "7" };

      const meeting = await createZoomMeeting({
        topic: body.title,
        startTime: scheduledAt.toISOString(),
        duration: body.duration || 60,
        ...(repeatWeeks > 1 ? {
          recurring: {
            type: 2,
            weeklyDays: zoomDayMap[dayOfWeek],
            repeatInterval: 1,
            endTimes: repeatWeeks,
          },
        } : {}),
      });

      zoomMeetingId = String(meeting.id);
      zoomJoinUrl = meeting.join_url;
      zoomStartUrl = meeting.start_url;
    } catch (error) {
      console.error("Zoom oluşturma hatası:", error);
    }
  }

  // Dersleri oluştur
  const createdClasses = [];

  for (let i = 0; i < repeatWeeks; i++) {
    let classDate = scheduledAt;
    if (scheduledAt && i > 0) {
      classDate = new Date(scheduledAt);
      classDate.setDate(classDate.getDate() + i * 7);
    }

    const cls = await prisma.class.create({
      data: {
        title: body.title,
        description: body.description,
        type: body.type || "LIVE",
        productId: body.productId || null,
        groupId: body.groupId || null,
        scheduledAt: classDate,
        duration: body.duration,
        recordingUrl: body.recordingUrl,
        isActive: body.isActive ?? true,
        zoomMeetingId,
        zoomJoinUrl,
        zoomStartUrl,
      },
    });

    // Tüm kayıt yapılacak kullanıcı ID'lerini topla
    const allEnrolledUserIds = new Set<string>(body.enrolledUserIds || []);

    // Bireysel enrollment oluştur
    if (body.enrolledUserIds && body.enrolledUserIds.length > 0) {
      await prisma.enrollment.createMany({
        data: body.enrolledUserIds.map((userId: string) => ({
          userId,
          classId: cls.id,
        })),
        skipDuplicates: true,
      });
    }

    // Grup üyelerini enrollment olarak ekle
    if (body.groupId) {
      const groupMembers = await prisma.groupMember.findMany({
        where: { groupId: body.groupId },
        select: { userId: true },
      });
      for (const m of groupMembers) allEnrolledUserIds.add(m.userId);
      if (groupMembers.length > 0) {
        await prisma.enrollment.createMany({
          data: groupMembers.map((m: { userId: string }) => ({
            userId: m.userId,
            classId: cls.id,
            source: "group",
          })),
          skipDuplicates: true,
        });
      }
    }

    // Kayıt yapılan kullanıcılara mail gönder (sadece ilk ders için, tekrarlılarda spam olmasın)
    if (i === 0 && allEnrolledUserIds.size > 0) {
      const enrolledUsers = await prisma.user.findMany({
        where: { id: { in: [...allEnrolledUserIds] } },
        select: { email: true, name: true },
      });
      for (const u of enrolledUsers) {
        sendEnrollmentNotification(
          u.email,
          u.name || "",
          cls.title,
          cls.scheduledAt?.toISOString() || null,
          cls.duration,
          zoomJoinUrl,
        ).catch(() => {});
      }
    }

    createdClasses.push(cls);
  }

  return NextResponse.json(
    { count: createdClasses.length, classes: createdClasses },
    { status: 201 }
  );
}
