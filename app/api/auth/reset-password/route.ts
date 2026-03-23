import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const { token, email, password } = await request.json();

  if (!token || !email || !password) {
    return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Şifre en az 6 karakter olmalıdır" }, { status: 400 });
  }

  // Token doğrula
  const verificationToken = await prisma.verificationToken.findFirst({
    where: { identifier: email, token },
  });

  if (!verificationToken) {
    return NextResponse.json({ error: "Geçersiz veya süresi dolmuş bağlantı" }, { status: 400 });
  }

  if (verificationToken.expires < new Date()) {
    await prisma.verificationToken.delete({
      where: { identifier_token: { identifier: email, token } },
    });
    return NextResponse.json({ error: "Bağlantının süresi dolmuş" }, { status: 400 });
  }

  // Şifreyi güncelle
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.update({
    where: { email },
    data: { passwordHash },
  });

  // Token'ı sil
  await prisma.verificationToken.delete({
    where: { identifier_token: { identifier: email, token } },
  });

  return NextResponse.json({ message: "Şifreniz başarıyla güncellendi" });
}
