"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import ClassCard from "@/components/ClassCard";
import TestimonialCard from "@/components/TestimonialCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Award, Heart, Users, TrendingUp } from "lucide-react";
import AboutSlider from "@/components/AboutSlider";
import { useQuery } from "@tanstack/react-query";
import { formatPrice } from "@/lib/utils";

const testimonials = [
  {
    name: "Ayşe Yılmaz",
    role: "Yoga Tutkunu",
    content: "Aysu ile tanışmak hayatımı değiştirdi. Bana kattığı farkındalık ve güç için minnettarım.",
    rating: 5,
  },
  {
    name: "Necip Sülbü",
    role: "Yoldaş",
    content: "Sihir ile gerçeği birleştiren bir insan Itır. İlk tanıştığım andan itibaren bana ilham verdi ve yol gösterdi.",
    rating: 5,
  },
  {
    name: "Elif Demir",
    role: "Yeni Başlayan",
    content: "Tamamen yeni başlayan biri olarak kendimi her adımda karşılanmış ve yönlendirilmiş hissettim.",
    rating: 5,
  },
];

const benefits = [
  {
    icon: Heart,
    title: "Bütünsel Sağlık",
    description: "Bilinçli pratik ile fiziksel ve zihinsel sağlığınızı geliştirin",
  },
  {
    icon: Users,
    title: "Topluluk",
    description: "Benzer düşünen bireylerden oluşan destekleyici bir topluluğa katılın",
  },
  {
    icon: TrendingUp,
    title: "İlerleme Takibi",
    description: "Kişiselleştirilmiş analizlerle yolculuğunuzu izleyin",
  },
];

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  type: string;
  duration: string | null;
  difficulty: string | null;
  image: string | null;
}

export default function HomePage() {
  const { data: products } = useQuery<Product[]>({
    queryKey: ["featured-products"],
    queryFn: () => fetch("/api/products?type=package").then((r) => r.json()),
  });

  const featuredProducts = (products || []).slice(0, 3);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />

      {/* Hakkımda */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AboutSlider />
            <div className="space-y-6 animate-slide-up">
              <h2 className="text-4xl font-bold">Hakkımda</h2>
              <p className="text-lg text-foreground/80">
                On yılı aşkın özveriyle sürdürdüğüm pratik ve eğitimle, binlerce öğrenciye
                yoga yolculuklarında rehberlik etme ayrıcalığına sahip oldum. Yaklaşımım,
                dönüştürücü bir deneyim yaratmak için geleneksel bilgeliği modern sağlık
                bilimiyle harmanlamak üzerine.
              </p>
              <p className="text-lg text-foreground/80">
                Yoganın sadece fiziksel pozlardan ibaret olmadığına inanıyorum — yoga zihni, bedeni
                ve ruhu besleyen bütünsel bir pratiktir. İster tamamen yeni başlayan olun ister
                deneyimli bir uygulayıcı, derslerim sizi olduğunuz yerde karşılamak için
                tasarlanmıştır.
              </p>
              <div className="pt-2">
                <Link href="/about">
                  <Button variant="outline">Daha Fazla Bilgi</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Öne Çıkan Dersler */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4">Öne Çıkan Dersler</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              En popüler yoga derslerimi keşfedin. Her ders birebir ve online olarak sunulur.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <div key={product.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <ClassCard
                  title={product.name}
                  description={product.description || ""}
                  duration={product.duration || ""}
                  difficulty={(product.difficulty as "Beginner" | "Intermediate" | "Advanced") || "Beginner"}
                  image={product.image || ""}
                  price={formatPrice(product.price)}
                  productId={product.id}
                />
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/classes">
              <Button size="lg" variant="outline">
                Tüm Dersleri Gör
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Avantajlar - geçici olarak gizlendi
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4">Neden Bizi Tercih Etmelisiniz?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Matın ötesine geçen dönüştürücü faydaları deneyimleyin.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 rounded-lg bg-card hover:shadow-[var(--shadow-hover)] transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <Icon className="text-primary" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      */}

      {/* Öğrenci Yorumları */}
      <section className="relative py-20">
        <div
          className="absolute inset-0 bg-cover bg-center md:bg-fixed"
          style={{ backgroundImage: "url('/images/2.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4 text-white/85">Beni Öğrencilerimden Duyun</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Bu yolculukta bana katılan öğrencilerimin deneyimlerini keşfedin.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <TestimonialCard {...testimonial} glass />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bölümü */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Dönüşümüne Bugün Başla
            </h2>
            <p className="text-lg mb-8 text-primary-foreground/90">
              Topluluğuma katılın ve daha sağlıklı, daha dengeli bir yaşama doğru yolculuğunuza başlayın.
          
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Fiyat Planlarını Gör
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
                >
                  Bana Ulaşın
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
