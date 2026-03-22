"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { formatPrice } from "@/lib/utils";
import { Users, CreditCard, Package, GraduationCap } from "lucide-react";

interface DashboardData {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalClasses: number;
  totalEnrollments: number;
  recentOrders: {
    id: string;
    status: string;
    totalAmount: number;
    createdAt: string;
    user: { name: string | null; email: string };
    items: { product: { name: string } }[];
  }[];
}

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ["admin-dashboard"],
    queryFn: () => fetch("/api/admin/dashboard").then((r) => r.json()),
  });

  if (isLoading) {
    return <div className="text-muted-foreground">Yükleniyor...</div>;
  }

  const stats = [
    { icon: Users, label: "Toplam Üye", value: data?.totalUsers ?? 0, color: "text-primary" },
    { icon: CreditCard, label: "Toplam Gelir", value: formatPrice(data?.totalRevenue ?? 0), color: "text-secondary" },
    { icon: Package, label: "Siparişler", value: data?.totalOrders ?? 0, color: "text-accent" },
    { icon: GraduationCap, label: "Aktif Dersler", value: data?.totalClasses ?? 0, color: "text-primary" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg bg-primary/10 ${stat.color}`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Son Siparişler */}
      <Card>
        <CardHeader>
          <CardTitle>Son Siparişler</CardTitle>
        </CardHeader>
        <CardContent>
          {(data?.recentOrders || []).length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Henüz sipariş yok</p>
          ) : (
            <div className="space-y-3">
              {data?.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-medium">
                      {order.user.name || order.user.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.items.map((i) => i.product.name).join(", ")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(order.totalAmount)}</p>
                    <Badge
                      variant={order.status === "PAID" ? "secondary" : "outline"}
                    >
                      {order.status === "PAID" ? "Ödendi" : order.status === "PENDING" ? "Beklemede" : order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
