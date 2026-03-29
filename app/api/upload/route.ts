import { auth } from "@/lib/auth";
import { uploadToR2 } from "@/lib/r2";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Dosya gerekli" }, { status: 400 });
  }

  // Dosya tipi kontrolü
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/heic", "image/heif"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: "Sadece JPEG, PNG, WebP ve GIF dosyaları kabul edilir" },
      { status: 400 }
    );
  }

  // Dosya boyutu kontrolü (10MB)
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Dosya boyutu en fazla 10MB olabilir" },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Benzersiz dosya adı oluştur
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  try {
    const url = await uploadToR2(buffer, filename, file.type);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("R2 upload hatası:", error);
    return NextResponse.json(
      { error: "Görsel yüklenirken hata oluştu" },
      { status: 500 }
    );
  }
}
