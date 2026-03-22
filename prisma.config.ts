import path from "node:path";
import { defineConfig } from "prisma/config";
import { config } from "dotenv";

// Lokal geliştirme için .env.local, production'da Coolify env variable'ları kullanılır
config({ path: ".env.local" });
config({ path: ".env" });

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    seed: "npx tsx prisma/seed.ts",
  },
});
