import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Seed'den gelen sahte Shopier ID'leri bul (sub- veya pkg- ile başlayanlar)
  const products = await prisma.product.findMany({
    where: {
      gumroadId: { not: null },
      OR: [
        { gumroadId: { startsWith: "sub-" } },
        { gumroadId: { startsWith: "pkg-" } },
      ],
    },
  });

  console.log(`${products.length} sahte Shopier ID'li ürün bulundu:\n`);

  for (const p of products) {
    console.log(`  - ${p.name} (${p.gumroadId}) → null`);
    await prisma.product.update({
      where: { id: p.id },
      data: { gumroadId: null },
    });
  }

  console.log(`\nToplam ${products.length} ürünün Shopier ID'si temizlendi.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
