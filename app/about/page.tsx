import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutSlider from "@/components/AboutSlider";
import { Award, Heart, Users, Star } from "lucide-react";

const certifications = [
  "200 Saat RYT Sertifikalı",
  "İleri Düzey Vinyasa Uzmanı",
  "Meditasyon & Farkındalık Koçu",
];

const achievements = [
  { icon: Users, label: "500+ Öğrenci", value: "Eğitim" },
  { icon: Award, label: "10+ Yıl", value: "Deneyim" },
  { icon: Heart, label: "10.000+ Saat", value: "Pratik" },
  { icon: Star, label: "4.9/5", value: "Puan" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Bölümü */}
      <section className="pt-32 pb-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Eğitmeninizle Tanışın</h1>
            <p className="text-xl text-muted-foreground">
              Sağlık, denge ve iç huzur yolculuğunuzda size rehberlik etmeye hazırım.
            </p>
          </div>
        </div>
      </section>

      {/* Ana İçerik */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AboutSlider />
            <div className="space-y-6 animate-slide-up">
              <h2 className="text-4xl font-bold">Aysu Itır Karaçam Hakkında</h2>
              <p className="text-lg text-foreground/80">
                On yılı aşkın özveriyle sürdürdüğüm pratik ve eğitimle, binlerce öğrenciye
                yoga yolculuklarında rehberlik etme ayrıcalığına sahip oldum. Yaklaşımım,
                dönüştürücü bir deneyim yaratmak için geleneksel bilgeliği modern sağlık
                bilimiyle harmanlar.
              </p>
              <p className="text-lg text-foreground/80">
                Yoganın sadece fiziksel pozlardan ibaret olmadığına inanıyorum — zihni, bedeni
                ve ruhu besleyen bütünsel bir pratiktir. İster tamamen yeni başlayan olun ister
                deneyimli bir uygulayıcı, derslerim sizi olduğunuz yerde karşılamak için
                tasarlanmıştır.
              </p>
              <div className="pt-4">
                <h3 className="text-2xl font-semibold mb-4">Sertifikalar</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {certifications.map((cert, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>{cert}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* İstatistikler */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={index}
                  className="text-center animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Icon className="mx-auto mb-3" size={40} />
                  <div className="text-3xl font-bold mb-1">{achievement.value}</div>
                  <div className="text-primary-foreground/80">{achievement.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Öğretim Felsefesi */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 animate-fade-in">
              Öğretim Felsefem
            </h2>
            <div className="space-y-8">
              <div className="p-8 rounded-xl bg-muted/30 animate-slide-up">
                <h3 className="text-2xl font-semibold mb-4">Bilinçli Hareket</h3>
                <p className="text-foreground/80">
                  Her pratik, kendinizle bağlantı kurma fırsatıdır. Bedeninizin benzersiz
                  yeteneklerini ve sınırlarını onurlandıran bilinçli hareketi vurguluyorum.
                </p>
              </div>
              <div className="p-8 rounded-xl bg-muted/30 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-2xl font-semibold mb-4">Temel Olarak Nefes</h3>
                <p className="text-foreground/80">
                  Nefes, beden ile zihin arasındaki köprüdür. Pranayama ve bilinçli nefes
                  aracılığıyla daha derin farkındalık ve huzur seviyelerine ulaşırız.
                </p>
              </div>
              <div className="p-8 rounded-xl bg-muted/30 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-2xl font-semibold mb-4">Topluluk & Destek</h3>
                <p className="text-foreground/80">
                  Yoga, paylaşıldığında en güzel yolculuktur. Herkesin kendini hoş karşılanmış,
                  desteklenmiş ve büyümeye güçlendirilmiş hissettiği sıcak, kapsayıcı bir
                  ortam oluşturuyorum.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
