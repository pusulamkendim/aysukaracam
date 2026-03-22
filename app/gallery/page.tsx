import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TestimonialCard from "@/components/TestimonialCard";

const galleryImages = [
  { src: "/images/hero-yoga.jpg", alt: "Açık havada huzurlu yoga seansı" },
  { src: "/images/hatha-yoga.jpg", alt: "Stüdyoda Hatha yoga dersi" },
  { src: "/images/vinyasa-yoga.jpg", alt: "Dinamik vinyasa akış seansı" },
  { src: "/images/power-yoga.jpg", alt: "Power yoga antrenman dersi" },
  { src: "/images/meditation.jpg", alt: "Meditasyon ve farkındalık pratiği" },
  { src: "/images/hatha-yoga.jpg", alt: "Sabah yoga pratiği" },
];

const testimonials = [
  {
    name: "Ayşe Yılmaz",
    role: "Yoga Tutkunu",
    content: "Bu yoga stüdyosu hayatımı değiştirdi. Eğitmen çok bilgili ve topluluk inanılmaz derecede destekleyici. Kendimi hiç bu kadar iyi hissetmemiştim!",
    rating: 5,
  },
  {
    name: "Mehmet Kaya",
    role: "Premium Üye",
    content: "Sağlık yolculuğumda yaptığım en iyi yatırım. Canlı dersler inanılmaz ve kişiselleştirilmiş rehberlik ilerlememde çok yardımcı oldu.",
    rating: 5,
  },
  {
    name: "Elif Demir",
    role: "Yeni Başlayan",
    content: "Tamamen yeni başlayan biri olarak kendimi her adımda hoş karşılanmış ve yönlendirilmiş hissettim. Buradaki topluluk harika!",
    rating: 5,
  },
  {
    name: "Can Özkan",
    role: "Standart Üye",
    content: "Ders çeşitliliği beni sürekli motive ediyor. Power yogadan meditasyona, her ruh haline ve hedefe uygun bir şey var.",
    rating: 5,
  },
  {
    name: "Zeynep Aydın",
    role: "Premium Üye",
    content: "Aylık danışmanlıklar oyun değiştirici oldu. Kişiselleştirilmiş rehberlik pratiğimde büyük fark yarattı.",
    rating: 5,
  },
  {
    name: "Burak Şahin",
    role: "Yoga Tutkunu",
    content: "Birçok online yoga platformu denedim ama bu stüdyo fark yaratıyor. Eğitim kalitesi ve topluluk desteği eşsiz.",
    rating: 5,
  },
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Bölümü */}
      <section className="pt-32 pb-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Galeri & Yorumlar</h1>
            <p className="text-xl text-muted-foreground">
              Yoga topluluğumuzdan anları keşfedin ve harika öğrencilerimizden dinleyin
            </p>
          </div>
        </div>
      </section>

      {/* Galeri Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 animate-fade-in">
            Stüdyo Anları
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <p className="text-white p-6 font-medium">{image.alt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Öğrenci Yorumları */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 animate-fade-in">
            Beni Öğrencilerimden Duyun
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Yoga ile hayatını dönüştüren binlerce memnun öğrenciye katılın
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <TestimonialCard {...testimonial} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* İstatistikler */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Etkimiz</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center animate-fade-in">
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-primary-foreground/80">Mutlu Öğrenci</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-5xl font-bold mb-2">1000+</div>
              <div className="text-primary-foreground/80">Verilen Ders</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-5xl font-bold mb-2">4.9/5</div>
              <div className="text-primary-foreground/80">Ortalama Puan</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-5xl font-bold mb-2">10+</div>
              <div className="text-primary-foreground/80">Yıl Deneyim</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
