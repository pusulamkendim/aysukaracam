import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Kuruş cinsinden fiyatı TL formatına çevirir: 490000 → "4.900 ₺" */
export function formatPrice(priceInKurus: number): string {
  if (priceInKurus === 0) return "Ücretsiz";
  const tl = priceInKurus / 100;
  return `${tl.toLocaleString("tr-TR")} ₺`;
}
