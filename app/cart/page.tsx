"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthGuard from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { Trash2, Minus, Plus, ShoppingCart, CreditCard, ExternalLink, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface CheckoutItem {
  name: string;
  quantity: number;
  price: number;
  shopierUrl: string | null;
}

export default function CartPage() {
  const { items, total, isLoading, removeItem, updateQuantity, checkout } =
    useCart();

  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[] | null>(null);

  const handleCheckout = async () => {
    try {
      const result = await checkout.mutateAsync();
      if (result.checkoutItems) {
        setCheckoutItems(result.checkoutItems);
      }
    } catch {
      toast.error("Checkout sırasında bir hata oluştu");
    }
  };

  return (
    <AuthGuard>
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 animate-fade-in">Sepetim</h1>

          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              Yükleniyor...
            </div>
          ) : items.length === 0 && !checkoutItems ? (
            <div className="text-center py-20 animate-fade-in">
              <ShoppingCart
                size={64}
                className="mx-auto text-muted-foreground/50 mb-4"
              />
              <h2 className="text-2xl font-semibold mb-2">Sepetiniz Boş</h2>
              <p className="text-muted-foreground mb-6">
                Henüz sepetinize ürün eklemediniz.
              </p>
              <Link href="/classes">
                <Button>Paketleri Keşfet</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Sepet Öğeleri */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 bg-card rounded-xl p-4 shadow-[var(--shadow-soft)] animate-slide-up"
                  >
                    {item.product.image && (
                      <div className="relative w-28 h-28 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">
                        {item.product.name}
                      </h3>
                      {item.product.description && (
                        <p className="text-muted-foreground text-sm line-clamp-2 mt-0.5">
                          {item.product.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        {item.product.duration && (
                          <span>{item.product.duration}</span>
                        )}
                        {item.product.difficulty && (
                          <span className="px-1.5 py-0.5 rounded bg-muted">
                            {item.product.difficulty}
                          </span>
                        )}
                        <span className="font-medium text-foreground text-sm">
                          {formatPrice(item.product.price)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity.mutate({
                              itemId: item.id,
                              quantity: Math.max(1, item.quantity - 1),
                            })
                          }
                        >
                          <Minus size={14} />
                        </Button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity.mutate({
                              itemId: item.id,
                              quantity: item.quantity + 1,
                            })
                          }
                        >
                          <Plus size={14} />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <span className="font-semibold">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive h-8 w-8"
                        onClick={() => removeItem.mutate(item.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sipariş Özeti */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-xl p-6 shadow-[var(--shadow-soft)] sticky top-24">
                  {checkoutItems ? (
                    <>
                      <div className="flex items-center gap-2 mb-4">
                        <CreditCard size={20} className="text-primary" />
                        <h2 className="text-xl font-semibold">
                          Ödemeyi Tamamlayın.
                        </h2>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border mb-4">
                        <Info size={16} className="text-primary mt-0.5 shrink-0" />
                        <p className="text-xs text-muted-foreground">
                          Ödeme işlemi güvenli ödeme altyapısı <strong>Shopier</strong> üzerinden gerçekleştirilmektedir.
                          Kredi kartı ve banka havalesi ile ödeme yapabilirsiniz.
                        </p>
                      </div>

                      <div className="space-y-2 mb-4">
                        {checkoutItems.map((item, index) => (
                          <div key={index} className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{item.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                            {item.shopierUrl ? (
                              <a href={item.shopierUrl} target="_blank" rel="noopener noreferrer">
                                <Button size="sm" variant="default" className="gap-1 shrink-0">
                                  Öde
                                  <ExternalLink size={12} />
                                </Button>
                              </a>
                            ) : (
                              <Button size="sm" disabled variant="outline" className="shrink-0">
                                Link yok
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-border pt-4">
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Toplam</span>
                          <span>{formatPrice(total)}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-xl font-semibold mb-4">
                        Sipariş Özeti
                      </h2>
                      <div className="space-y-2 mb-4">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between text-sm"
                          >
                            <span className="truncate mr-2">
                              {item.product.name} x{item.quantity}
                            </span>
                            <span>
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-border pt-4 mb-4">
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Toplam</span>
                          <span>{formatPrice(total)}</span>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground mb-4">
                        Ödeme işlemi Shopier güvenli ödeme altyapısı üzerinden gerçekleştirilecektir.
                      </p>

                      <Button
                        className="w-full"
                        size="lg"
                        onClick={handleCheckout}
                        disabled={checkout.isPending}
                      >
                        {checkout.isPending
                          ? "İşleniyor..."
                          : "Sepeti Onayla"}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
    </AuthGuard>
  );
}
