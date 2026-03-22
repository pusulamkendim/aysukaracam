"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Shield, ShieldOff, Trash2 } from "lucide-react";
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

export default function MembersPage() {
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery<UserItem[]>({
    queryKey: ["admin-users"],
    queryFn: () => fetch("/api/admin/users").then((r) => r.json()),
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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Üyeler</h1>

      {isLoading ? (
        <p className="text-muted-foreground">Yükleniyor...</p>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
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
                  <tr key={user.id}>
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
                      <div className="flex gap-2">
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
    </div>
  );
}
