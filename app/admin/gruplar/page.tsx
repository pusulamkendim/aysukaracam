"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface GroupMember {
  id: string;
  user: { id: string; name: string | null; email: string; phone: string | null };
}

interface GroupItem {
  id: string;
  name: string;
  members: GroupMember[];
  _count: { members: number; classes: number };
}

interface UserItem {
  id: string;
  name: string | null;
  email: string;
}

export default function GroupsPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [userSearch, setUserSearch] = useState("");

  const { data: groups, isLoading } = useQuery<GroupItem[]>({
    queryKey: ["admin-groups"],
    queryFn: () => fetch("/api/admin/groups").then((r) => r.json()),
  });

  const { data: users } = useQuery<UserItem[]>({
    queryKey: ["admin-users-list"],
    queryFn: () => fetch("/api/admin/users").then((r) => r.json()),
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const url = editingId ? `/api/admin/groups/${editingId}` : "/api/admin/groups";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, memberUserIds: selectedUserIds }),
      });
      if (!res.ok) throw new Error("Kayıt başarısız");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-groups"] });
      queryClient.invalidateQueries({ queryKey: ["admin-classes"] });
      setOpen(false);
      setEditingId(null);
      setName("");
      setSelectedUserIds([]);
      setUserSearch("");
      toast.success(editingId ? "Grup güncellendi" : "Grup oluşturuldu");
    },
    onError: () => toast.error("Bir hata oluştu"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/admin/groups/${id}`, { method: "DELETE" }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-groups"] });
      toast.success("Grup silindi");
    },
  });

  const openEdit = (group: GroupItem) => {
    setEditingId(group.id);
    setName(group.name);
    setSelectedUserIds(group.members.map((m) => m.user.id));
    setUserSearch("");
    setOpen(true);
  };

  const openNew = () => {
    setEditingId(null);
    setName("");
    setSelectedUserIds([]);
    setUserSearch("");
    setOpen(true);
  };

  const toggleUser = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const filteredUsers = (users || []).filter(
    (u) =>
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Gruplar</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}>
              <Plus size={16} className="mr-2" />
              Yeni Grup
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingId ? "Grup Düzenle" : "Yeni Grup"}</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveMutation.mutate();
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label>Grup Adı</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Örn: Pazartesi Grubu" />
              </div>

              <div className="space-y-2">
                <Label>
                  Üyeler
                  {selectedUserIds.length > 0 && (
                    <Badge variant="secondary" className="ml-2">{selectedUserIds.length} kişi</Badge>
                  )}
                </Label>

                {selectedUserIds.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {selectedUserIds.map((uid) => {
                      const user = (users || []).find((u) => u.id === uid);
                      if (!user) return null;
                      return (
                        <Badge
                          key={uid}
                          variant="secondary"
                          className="cursor-pointer hover:bg-destructive/20 transition-colors"
                          onClick={() => toggleUser(uid)}
                        >
                          {user.name || user.email}
                          <span className="ml-1 text-muted-foreground">×</span>
                        </Badge>
                      );
                    })}
                  </div>
                )}

                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="İsim veya e-posta ile ara..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-9 h-9"
                  />
                </div>

                <ScrollArea className="h-40 rounded-md border border-border">
                  <div className="p-2 space-y-1">
                    {filteredUsers.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-3">Kullanıcı bulunamadı</p>
                    ) : (
                      filteredUsers.map((user) => (
                        <label
                          key={user.id}
                          className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer transition-colors"
                        >
                          <Checkbox
                            checked={selectedUserIds.includes(user.id)}
                            onCheckedChange={() => toggleUser(user.id)}
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{user.name || "İsimsiz"}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                </ScrollArea>
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
      ) : (groups || []).length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Henüz grup oluşturulmamış
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(groups || []).map((group) => (
            <Card key={group.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{group.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {group._count.members} üye • {group._count.classes} ders
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(group)}>
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => {
                        if (confirm("Bu grubu silmek istediğinize emin misiniz?")) {
                          deleteMutation.mutate(group.id);
                        }
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {group.members.slice(0, 5).map((m) => (
                    <Badge key={m.id} variant="secondary" className="text-xs">
                      {m.user.name || m.user.email.split("@")[0]}
                    </Badge>
                  ))}
                  {group.members.length > 5 && (
                    <Badge variant="outline" className="text-xs">+{group.members.length - 5}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
