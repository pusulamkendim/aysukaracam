import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(2),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    // TODO: E-posta gönderimi (Resend, Nodemailer vb.) eklenebilir
    // Şimdilik logluyoruz
    console.log("Yeni iletişim mesajı:", parsed.data);

    return NextResponse.json(
      { message: "Mesajınız alındı, en kısa sürede dönüş yapacağız." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Mesaj gönderilemedi" },
      { status: 500 }
    );
  }
}
