import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Admin kullanıcıları oluştur
  const adminPassword = await bcrypt.hash("admin123456", 12);

  const admin1 = await prisma.user.upsert({
    where: { email: "aysu@aysukaracam.com" },
    update: {},
    create: {
      name: "Aysu Itır Karaçam",
      email: "aysu@aysukaracam.com",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  const admin2 = await prisma.user.upsert({
    where: { email: "necip@aysukaracam.com" },
    update: {},
    create: {
      name: "Necip Sülbü",
      email: "necip@aysukaracam.com",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin kullanıcıları oluşturuldu:", admin1.email, admin2.email);

  // Abonelik ürünleri
  const subscriptions = [
    {
      name: "Ücretsiz Deneme",
      description: "Platformumu denemek için mükemmel başlangıç",
      price: 0,
      type: "subscription",
      features: [
        "7 gün tam erişim",
        "1 canlı derse katılım",
        "3 kayıtlı ders",
        "Temel ilerleme takibi",
        "Topluluk forumuna erişim",
      ],
    },
    {
      name: "Standart",
      description: "Düzenli pratik yapanlar için",
      price: 490000, // 4.900 TL (kuruş)
      type: "subscription",
      features: [
        "Sınırsız kayıtlı ders",
        "Ayda 4 grup canlı dersi",
        "Gelişmiş ilerleme takibi",
        "İndirilebilir kaynaklar",
        "Öncelikli e-posta desteği",
        "Aylık sağlık bülteni",
      ],
    },
    {
      name: "Premium",
      description: "Eksiksiz sağlık deneyimi",
      price: 990000, // 9.900 TL (kuruş)
      type: "subscription",
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
    },
  ];

  // Paket ürünleri
  const packages = [
    {
      name: "Hand Stand Serisi",
      description: "Hand Stand pozlarına odaklanan yoğun bir seri.",
      price: 2150000, // 21.500 TL
      type: "package",
      duration: "8 hafta",
      difficulty: "Advanced",
      image: "/images/handstand.png",
    },
    {
      name: "Streching Serisi",
      description: "Esneklik ve hareket açıklığını geliştirmeye adanmış pratik.",
      price: 990000, // 9.900 TL
      type: "package",
      duration: "4 hafta",
      difficulty: "Beginner",
      image: "/images/streching2.jpg",
    },
    {
      name: "Kundalini Serisi",
      description: "Nefes, hareket ve meditasyonla içsel gücünü uyandır.",
      price: 790000, // 7.900 TL
      type: "package",
      duration: "4 hafta",
      difficulty: "Intermediate",
      image: "/images/kundalini.jpg",
    },
    {
      name: "Güç ve Denge Serisi",
      description: "Denge ve güç hareketleriyle bedeni stabilize et, zihni odakla.",
      price: 990000, // 9.900 TL
      type: "package",
      duration: "4 hafta",
      difficulty: "Beginner",
      image: "/images/gucvedenge.png",
    },
  ];

  for (const sub of subscriptions) {
    await prisma.product.upsert({
      where: { gumroadId: `sub-${sub.name.toLowerCase().replace(/\s+/g, "-")}` },
      update: {},
      create: {
        ...sub,
        gumroadId: `sub-${sub.name.toLowerCase().replace(/\s+/g, "-")}`,
      },
    });
  }

  for (const pkg of packages) {
    await prisma.product.upsert({
      where: { gumroadId: `pkg-${pkg.name.toLowerCase().replace(/\s+/g, "-")}` },
      update: {},
      create: {
        ...pkg,
        gumroadId: `pkg-${pkg.name.toLowerCase().replace(/\s+/g, "-")}`,
      },
    });
  }

  console.log("Ürünler oluşturuldu: 3 abonelik + 4 paket");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
