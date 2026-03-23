"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingCard from "@/components/PricingCard";
import { Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  features: string[];
}

const fallbackPlans = [
  {
    title: "Ücretsiz Deneme",
    price: "Ücretsiz",
    description: "Platformumu denemek için mükemmel başlangıç",
    features: [
      "7 gün tam erişim",
      "1 canlı derse katılım",
      "3 kayıtlı ders",
      "Temel ilerleme takibi",
      "Topluluk forumuna erişim",
    ],
    buttonText: "Ücretsiz Deneyin",
  },
  {
    title: "Standart",
    price: "₺4.900",
    description: "Düzenli pratik yapanlar için",
    features: [
      "Sınırsız kayıtlı ders",
      "Ayda 4 grup canlı dersi",
      "Gelişmiş ilerleme takibi",
      "İndirilebilir kaynaklar",
      "Öncelikli e-posta desteği",
      "Aylık sağlık bülteni",
    ],
    buttonText: "Başla",
  },
  {
    title: "Premium",
    price: "₺9.900",
    description: "Eksiksiz sağlık deneyimi",
    features: [
      "Standart'taki her şey",
      "Tüm grup canlı derslere erişim",
      "Aylık 1'e 1 danışmanlık",
      "Kişiselleştirilmiş pratik planları",
      "Yüzyüze kamplara özel indirimler",
      "Yeni içeriklere erken erişim",
      "Öncelikli rezervasyon",
      "Kişiye özel beslenme önerileri",
    ],
    isPopular: true,
    buttonText: "Premium'a Geç",
  },
];

const faqs = [
  {
    question: "Aboneliğimi istediğim zaman iptal edebilir miyim?",
    answer: "Evet, aboneliğinizi istediğiniz zaman iptal edebilirsiniz. Erişiminiz fatura döneminizin sonuna kadar devam eder.",
  },
  {
    question: "Herhangi bir ekipmana ihtiyacım var mı?",
    answer: "Tek ihtiyacınız bir yoga matı ve rahat kıyafetler. Blok ve kayış gibi yardımcı araçlar isteğe bağlıdır ancak pratiğinizi zenginleştirebilir.",
  },
  {
    question: "Dersler yeni başlayanlar için uygun mu?",
    answer: "Kesinlikle! Tamamen yeni başlayanlardan ileri düzey uygulayıcılara kadar her seviye için dersler sunuyorum.",
  },
  {
    question: "Canlı derslere neler dahil?",
    answer: "Canlı dersler gerçek zamanlı eğitim, soru sorma imkanı ve eğitmenimizden kişiselleştirilmiş geri bildirim içerir.",
  },
];

export default function PricingPage() {
  const { data: products } = useQuery<Product[]>({
    queryKey: ["products", "subscription"],
    queryFn: () => fetch("/api/products?type=subscription").then((r) => r.json()),
  });

  // API'den gelen ürünleri PricingCard formatına çevir
  const plans = products && products.length > 0
    ? products.map((p, index) => ({
        title: p.name,
        price: formatPrice(p.price),
        description: p.description || "",
        features: p.features,
        isPopular: index === products.length - 1, // en pahalısı popüler
        buttonText: p.price === 0 ? "Ücretsiz Deneyin" : "Başla",
        productId: p.id,
      }))
    : fallbackPlans;

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Bölümü */}
      <section className="pt-32 pb-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Planınızı Seçin</h1>
            <p className="text-xl text-muted-foreground">
              Yaşam tarzınıza uygun bir planla yoga yolculuğunuza bugün başlayın.
              Tüm planlar destekleyici topluluk platformuna erişim içerir.
            </p>
          </div>
        </div>
      </section>

      {/* Fiyat Kartları */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className="animate-slide-up w-full md:w-[calc(33.333%-1.5rem)]"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <PricingCard {...plan} />
              </div>
            ))}
          </div>

          {/* Para iade garantisi - geçici olarak gizlendi
          <div className="text-center mt-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-secondary/20 rounded-full">
              <Check className="text-secondary" size={20} />
              <span className="text-sm font-medium">30 gün para iade garantisi</span>
            </div>
          </div>
          */}
        </div>
      </section>

      {/* Karşılaştırma Tablosu - geçici olarak gizlendi
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 animate-fade-in">
              Planları Karşılaştırın
            </h2>
            <div className="bg-card rounded-xl shadow-[var(--shadow-soft)] overflow-hidden">
              <table className="w-full">
                <thead className="bg-primary text-primary-foreground">
                  <tr>
                    <th className="text-left p-4">Özellik</th>
                    {plans.map((plan, i) => (
                      <th key={i} className="text-center p-4">{plan.title}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-4">Kayıtlı Dersler</td>
                    <td className="text-center p-4">3</td>
                    <td className="text-center p-4">Sınırsız</td>
                    <td className="text-center p-4">Sınırsız</td>
                  </tr>
                  <tr>
                    <td className="p-4">Canlı Dersler</td>
                    <td className="text-center p-4">1</td>
                    <td className="text-center p-4">Ayda 5</td>
                    <td className="text-center p-4">Sınırsız</td>
                  </tr>
                  <tr>
                    <td className="p-4">İlerleme Takibi</td>
                    <td className="text-center p-4"><Check className="mx-auto text-secondary" size={20} /></td>
                    <td className="text-center p-4"><Check className="mx-auto text-secondary" size={20} /></td>
                    <td className="text-center p-4"><Check className="mx-auto text-secondary" size={20} /></td>
                  </tr>
                  <tr>
                    <td className="p-4">1'e 1 Danışmanlık</td>
                    <td className="text-center p-4">-</td>
                    <td className="text-center p-4">-</td>
                    <td className="text-center p-4"><Check className="mx-auto text-secondary" size={20} /></td>
                  </tr>
                  <tr>
                    <td className="p-4">Kişisel Planlar</td>
                    <td className="text-center p-4">-</td>
                    <td className="text-center p-4">-</td>
                    <td className="text-center p-4"><Check className="mx-auto text-secondary" size={20} /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      */}

      {/* SSS */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 animate-fade-in">
              Sıkça Sorulan Sorular
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-card shadow-[var(--shadow-soft)] animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                  <p className="text-foreground/80">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
