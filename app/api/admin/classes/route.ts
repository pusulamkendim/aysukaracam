import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  const classes = await prisma.class.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: { select: { name: true } },
      enrollments: {
        include: {
          user: { select: { id: true, name: true, email: true } },
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

  const cls = await prisma.class.create({
    data: {
      title: body.title,
      description: body.description,
      type: body.type || "LIVE",
      productId: body.productId || null,
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
      duration: body.duration,
      recordingUrl: body.recordingUrl,
      isActive: body.isActive ?? true,
    },
  });

  // Seçilen kullanıcılara enrollment oluştur
  if (body.enrolledUserIds && body.enrolledUserIds.length > 0) {
    await prisma.enrollment.createMany({
      data: body.enrolledUserIds.map((userId: string) => ({
        userId,
        classId: cls.id,
      })),
      skipDuplicates: true,
    });
  }

  return NextResponse.json(cls, { status: 201 });
}
