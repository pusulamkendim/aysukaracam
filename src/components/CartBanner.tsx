"use client";

import { useCart } from "@/hooks/use-cart";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";

export default function CartBanner() {
  const { data: session } = useSession();
  const { itemCount, total } = useCart();
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(false);

  // Sepet sayfasında, auth sayfalarında veya admin'de gösterme
  if (
    !session ||
    itemCount === 0 ||
    dismissed ||
    pathname === "/cart" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/admin")
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-primary text-primary-foreground shadow-lg border-t border-primary/20">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingCart size={20} />
          <span className="font-medium">
            Sepetinizde {itemCount} ürün var
          </span>
          <span className="hidden sm:inline text-primary-foreground/80">
            — Toplam: {formatPrice(total)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/cart">
            <Button variant="secondary" size="sm">
              Ödemeyi Tamamla
            </Button>
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded hover:bg-primary-foreground/10 transition-colors"
            aria-label="Kapat"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
