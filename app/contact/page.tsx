"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
  {
    icon: MapPin,
    title: "Adres",
    content: "Aliağa, İzmir, Türkiye",
  },
  {
    icon: Phone,
    title: "Telefon",
    content: "+90 542 564 52 36",
  },
  {
    icon: Mail,
    title: "E-posta",
    content: "aysuitirkaracam@gmail.com",
  },
  {
    icon: Clock,
    title: "Çalışma Saatleri",
    content: "Pzt-Cmt: 06:00 - 21:00, Paz: 07:00 - 19:00",
  },
];

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen tüm zorunlu alanları doldurun.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Mesaj Gönderildi!",
      description: "Bana ulaştığınız için teşekkürler. En kısa sürede size dönüş yapacağım.",
    });

    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Bölümü */}
      <section className="pt-32 pb-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">İletişime Geçin</h1>
            <p className="text-xl text-muted-foreground">
              Sorularınız mı var? Sizden haber almaktan mutluluk duyarım. Bana mesaj gönderin,
              en kısa sürede yanıtlayacağım.
            </p>
          </div>
        </div>
      </section>

      {/* İletişim Bilgi Kartları */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card
                  key={index}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="pt-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                      <Icon className="text-primary" size={24} />
                    </div>
                    <h3 className="font-semibold mb-2">{info.title}</h3>
                    <p className="text-sm text-muted-foreground">{info.content}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* İletişim Formu & Harita */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="animate-fade-in">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-6">Bana Mesaj Gönderin</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Ad Soyad *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Adınız soyadınız"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-posta *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="ornek@email.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefon</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+90 5XX XXX XX XX"
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Mesaj *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Size nasıl yardımcı olabileceğimizi yazın..."
                        rows={5}
                        required
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full">
                      Mesaj Gönder
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Harita */}
            <div className="animate-fade-in">
              <div className="h-full min-h-[400px] rounded-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24911.123456789!2d26.9733!3d38.8021!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b96b2a2a2a2a2b%3A0x1234567890abcdef!2sAlia%C4%9Fa%2C%20%C4%B0zmir!5e0!3m2!1str!2str!4v1653377778431!5m2!1str!2str"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "500px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Aysu Itır Karaçam Yoga Stüdyosu - Aliağa, İzmir"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Bölümü */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">İsterseniz hızlı biçimde Whatsapp'tan bana ulaşın.</h2>
          <p className="text-lg text-primary-foreground/90 mb-6">
            Anında destek için WhatsApp üzerinden bana ulaşın.
          </p>
          <a
            href="https://wa.me/905425645236"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" variant="secondary">
              WhatsApp ile Yazın
            </Button>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
