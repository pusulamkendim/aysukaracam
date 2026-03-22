import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const SHOPIER_API = "https://api.shopier.com/v1";

async function createOnShopier(name: string, description: string, priceKurus: number, imageUrl?: string) {
  const token = process.env.SHOPIER_API_TOKEN;
  if (!token) return null;

  try {
    const res = await fetch(`${SHOPIER_API}/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        title: name,
        description: description || name,
        type: "digital",
        shippingPayer: "sellerPays",
        priceData: { price: priceKurus / 100, currency: "TRY" },
        media: [{ url: imageUrl && imageUrl.startsWith("http") ? imageUrl : "https://placehold.co/400x400.png", type: "image", placement: 1 }],
        stockQuantity: 1000,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Shopier API hata response:", res.status, err);
      return null;
    }

    const data = await res.json();
    return data.id as string;
  } catch (error) {
    console.error("Shopier fetch hatası:", error);
    return null;
  }
}

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

  let shopierProductId = body.gumroadId || null;

  if (!shopierProductId && body.price > 0) {
    shopierProductId = await createOnShopier(
      body.name,
      body.description || body.name,
      body.price,
      body.image || undefined,
    );
  }

  const product = await prisma.product.create({
    data: {
      name: body.name,
      description: body.description,
      price: body.price,
      type: body.type,
      duration: body.duration,
      difficulty: body.difficulty,
      image: body.image,
      gumroadId: shopierProductId,
      features: body.features || [],
      isActive: body.isActive ?? true,
    },
  });

  return NextResponse.json(product, { status: 201 });
}
