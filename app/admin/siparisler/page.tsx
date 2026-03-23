"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  status: string;
  totalAmount: number;
  gumroadSaleId: string | null;
  createdAt: string;
  user: { name: string | null; email: string };
  items: { product: { name: string }; quantity: number; price: number }[];
}

const statusLabels: Record<string, string> = {
  PENDING: "Beklemede",
  PAID: "Ödendi",
  FAILED: "Başarısız",
  REFUNDED: "İade",
};

const statusColors: Record<string, string> = {
  PENDING: "outline",
  PAID: "secondary",
  FAILED: "destructive",
  REFUNDED: "outline",
};

export default function OrdersPage() {
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery<OrderItem[]>({
    queryKey: ["admin-orders"],
    queryFn: () => fetch("/api/admin/orders").then((r) => r.json()),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Sipariş durumu güncellendi");
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Siparişler</h1>

      {isLoading ? (
        <p className="text-muted-foreground">Yükleniyor...</p>
      ) : (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="border-b border-border">
                <tr className="text-left text-sm text-muted-foreground">
                  <th className="p-4">Müşteri</th>
                  <th className="p-4">Ürünler</th>
                  <th className="p-4">Tutar</th>
                  <th className="p-4">Tarih</th>
                  <th className="p-4">Shopier</th>
                  <th className="p-4">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(orders || []).map((order) => (
                  <tr key={order.id}>
                    <td className="p-4">
                      <p className="font-medium">{order.user.name || "-"}</p>
                      <p className="text-sm text-muted-foreground">{order.user.email}</p>
                    </td>
                    <td className="p-4">
                      {order.items.map((item, i) => (
                        <p key={i} className="text-sm">
                          {item.product.name} x{item.quantity}
                        </p>
                      ))}
                    </td>
                    <td className="p-4 font-medium">{formatPrice(order.totalAmount)}</td>
                    <td className="p-4 text-sm">
                      {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="p-4 text-sm">
                      {order.gumroadSaleId ? (
                        <Badge variant="secondary" className="text-xs">
                          {order.gumroadSaleId.slice(0, 8)}...
                        </Badge>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-4">
                      <Select
                        value={order.status}
                        onValueChange={(v) => updateStatus.mutate({ id: order.id, status: v })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(statusLabels).map(([key, label]) => (
                            <SelectItem key={key} value={key}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
