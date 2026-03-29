"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatPrice } from "@/lib/utils";
import { Plus, Pencil, Power, PowerOff, Trash2 } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import { useState } from "react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  type: string;
  duration: string | null;
  difficulty: string | null;
  image: string | null;
  gumroadId: string | null;
  isActive: boolean;
  features: string[];
  _count: { orderItems: number; classes: number };
}

const emptyProduct = {
  name: "",
  description: "",
  price: 0,
  type: "package",
  duration: "",
  difficulty: "",
  image: "",
  gumroadId: "",
  features: [] as string[],
};

function ProductTable({
  products,
  onEdit,
  onToggleActive,
  onDelete,
  togglePending,
  isPast,
}: {
  products: Product[];
  onEdit: (p: Product) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
  onDelete?: (id: string) => void;
  togglePending: boolean;
  isPast?: boolean;
}) {
  if (products.length === 0) {
    return (
      <Card className={isPast ? "opacity-70" : ""}>
        <CardContent className="py-8 text-center text-muted-foreground">
          {isPast ? "Devre dışı ürün bulunmuyor" : "Aktif ürün bulunmuyor"}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={isPast ? "opacity-70" : ""}>
      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="border-b border-border">
            <tr className="text-left text-sm text-muted-foreground">
              <th className="p-4">Ürün</th>
              <th className="p-4">Tip</th>
              <th className="p-4">Fiyat</th>
              <th className="p-4">Shopier</th>
              <th className="p-4">Sipariş</th>
              <th className="p-4">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="p-4">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.duration}</p>
                </td>
                <td className="p-4">
                  <Badge variant="outline">
                    {product.type === "subscription" ? "Abonelik" : "Paket"}
                  </Badge>
                </td>
                <td className="p-4 font-medium">{formatPrice(product.price)}</td>
                <td className="p-4">
                  {product.gumroadId ? (
                    <a
                      href={`https://www.shopier.com/templeofbodyarts/${product.gumroadId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      {product.gumroadId}
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </td>
                <td className="p-4">{product._count.orderItems}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(product)}>
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={product.isActive ? "text-destructive" : "text-secondary"}
                      title={product.isActive ? "Devre dışı bırak" : "Aktif et"}
                      onClick={() => onToggleActive(product.id, !product.isActive)}
                      disabled={togglePending}
                    >
                      {product.isActive ? <PowerOff size={16} /> : <Power size={16} />}
                    </Button>
                    {isPast && onDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        title="Kalıcı olarak sil"
                        onClick={() => {
                          if (confirm("Bu ürünü kalıcı olarak silmek istediğinize emin misiniz?")) {
                            onDelete(product.id);
                          }
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyProduct);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["admin-products"],
    queryFn: () => fetch("/api/admin/products").then((r) => r.json()),
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const url = editingId
        ? `/api/admin/products/${editingId}`
        : "/api/admin/products";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, price: Math.round(Number(data.price) * 100) }),
      });
      if (!res.ok) throw new Error("Kayıt başarısız");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setOpen(false);
      setEditingId(null);
      setForm(emptyProduct);
      toast.success(editingId ? "Ürün güncellendi" : "Ürün eklendi");
    },
    onError: () => toast.error("Bir hata oluştu"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/admin/products/${id}?permanent=true`, { method: "DELETE" }).then((r) => {
        if (!r.ok) return r.json().then((d) => { throw new Error(d.error); });
        return r.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Ürün kalıcı olarak silindi");
    },
    onError: (err: Error) => toast.error(err.message || "Silme başarısız"),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      }).then((r) => r.json()),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success(variables.isActive ? "Ürün aktif edildi" : "Ürün devre dışı bırakıldı");
    },
  });

  const openEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price / 100,
      type: product.type,
      duration: product.duration || "",
      difficulty: product.difficulty || "",
      image: product.image || "",
      gumroadId: product.gumroadId || "",
      features: product.features,
    });
    setOpen(true);
  };

  const openNew = () => {
    setEditingId(null);
    setForm(emptyProduct);
    setOpen(true);
  };

  const activeProducts = (products || []).filter((p) => p.isActive);
  const inactiveProducts = (products || []).filter((p) => !p.isActive);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Ürünler</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}>
              <Plus size={16} className="mr-2" />
              Yeni Ürün
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingId ? "Ürün Düzenle" : "Yeni Ürün"}</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveMutation.mutate(form);
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label>Ad</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Açıklama</Label>
                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fiyat (₺)</Label>
                  <Input type="number" value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required />
                </div>
                <div className="space-y-2">
                  <Label>Tip</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="package">Paket</SelectItem>
                      <SelectItem value="subscription">Abonelik</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Süre</Label>
                  <Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="4 hafta" />
                </div>
                <div className="space-y-2">
                  <Label>Zorluk</Label>
                  <Select value={form.difficulty} onValueChange={(v) => setForm({ ...form, difficulty: v })}>
                    <SelectTrigger><SelectValue placeholder="Seçin" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <ImageUpload
                label="Görsel"
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
              />
              <div className="space-y-2">
                <Label>Shopier Ürün ID</Label>
                <Input
                  value={form.gumroadId}
                  onChange={(e) => setForm({ ...form, gumroadId: e.target.value })}
                  placeholder="Shopier'dan ürün ID'sini yapıştır"
                />
                <p className="text-xs text-muted-foreground">
                  Shopier'da ürünü oluşturup URL'deki ID'yi buraya yapıştırın (ör: 45666072)
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Yükleniyor...</p>
      ) : (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Aktif Ürünler</h2>
            <ProductTable
              products={activeProducts}
              onEdit={openEdit}
              onToggleActive={(id, isActive) => toggleActiveMutation.mutate({ id, isActive })}
              togglePending={toggleActiveMutation.isPending}
            />
          </div>

          {inactiveProducts.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-muted-foreground">Devre Dışı Ürünler</h2>
              <ProductTable
                products={inactiveProducts}
                onEdit={openEdit}
                onToggleActive={(id, isActive) => toggleActiveMutation.mutate({ id, isActive })}
                onDelete={(id) => deleteMutation.mutate(id)}
                togglePending={toggleActiveMutation.isPending}
                isPast
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
