"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const errorMessages: Record<string, string> = {
  Configuration: "Sunucu yapılandırma hatası. Lütfen daha sonra tekrar deneyin.",
  AccessDenied: "Erişim reddedildi. Bu hesapla giriş yapma yetkiniz yok.",
  Verification: "Doğrulama bağlantısının süresi dolmuş. Lütfen tekrar deneyin.",
  Default: "Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.",
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const errorType = searchParams.get("error") || "Default";
  const message = errorMessages[errorType] || errorMessages.Default;

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-card rounded-xl p-8 shadow-[var(--shadow-soft)] animate-fade-in">
              <div className="text-6xl mb-4">:(</div>
              <h1 className="text-2xl font-bold mb-4">Bir Hata Oluştu</h1>
              <p className="text-muted-foreground mb-8">{message}</p>
              <div className="flex flex-col gap-3">
                <Link href="/auth/giris">
                  <Button className="w-full">Tekrar Dene</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    Ana Sayfaya Dön
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
