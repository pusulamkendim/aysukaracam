import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();

  const cls = await prisma.class.findUnique({
    where: { id },
    include: {
      product: true,
      _count: { select: { enrollments: true } },
    },
  });

  if (!cls) {
    return NextResponse.json({ error: "Ders bulunamadı" }, { status: 404 });
  }

  // Zoom linklerini sadece kayıtlı kullanıcılara göster
  let showZoomLinks = false;
  if (session?.user?.id) {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_classId: {
          userId: session.user.id,
          classId: id,
        },
      },
    });
    showZoomLinks = !!enrollment || session.user.role === "ADMIN";
  }

  return NextResponse.json({
    ...cls,
    zoomJoinUrl: showZoomLinks ? cls.zoomJoinUrl : null,
    zoomStartUrl:
      session?.user?.role === "ADMIN" ? cls.zoomStartUrl : null,
  });
}
