"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClassCard from "@/components/ClassCard";
import { useQuery } from "@tanstack/react-query";
import { formatPrice } from "@/lib/utils";

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

const fallbackClasses = [
  {
    id: "1",
    name: "Hand Stand Serisi",
    description: "Hand Stand pozlarına odaklanan yoğun bir seri.",
    price: 2150000,
    type: "package",
    duration: "8 hafta",
    difficulty: "Advanced",
    image: "/images/handstand.png",
  },
  {
    id: "2",
    name: "Streching Serisi",
    description: "Esneklik ve hareket açıklığını geliştirmeye adanmış pratik.",
    price: 990000,
    type: "package",
    duration: "4 hafta",
    difficulty: "Beginner",
    image: "/images/streching2.jpg",
  },
  {
    id: "3",
    name: "Kundalini Serisi",
    description: "Nefes, hareket ve meditasyonla içsel gücünü uyandır.",
    price: 790000,
    type: "package",
    duration: "4 hafta",
    difficulty: "Intermediate",
    image: "/images/kundalini.jpg",
  },
  {
    id: "4",
    name: "Güç ve Denge Serisi",
    description: "Denge ve güç hareketleriyle bedeni stabilize et, zihni odakla.",
    price: 990000,
    type: "package",
    duration: "4 hafta",
    difficulty: "Beginner",
    image: "/images/gucvedenge.png",
  },
];

export default function ClassesPage() {
  const { data: products } = useQuery<Product[]>({
    queryKey: ["products", "package"],
    queryFn: () => fetch("/api/products?type=package").then((r) => r.json()),
    placeholderData: fallbackClasses,
  });

  const classes = products || fallbackClasses;

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Bölümü */}
      <section className="pt-32 pb-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Açık Eğitimler</h1>
            <p className="text-xl text-muted-foreground">
              Tüm paketler birebir ve online olarak sunulur. Keşfedin.
            </p>
          </div>
        </div>
      </section>

      {/* Ders Listesi */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            {classes.map((classItem, index) => (
              <div
                key={classItem.id}
                className="animate-slide-up w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] xl:w-[calc(25%-1.5rem)]"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ClassCard
                  title={classItem.name}
                  description={classItem.description || ""}
                  duration={classItem.duration || ""}
                  difficulty={classItem.difficulty as "Beginner" | "Intermediate" | "Advanced"}
                  image={classItem.image || ""}
                  price={formatPrice(classItem.price)}
                  productId={classItem.id}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bilgi Bölümü */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Canlı & Kayıtlı Dersler</h2>
            <p className="text-lg text-primary-foreground/90 mb-8">
              Premium üyeler canlı interaktif derslere ve tüm kayıtlı ders kütüphanesine
              erişim kazanır. İstediğiniz zaman, istediğiniz yerde, kendi hızınızda pratik yapın.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="animate-fade-in">
                <div className="text-4xl font-bold mb-2">4+</div>
                <div className="text-primary-foreground/80">Aylık Canlı Ders</div>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <div className="text-4xl font-bold mb-2">10+</div>
                <div className="text-primary-foreground/80">Kayıtlı Ders</div>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <div className="text-4xl font-bold mb-2">7/24</div>
                <div className="text-primary-foreground/80">Her Zaman Erişim</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
