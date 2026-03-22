import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const productId = searchParams.get("productId");
  const type = searchParams.get("type");
  const upcoming = searchParams.get("upcoming");

  const classes = await prisma.class.findMany({
    where: {
      isActive: true,
      ...(productId ? { productId } : {}),
      ...(type ? { type: type as "LIVE" | "RECORDED" | "PACKAGE" } : {}),
      ...(upcoming === "true"
        ? { scheduledAt: { gte: new Date() } }
        : {}),
    },
    include: {
      product: {
        select: { name: true, image: true },
      },
      _count: {
        select: { enrollments: true },
      },
    },
    orderBy: { scheduledAt: "asc" },
  });

  return NextResponse.json(classes);
}
