import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = "Aysu Itır Karaçam <noreply@pusulamkendim.com>";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "E-posta gerekli" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Kullanıcı bulunamasa bile aynı mesajı dön (güvenlik)
  if (!user) {
    return NextResponse.json({ message: "Eğer bu e-posta kayıtlıysa, şifre sıfırlama bağlantısı gönderildi." });
  }

  // Eski tokenları temizle
  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  });

  // Yeni token oluştur (1 saat geçerli)
  const token = crypto.randomBytes(32).toString("hex");
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires: new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  const baseUrl = process.env.AUTH_URL || "https://aysu.pusulamkendim.com";
  const resetUrl = `${baseUrl}/auth/sifre-yenile?token=${token}&email=${encodeURIComponent(email)}`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Şifre Sıfırlama",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2d5a3d;">Şifre Sıfırlama</h2>
          <p>Merhaba ${user.name || ""},</p>
          <p>Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:</p>
          <p><a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #2d5a3d; color: white; text-decoration: none; border-radius: 8px;">Şifremi Sıfırla</a></p>
          <p style="color: #666; font-size: 14px;">Bu bağlantı 1 saat geçerlidir. Eğer bu talebi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
          <br/>
          <p><em>Aysu Itır Karaçam</em></p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Şifre sıfırlama maili hatası:", error);
  }

  return NextResponse.json({ message: "Eğer bu e-posta kayıtlıysa, şifre sıfırlama bağlantısı gönderildi." });
}
