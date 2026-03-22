import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createZoomMeeting } from "@/lib/zoom";
import { NextResponse } from "next/server";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  const { id } = await params;

  const cls = await prisma.class.findUnique({ where: { id } });
  if (!cls) {
    return NextResponse.json({ error: "Ders bulunamadı" }, { status: 404 });
  }

  if (!cls.scheduledAt) {
    return NextResponse.json(
      { error: "Ders tarihi belirlenmemiş" },
      { status: 400 }
    );
  }

  try {
    const meeting = await createZoomMeeting({
      topic: cls.title,
      startTime: cls.scheduledAt.toISOString(),
      duration: cls.duration || 60,
    });

    const updated = await prisma.class.update({
      where: { id },
      data: {
        zoomMeetingId: String(meeting.id),
        zoomJoinUrl: meeting.join_url,
        zoomStartUrl: meeting.start_url,
      },
    });

    return NextResponse.json({
      meetingId: meeting.id,
      joinUrl: meeting.join_url,
      startUrl: meeting.start_url,
      class: updated,
    });
  } catch (error) {
    console.error("Zoom meeting oluşturma hatası:", error);
    return NextResponse.json(
      { error: "Zoom toplantısı oluşturulamadı" },
      { status: 500 }
    );
  }
}
