import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "Aysu Itır Karaçam <noreply@pusulamkendim.com>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "necipsulbu@gmail.com";

export async function sendPaymentConfirmation(to: string, customerName: string, items: string[], total: string) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Ödemeniz Onaylandı",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2d5a3d;">Ödemeniz Başarıyla Alındı</h2>
          <p>Merhaba ${customerName || ""},</p>
          <p>Ödemeniz onaylanmıştır. Satın aldığınız paketler:</p>
          <ul>
            ${items.map((item) => `<li>${item}</li>`).join("")}
          </ul>
          <p><strong>Toplam: ${total}</strong></p>
          <p>Derslerinize <a href="https://aysu.pusulamkendim.com/dashboard">dashboard</a> üzerinden erişebilirsiniz.</p>
          <br/>
          <p>Namaste 🧘</p>
          <p><em>Aysu Itır Karaçam</em></p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Mail gönderme hatası (müşteri):", error);
  }
}

export async function sendPaymentNotificationToAdmin(customerName: string, customerEmail: string, items: string[], total: string) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `Yeni Ödeme: ${customerName || customerEmail}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2d5a3d;">Yeni Ödeme Alındı</h2>
          <p><strong>Müşteri:</strong> ${customerName || "-"} (${customerEmail})</p>
          <p><strong>Ürünler:</strong></p>
          <ul>
            ${items.map((item) => `<li>${item}</li>`).join("")}
          </ul>
          <p><strong>Toplam: ${total}</strong></p>
          <p><a href="https://aysu.pusulamkendim.com/admin/siparisler">Siparişleri Görüntüle</a></p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Mail gönderme hatası (admin):", error);
  }
}

export async function sendContactForm(name: string, email: string, message: string) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: `İletişim Formu: ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2d5a3d;">Yeni İletişim Mesajı</h2>
          <p><strong>İsim:</strong> ${name}</p>
          <p><strong>E-posta:</strong> ${email}</p>
          <p><strong>Mesaj:</strong></p>
          <p style="background: #f5f5f5; padding: 16px; border-radius: 8px;">${message}</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Mail gönderme hatası (iletişim):", error);
  }
}

export async function sendWelcomeEmail(to: string, name: string) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Hoş Geldiniz!",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2d5a3d;">Hoş Geldiniz!</h2>
          <p>Merhaba ${name || ""},</p>
          <p>Platformumuza kayıt olduğunuz için teşekkür ederiz.</p>
          <p>Derslerimizi keşfetmek için <a href="https://aysu.pusulamkendim.com/classes">buraya tıklayın</a>.</p>
          <br/>
          <p>Namaste 🧘</p>
          <p><em>Aysu Itır Karaçam</em></p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Mail gönderme hatası (hoş geldin):", error);
  }
}

export async function sendEnrollmentNotification(
  to: string,
  name: string,
  classTitle: string,
  scheduledAt: string | null,
  duration: number | null,
  zoomJoinUrl: string | null,
) {
  const dateStr = scheduledAt
    ? new Date(scheduledAt).toLocaleDateString("tr-TR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Derse Kaydınız: ${classTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2d5a3d;">Derse Kaydınız Tamamlandı</h2>
          <p>Merhaba ${name || ""},</p>
          <p><strong>${classTitle}</strong> dersine kaydınız yapılmıştır.</p>
          ${dateStr ? `<p>📅 <strong>Tarih:</strong> ${dateStr}</p>` : ""}
          ${duration ? `<p>⏱ <strong>Süre:</strong> ${duration} dakika</p>` : ""}
          ${zoomJoinUrl ? `<p>🔗 <strong>Zoom Linki:</strong> <a href="${zoomJoinUrl}">${zoomJoinUrl}</a></p>` : ""}
          <p>Derslerinize <a href="https://aysu.pusulamkendim.com/dashboard">dashboard</a> üzerinden erişebilirsiniz.</p>
          <br/>
          <p>Namaste 🧘</p>
          <p><em>Aysu Itır Karaçam</em></p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Mail gönderme hatası (enrollment):", error);
  }
}
