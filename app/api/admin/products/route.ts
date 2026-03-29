import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { orderItems: true, classes: true } },
    },
  });

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  const body = await request.json();

  const product = await prisma.product.create({
    data: {
      name: body.name,
      description: body.description,
      price: body.price,
      type: body.type,
      duration: body.duration,
      difficulty: body.difficulty,
      image: body.image,
      gumroadId: body.gumroadId || null,
      features: body.features || [],
      isActive: body.isActive ?? true,
    },
  });

  return NextResponse.json(product, { status: 201 });
}
