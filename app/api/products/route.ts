import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type"); // "subscription" | "package"

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(type ? { type } : {}),
    },
    orderBy: { price: "asc" },
  });

  return NextResponse.json(products);
}
