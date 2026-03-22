"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Video, Users, Search } from "lucide-react";
import DateTimePicker from "@/components/DateTimePicker";
import { useState } from "react";
import { toast } from "sonner";

interface EnrolledUser {
  id: string;
  name: string | null;
  email: string;
}

interface ClassItem {
  id: string;
  title: string;
  description: string | null;
  type: string;
  scheduledAt: string | null;
  duration: number | null;
  zoomJoinUrl: string | null;
  zoomMeetingId: string | null;
  recordingUrl: string | null;
  isActive: boolean;
  productId: string | null;
  product: { name: string } | null;
  enrollments: { user: EnrolledUser }[];
  _count: { enrollments: number };
}

interface Product {
  id: string;
  name: string;
}

interface UserItem {
  id: string;
  name: string | null;
  email: string;
}

interface FormState {
  title: string;
  description: string;
  type: string;
  productId: string;
  scheduledAt: string;
  duration: number;
  recordingUrl: string;
  enrolledUserIds: string[];
}

/** UTC ISO string'i local YYYY-MM-DDTHH:mm formatına çevirir */
function toLocalDateTimeString(isoString: string): string {
  const d = new Date(isoString);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const emptyClass: FormState = {
  title: "",
  description: "",
  type: "LIVE",
  productId: "",
  scheduledAt: "",
  duration: 60,
  recordingUrl: "",
  enrolledUserIds: [],
};

function ClassTable({
  classes,
  onEdit,
  onDelete,
  onCreateZoom,
  zoomPending,
  emptyMessage,
  isPast,
}: {
  classes: ClassItem[];
  onEdit: (cls: ClassItem) => void;
  onDelete: (id: string) => void;
  onCreateZoom: (id: string) => void;
  zoomPending: boolean;
  emptyMessage: string;
  isPast?: boolean;
}) {
  if (classes.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          {emptyMessage}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={isPast ? "opacity-70" : ""}>
      <CardContent className="p-0">
        <table className="w-full">
          <thead className="border-b border-border">
            <tr className="text-left text-sm text-muted-foreground">
              <th className="p-4">Ders</th>
              <th className="p-4">Tip</th>
              <th className="p-4">Tarih</th>
              <th className="p-4">Katılımcılar</th>
              <th className="p-4">Zoom</th>
              <th className="p-4">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {classes.map((cls) => (
              <tr key={cls.id} className={!cls.isActive ? "opacity-50" : ""}>
                <td className="p-4">
                  <p className="font-medium">{cls.title}</p>
                  {cls.product && (
                    <p className="text-sm text-muted-foreground">{cls.product.name}</p>
                  )}
                </td>
                <td className="p-4">
                  <Badge variant="outline">
                    {cls.type === "LIVE" ? "Canlı" : cls.type === "RECORDED" ? "Kayıtlı" : "Paket"}
                  </Badge>
                </td>
                <td className="p-4 text-sm">
                  {cls.scheduledAt
                    ? new Date(cls.scheduledAt).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{cls._count.enrollments}</span>
                    {cls.enrollments.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {cls.enrollments.slice(0, 3).map((e) => (
                          <Badge key={e.user.id} variant="secondary" className="text-xs">
                            {e.user.name || e.user.email.split("@")[0]}
                          </Badge>
                        ))}
                        {cls.enrollments.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{cls.enrollments.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  {cls.zoomMeetingId ? (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Aktif</Badge>
                      </div>
                      <a
                        href={cls.zoomJoinUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline truncate max-w-[180px] inline-block"
                      >
                        Katılım Linki
                      </a>
                      <button
                        type="button"
                        className="text-xs text-muted-foreground hover:text-foreground text-left"
                        onClick={() => {
                          navigator.clipboard.writeText(cls.zoomJoinUrl || "");
                          toast.success("Link kopyalandı");
                        }}
                      >
                        Kopyala
                      </button>
                    </div>
                  ) : cls.type === "LIVE" && !isPast ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onCreateZoom(cls.id)}
                      disabled={zoomPending}
                    >
                      <Video size={14} className="mr-1" />
                      Oluştur
                    </Button>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(cls)}>
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => onDelete(cls.id)}
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
  );
}

export default function ClassesAdminPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyClass);
  const [userSearch, setUserSearch] = useState("");

  const { data: classes, isLoading } = useQuery<ClassItem[]>({
    queryKey: ["admin-classes"],
    queryFn: () => fetch("/api/admin/classes").then((r) => r.json()),
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ["admin-products-list"],
    queryFn: () => fetch("/api/admin/products").then((r) => r.json()),
  });

  const { data: users } = useQuery<UserItem[]>({
    queryKey: ["admin-users-list"],
    queryFn: () => fetch("/api/admin/users").then((r) => r.json()),
  });

  const saveMutation = useMutation({
    mutationFn: async (data: FormState) => {
      const url = editingId ? `/api/admin/classes/${editingId}` : "/api/admin/classes";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          duration: Number(data.duration),
          productId: data.productId || null,
        }),
      });
      if (!res.ok) throw new Error("Kayıt başarısız");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-classes"] });
      setOpen(false);
      setEditingId(null);
      setForm(emptyClass);
      setUserSearch("");
      toast.success(editingId ? "Ders güncellendi" : "Ders eklendi");
    },
    onError: () => toast.error("Bir hata oluştu"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/admin/classes/${id}`, { method: "DELETE" }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-classes"] });
      toast.success("Ders devre dışı bırakıldı");
    },
  });

  const createZoomMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/admin/classes/${id}/zoom`, { method: "POST" }).then((r) => {
        if (!r.ok) throw new Error("Zoom hatası");
        return r.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-classes"] });
      toast.success("Zoom toplantısı oluşturuldu");
    },
    onError: () => toast.error("Zoom toplantısı oluşturulamadı"),
  });

  const openEdit = (cls: ClassItem) => {
    setEditingId(cls.id);
    setForm({
      title: cls.title,
      description: cls.description || "",
      type: cls.type,
      productId: cls.productId || "",
      scheduledAt: cls.scheduledAt ? toLocalDateTimeString(cls.scheduledAt) : "",
      duration: cls.duration || 60,
      recordingUrl: cls.recordingUrl || "",
      enrolledUserIds: cls.enrollments.map((e) => e.user.id),
    });
    setUserSearch("");
    setOpen(true);
  };

  const openNew = () => {
    setEditingId(null);
    setForm(emptyClass);
    setUserSearch("");
    setOpen(true);
  };

  const toggleUser = (userId: string) => {
    setForm((prev) => ({
      ...prev,
      enrolledUserIds: prev.enrolledUserIds.includes(userId)
        ? prev.enrolledUserIds.filter((id) => id !== userId)
        : [...prev.enrolledUserIds, userId],
    }));
  };

  const filteredUsers = (users || []).filter(
    (u) =>
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dersler</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}>
              <Plus size={16} className="mr-2" />
              Yeni Ders
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Ders Düzenle" : "Yeni Ders"}</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveMutation.mutate(form);
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label>Başlık</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Açıklama</Label>
                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tip</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LIVE">Canlı</SelectItem>
                      <SelectItem value="RECORDED">Kayıtlı</SelectItem>
                      <SelectItem value="PACKAGE">Paket</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Süre (dk)</Label>
                  <Input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Ürün (opsiyonel)</Label>
                <Select value={form.productId} onValueChange={(v) => setForm({ ...form, productId: v })}>
                  <SelectTrigger><SelectValue placeholder="Ürün seçin" /></SelectTrigger>
                  <SelectContent>
                    {(products || []).map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {form.type === "LIVE" && (
                <DateTimePicker
                  label="Tarih & Saat"
                  value={form.scheduledAt}
                  onChange={(v) => setForm({ ...form, scheduledAt: v })}
                />
              )}
              {form.type === "RECORDED" && (
                <div className="space-y-2">
                  <Label>Kayıt URL</Label>
                  <Input value={form.recordingUrl} onChange={(e) => setForm({ ...form, recordingUrl: e.target.value })} placeholder="https://..." />
                </div>
              )}

              {/* Katılımcı Seçimi */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Users size={16} />
                  Katılımcılar
                  {form.enrolledUserIds.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {form.enrolledUserIds.length} kişi
                    </Badge>
                  )}
                </Label>

                {/* Seçili kullanıcılar */}
                {form.enrolledUserIds.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {form.enrolledUserIds.map((uid) => {
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

                {/* Arama */}
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="İsim veya e-posta ile ara..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-9 h-9"
                  />
                </div>

                {/* Kullanıcı listesi */}
                <ScrollArea className="h-40 rounded-md border border-border">
                  <div className="p-2 space-y-1">
                    {filteredUsers.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-3">
                        Kullanıcı bulunamadı
                      </p>
                    ) : (
                      filteredUsers.map((user) => (
                        <label
                          key={user.id}
                          className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer transition-colors"
                        >
                          <Checkbox
                            checked={form.enrolledUserIds.includes(user.id)}
                            onCheckedChange={() => toggleUser(user.id)}
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">
                              {user.name || "İsimsiz"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user.email}
                            </p>
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
      ) : (
        <div className="space-y-8">
          {/* Yaklaşan / Aktif Dersler */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Yaklaşan Dersler</h2>
            <ClassTable
              classes={(classes || []).filter(
                (c) => c.isActive && (!c.scheduledAt || new Date(c.scheduledAt) > new Date())
              )}
              onEdit={openEdit}
              onDelete={(id) => deleteMutation.mutate(id)}
              onCreateZoom={(id) => createZoomMutation.mutate(id)}
              zoomPending={createZoomMutation.isPending}
              emptyMessage="Yaklaşan ders bulunmuyor"
            />
          </div>

          {/* Geçmiş Dersler */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-muted-foreground">Geçmiş Dersler</h2>
            <ClassTable
              classes={(classes || []).filter(
                (c) => c.scheduledAt && new Date(c.scheduledAt) <= new Date()
              )}
              onEdit={openEdit}
              onDelete={(id) => deleteMutation.mutate(id)}
              onCreateZoom={(id) => createZoomMutation.mutate(id)}
              zoomPending={createZoomMutation.isPending}
              emptyMessage="Geçmiş ders bulunmuyor"
              isPast
            />
          </div>
        </div>
      )}
    </div>
  );
}
