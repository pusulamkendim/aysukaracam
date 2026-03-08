import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Serenity Yoga | Transform Your Mind & Body",
  description:
    "Join Serenity Yoga for transformative yoga lessons. Subscribe to premium plans for live and recorded sessions. Start your wellness journey today.",
  authors: [{ name: "Serenity Yoga" }],
  openGraph: {
    title: "Serenity Yoga | Transform Your Mind & Body",
    description:
      "Join Serenity Yoga for transformative yoga lessons. Subscribe to premium plans for live and recorded sessions.",
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
    <html lang="en">
      <body className={`${playfairDisplay.variable} ${poppins.variable}`}>
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
