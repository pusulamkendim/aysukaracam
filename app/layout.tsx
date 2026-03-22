import type { Metadata } from "next";
import { Playfair_Display, Poppins, Tangerine, Cormorant_Garamond } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Providers from "./providers";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const tangerine = Tangerine({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-script",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-elegant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aysu Itır Karaçam | Yoga ile Bedenini ve Zihnini Dönüştür",
  description:
    "Aysu Itır Karaçam ile dönüştürücü yoga dersleri. Canlı ve kayıtlı dersler için premium planlara abone olun. Sağlık yolculuğunuza bugün başlayın.",
  authors: [{ name: "Aysu Itır Karaçam" }],
  openGraph: {
    title: "Aysu Itır Karaçam | Yoga ile Bedenini ve Zihnini Dönüştür",
    description:
      "Aysu Itır Karaçam ile dönüştürücü yoga dersleri. Canlı ve kayıtlı dersler için premium planlara abone olun.",
    type: "website",
    images: ["https://lovable.dev/opengraph-image-p98pqg.png"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@lovable_dev",
    images: ["https://lovable.dev/opengraph-image-p98pqg.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={`${playfairDisplay.variable} ${poppins.variable} ${tangerine.variable} ${cormorantGaramond.variable}`}>
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
