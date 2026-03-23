"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatPrice } from "@/lib/utils";
import { Shield, ShieldOff, Trash2, ShoppingBag, GraduationCap, Calendar, Clock, Phone, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface UserItem {
  id: string;
  name: string | null;
  email: string;
  role: string;
  phone: string | null;
  createdAt: string;
  _count: { enrollments: number; orders: number };
}

interface UserDetail {
  id: string;
  name: string | null;
  email: string;
  role: string;
  phone: string | null;
  createdAt: string;
  orders: {
    id: string;
    status: string;
    totalAmount: number;
    createdAt: string;
    items: { product: { name: string }; quantity: number; price: number }[];
  }[];
  enrollments: {
    id: string;
    attended: boolean;
    createdAt: string;
    class: {
      id: string;
      title: string;
      type: string;
      scheduledAt: string | null;
      duration: number | null;
      zoomJoinUrl: string | null;
    };
  }[];
}

export default function MembersPage() {
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [editPhone, setEditPhone] = useState("");
  const [editingPhone, setEditingPhone] = useState(false);

  const { data: users, isLoading } = useQuery<UserItem[]>({
    queryKey: ["admin-users"],
    queryFn: () => fetch("/api/admin/users").then((r) => r.json()),
  });

  const { data: userDetail, isLoading: detailLoading } = useQuery<UserDetail>({
    queryKey: ["admin-user-detail", selectedUserId],
    queryFn: () => fetch(`/api/admin/users/${selectedUserId}`).then((r) => r.json()),
    enabled: !!selectedUserId,
  });

  const toggleRole = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Rol güncellendi");
    },
  });

  const deleteUser = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/admin/users/${id}`, { method: "DELETE" }).then((r) => {
        if (!r.ok) throw r;
        return r.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Kullanıcı silindi");
    },
    onError: () => toast.error("Silme işlemi başarısız"),
  });

  const updateUser = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { phone?: string; name?: string } }) =>
      fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-user-detail", selectedUserId] });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setEditingPhone(false);
      toast.success("Güncellendi");
    },
  });

  const now = new Date();
  const upcomingEnrollments = (userDetail?.enrollments || []).filter(
    (e) => e.class.scheduledAt && new Date(e.class.scheduledAt) > now
  );
  const pastEnrollments = (userDetail?.enrollments || []).filter(
    (e) => !e.class.scheduledAt || new Date(e.class.scheduledAt) <= now
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Üyeler</h1>

      {isLoading ? (
        <p className="text-muted-foreground">Yükleniyor...</p>
      ) : (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="border-b border-border">
                <tr className="text-left text-sm text-muted-foreground">
                  <th className="p-4">Üye</th>
                  <th className="p-4">Rol</th>
                  <th className="p-4">Kayıt</th>
                  <th className="p-4">Sipariş</th>
                  <th className="p-4">Katılım</th>
                  <th className="p-4">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(users || []).map((user) => (
                  <tr
                    key={user.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setSelectedUserId(user.id)}
                  >
                    <td className="p-4">
                      <p className="font-medium">{user.name || "-"}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      {user.phone && (
                        <p className="text-xs text-muted-foreground">{user.phone}</p>
                      )}
                    </td>
                    <td className="p-4">
                      <Badge variant={user.role === "ADMIN" ? "default" : "outline"}>
                        {user.role === "ADMIN" ? "Admin" : "Üye"}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm">
                      {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="p-4">{user._count.orders}</td>
                    <td className="p-4">{user._count.enrollments}</td>
                    <td className="p-4">
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          title={user.role === "ADMIN" ? "Üye yap" : "Admin yap"}
                          onClick={() =>
                            toggleRole.mutate({
                              id: user.id,
                              role: user.role === "ADMIN" ? "USER" : "ADMIN",
                            })
                          }
                        >
                          {user.role === "ADMIN" ? <ShieldOff size={16} /> : <Shield size={16} />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => {
                            if (confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) {
                              deleteUser.mutate(user.id);
                            }
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Kullanıcı Detay Dialog */}
      <Dialog open={!!selectedUserId} onOpenChange={(open) => !open && setSelectedUserId(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Üye Detayı</DialogTitle>
          </DialogHeader>
          {detailLoading ? (
            <p className="text-muted-foreground py-8 text-center">Yükleniyor...</p>
          ) : userDetail ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {userDetail.name || "İsimsiz"}
                </DialogTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{userDetail.email}</span>
                  <Badge variant={userDetail.role === "ADMIN" ? "default" : "outline"} className="ml-1">
                    {userDetail.role === "ADMIN" ? "Admin" : "Üye"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Phone size={14} className="text-muted-foreground" />
                  {editingPhone ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        placeholder="905xxxxxxxxx"
                        className="h-7 w-40 text-sm"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => updateUser.mutate({ id: userDetail.id, data: { phone: editPhone } })}
                      >
                        <Check size={14} />
                      </Button>
                    </div>
                  ) : (
                    <button
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => { setEditPhone(userDetail.phone || ""); setEditingPhone(true); }}
                    >
                      {userDetail.phone || "Telefon ekle..."}
                    </button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Üyelik: {new Date(userDetail.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </DialogHeader>

              {/* Yaklaşan Dersler */}
              <div className="mt-4">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <Calendar size={18} />
                  Yaklaşan Dersler ({upcomingEnrollments.length})
                </h3>
                {upcomingEnrollments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-3">Yaklaşan ders yok</p>
                ) : (
                  <div className="space-y-2">
                    {upcomingEnrollments.map((e) => (
                      <div key={e.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="text-sm font-medium">{e.class.title}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {e.class.scheduledAt && (
                              <span>
                                {new Date(e.class.scheduledAt).toLocaleDateString("tr-TR", {
                                  day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                                })}
                              </span>
                            )}
                            {e.class.duration && <span>• {e.class.duration} dk</span>}
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {e.class.type === "LIVE" ? "Canlı" : e.class.type === "RECORDED" ? "Kayıtlı" : "Paket"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Geçmiş Dersler */}
              <div className="mt-6">
                <h3 className="font-semibold flex items-center gap-2 mb-3 text-muted-foreground">
                  <Clock size={18} />
                  Geçmiş Dersler ({pastEnrollments.length})
                </h3>
                {pastEnrollments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-3">Geçmiş ders yok</p>
                ) : (
                  <div className="space-y-2 opacity-70">
                    {pastEnrollments.map((e) => (
                      <div key={e.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="text-sm font-medium">{e.class.title}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {e.class.scheduledAt && (
                              <span>
                                {new Date(e.class.scheduledAt).toLocaleDateString("tr-TR", {
                                  day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                                })}
                              </span>
                            )}
                            {e.class.duration && <span>• {e.class.duration} dk</span>}
                          </div>
                        </div>
                        <Badge variant="outline">
                          {e.attended ? "Katıldı" : "Tamamlandı"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Siparişler */}
              <div className="mt-6">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <ShoppingBag size={18} />
                  Siparişler ({userDetail.orders.length})
                </h3>
                {userDetail.orders.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-3">Sipariş yok</p>
                ) : (
                  <div className="space-y-2">
                    {userDetail.orders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="text-sm font-medium">
                            {order.items.map((i) => i.product.name).join(", ")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString("tr-TR")} • {formatPrice(order.totalAmount)}
                          </p>
                        </div>
                        <Badge variant={order.status === "PAID" ? "secondary" : "outline"}>
                          {order.status === "PAID" ? "Ödendi" : order.status === "PENDING" ? "Beklemede" : order.status === "REFUNDED" ? "İade" : "Başarısız"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
