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
import { Plus, Pencil, Trash2, Video, Users, UsersRound, Search, Repeat, MessageCircle } from "lucide-react";
import DateTimePicker from "@/components/DateTimePicker";
import { useState } from "react";
import { toast } from "sonner";

interface EnrolledUser {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
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
  groupId: string | null;
  product: { name: string } | null;
  group: { id: string; name: string; members: { user: EnrolledUser }[] } | null;
  enrollments: { user: EnrolledUser; source: string | null }[];
  _count: { enrollments: number };
}

interface GroupItem {
  id: string;
  name: string;
  members: { user: { id: string; name: string | null; email: string } }[];
  _count: { members: number };
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
  groupId: string;
  repeatWeeks: number;
  createZoom: boolean;
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
  groupId: "",
  repeatWeeks: 1,
  createZoom: true,
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
      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="border-b border-border">
            <tr className="text-left text-sm text-muted-foreground">
              <th className="p-4">Ders</th>
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
                  <p className="text-sm font-medium">{cls.title}</p>
                  {cls.product && (
                    <p className="text-xs text-muted-foreground">{cls.product.name}</p>
                  )}
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
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Grup badge — tıklayınca üyeleri gösterir */}
                    {cls.group && (
                      <details className="relative">
                        <summary className="list-none cursor-pointer">
                          <Badge variant="default" className="text-xs gap-1 cursor-pointer">
                            <UsersRound size={10} />
                            {cls.group.name} ({cls.group.members.length})
                          </Badge>
                        </summary>
                        <div className="absolute z-20 top-full left-0 mt-1 w-64 p-3 rounded-lg border border-border bg-card shadow-lg">
                          <p className="text-xs font-semibold mb-2">{cls.group.name} Üyeleri</p>
                          <div className="space-y-1.5 max-h-48 overflow-y-auto">
                            {cls.group.members.map((m) => {
                              const phone = m.user.phone?.replace(/\D/g, "") || "";
                              const dateStr = cls.scheduledAt
                                ? new Date(cls.scheduledAt).toLocaleDateString("tr-TR", {
                                    day: "numeric", month: "long", weekday: "long",
                                    hour: "2-digit", minute: "2-digit",
                                  })
                                : "";
                              const message = encodeURIComponent(
                                `Merhaba ${m.user.name || ""}! 🧘\n\n` +
                                `"${cls.title}" dersiniz hakkında bilgilendirme:\n` +
                                (dateStr ? `📅 ${dateStr}\n` : "") +
                                (cls.duration ? `⏱ ${cls.duration} dakika\n` : "") +
                                (cls.zoomJoinUrl ? `\n🔗 Zoom: ${cls.zoomJoinUrl}\n` : "") +
                                `\nGörüşmek üzere!`
                              );
                              const waUrl = phone ? `https://wa.me/${phone}?text=${message}` : null;
                              return (
                                <div key={m.user.id} className="flex items-center justify-between">
                                  <span className="text-xs truncate">{m.user.name || m.user.email}</span>
                                  {waUrl && (
                                    <a href={waUrl} target="_blank" rel="noopener noreferrer">
                                      <MessageCircle size={12} className="text-primary hover:text-primary/70" />
                                    </a>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-6 gap-1 w-full mt-2"
                            onClick={() => {
                              const dateStr = cls.scheduledAt
                                ? new Date(cls.scheduledAt).toLocaleDateString("tr-TR", {
                                    day: "numeric", month: "long", weekday: "long",
                                    hour: "2-digit", minute: "2-digit",
                                  })
                                : "";
                              const message =
                                `🧘 "${cls.title}" dersiniz hakkında bilgilendirme:\n\n` +
                                (dateStr ? `📅 ${dateStr}\n` : "") +
                                (cls.duration ? `⏱ ${cls.duration} dakika\n` : "") +
                                (cls.zoomJoinUrl ? `\n🔗 Zoom: ${cls.zoomJoinUrl}\n` : "") +
                                `\nGörüşmek üzere!`;
                              navigator.clipboard.writeText(message);
                              toast.success("Mesaj panoya kopyalandı");
                            }}
                          >
                            <MessageCircle size={10} />
                            Mesajı Kopyala
                          </Button>
                        </div>
                      </details>
                    )}
                    {/* Bireysel katılımcılar (grup üyeleri hariç) */}
                    {(() => {
                      const groupUserIds = cls.group ? cls.group.members.map((m) => m.user.id) : [];
                      const individualEnrollments = cls.enrollments.filter((e) => !groupUserIds.includes(e.user.id));
                      if (individualEnrollments.length === 0 && !cls.group) {
                        return <span className="text-muted-foreground text-sm">-</span>;
                      }
                      return individualEnrollments.length > 0 ? (
                        <>
                          <div className="flex flex-wrap gap-1">
                            {individualEnrollments.slice(0, 5).map((e) => {
                              const dateStr = cls.scheduledAt
                                ? new Date(cls.scheduledAt).toLocaleDateString("tr-TR", {
                                    day: "numeric", month: "long", weekday: "long",
                                    hour: "2-digit", minute: "2-digit",
                                  })
                                : "";
                              const message = encodeURIComponent(
                                `Merhaba ${e.user.name || ""}! 🧘\n\n` +
                                `"${cls.title}" dersiniz hakkında bilgilendirme:\n` +
                                (dateStr ? `📅 ${dateStr}\n` : "") +
                                (cls.duration ? `⏱ ${cls.duration} dakika\n` : "") +
                                (cls.zoomJoinUrl ? `\n🔗 Zoom: ${cls.zoomJoinUrl}\n` : "") +
                                `\nGörüşmek üzere!`
                              );
                              const phone = e.user.phone?.replace(/\D/g, "") || "";
                              const waUrl = phone ? `https://wa.me/${phone}?text=${message}` : null;

                              return waUrl ? (
                                <a key={e.user.id} href={waUrl} target="_blank" rel="noopener noreferrer">
                                  <Badge variant="secondary" className="text-xs gap-1 cursor-pointer hover:bg-secondary/80">
                                    <MessageCircle size={10} />
                                    {e.user.name || e.user.email.split("@")[0]}
                                  </Badge>
                                </a>
                              ) : (
                                <Badge key={e.user.id} variant="secondary" className="text-xs">
                                  {e.user.name || e.user.email.split("@")[0]}
                                </Badge>
                              );
                            })}
                            {individualEnrollments.length > 5 && (
                              <Badge variant="outline" className="text-xs">
                                +{individualEnrollments.length - 5}
                              </Badge>
                            )}
                          </div>
                          {!cls.group && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs h-6 gap-1"
                              onClick={() => {
                                const dateStr = cls.scheduledAt
                                  ? new Date(cls.scheduledAt).toLocaleDateString("tr-TR", {
                                      day: "numeric", month: "long", weekday: "long",
                                      hour: "2-digit", minute: "2-digit",
                                    })
                                  : "";
                                const message =
                                  `🧘 "${cls.title}" dersiniz hakkında bilgilendirme:\n\n` +
                                  (dateStr ? `📅 ${dateStr}\n` : "") +
                                  (cls.duration ? `⏱ ${cls.duration} dakika\n` : "") +
                                  (cls.zoomJoinUrl ? `\n🔗 Zoom: ${cls.zoomJoinUrl}\n` : "") +
                                  `\nGörüşmek üzere!`;
                                navigator.clipboard.writeText(message);
                                toast.success("Mesaj panoya kopyalandı");
                              }}
                            >
                              <MessageCircle size={10} />
                              Mesajı Kopyala
                            </Button>
                          )}
                        </>
                      ) : null;
                    })()}
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

  const { data: groups } = useQuery<GroupItem[]>({
    queryKey: ["admin-groups"],
    queryFn: () => fetch("/api/admin/groups").then((r) => r.json()),
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
          groupId: data.groupId || null,
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
      toast.success(editingId ? "Ders güncellendi" : `${form.repeatWeeks > 1 ? form.repeatWeeks + " ders" : "Ders"} eklendi`);
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
      groupId: cls.groupId || "",
      repeatWeeks: 1,
      createZoom: false,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Dersler</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}>
              <Plus size={16} className="mr-2" />
              Yeni Ders
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
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
              <div className="grid grid-cols-2 gap-4">
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
                <div className="space-y-2">
                  <Label>Grup (opsiyonel)</Label>
                  <Select value={form.groupId} onValueChange={(v) => {
                    const group = (groups || []).find((g) => g.id === v);
                    const groupUserIds = group ? group.members.map((m) => m.user.id) : [];
                    const merged = [...new Set([...form.enrolledUserIds, ...groupUserIds])];
                    setForm({ ...form, groupId: v, enrolledUserIds: merged });
                  }}>
                    <SelectTrigger><SelectValue placeholder="Grup seçin" /></SelectTrigger>
                    <SelectContent>
                      {(groups || []).map((g) => (
                        <SelectItem key={g.id} value={g.id}>{g.name} ({g._count.members})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {form.type === "LIVE" && (
                <>
                  <DateTimePicker
                    label="İlk Ders Tarihi & Saati"
                    value={form.scheduledAt}
                    onChange={(v) => setForm({ ...form, scheduledAt: v })}
                  />

                  {/* Tekrar & Zoom */}
                  {!editingId && (
                    <div className="space-y-3 p-3 rounded-lg border border-border bg-muted/30">
                      <div className="flex items-center gap-2">
                        <Repeat size={16} className="text-muted-foreground" />
                        <Label className="font-medium">Tekrarlayan Ders</Label>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Kaç hafta?</Label>
                          <Select
                            value={String(form.repeatWeeks)}
                            onValueChange={(v) => setForm({ ...form, repeatWeeks: Number(v) })}
                          >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Tek ders</SelectItem>
                              <SelectItem value="4">4 hafta</SelectItem>
                              <SelectItem value="8">8 hafta</SelectItem>
                              <SelectItem value="12">12 hafta</SelectItem>
                              <SelectItem value="16">16 hafta</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Zoom toplantısı</Label>
                          <label className="flex items-center gap-2 h-10 cursor-pointer">
                            <Checkbox
                              checked={form.createZoom}
                              onCheckedChange={(v) => setForm({ ...form, createZoom: !!v })}
                            />
                            <span className="text-sm">Otomatik oluştur</span>
                          </label>
                        </div>
                      </div>
                      {form.repeatWeeks > 1 && form.scheduledAt && (
                        <p className="text-xs text-muted-foreground">
                          {form.repeatWeeks} ders oluşturulacak: her hafta aynı gün ve saatte
                          {form.createZoom && " (tek Zoom linki)"}
                        </p>
                      )}
                    </div>
                  )}
                </>
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
          {/* Yaklaşan Dersler - önümüzdeki 2 hafta */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Yaklaşan Dersler <span className="text-sm font-normal text-muted-foreground">(2 hafta)</span></h2>
            <ClassTable
              classes={(() => {
                const now = new Date();
                const twoWeeksLater = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
                return (classes || []).filter(
                  (c) => c.isActive && c.scheduledAt && new Date(c.scheduledAt) > now && new Date(c.scheduledAt) <= twoWeeksLater
                );
              })()}
              onEdit={openEdit}
              onDelete={(id) => deleteMutation.mutate(id)}
              onCreateZoom={(id) => createZoomMutation.mutate(id)}
              zoomPending={createZoomMutation.isPending}
              emptyMessage="Yaklaşan ders bulunmuyor"
            />
          </div>

          {/* İlerideki Dersler - 2 haftadan sonra */}
          {(() => {
            const twoWeeksLater = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
            const futureClasses = (classes || []).filter(
              (c) => c.isActive && c.scheduledAt && new Date(c.scheduledAt) > twoWeeksLater
            );
            const noDateClasses = (classes || []).filter(
              (c) => c.isActive && !c.scheduledAt
            );
            const allFuture = [...futureClasses, ...noDateClasses];
            return allFuture.length > 0 ? (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-muted-foreground">İlerideki Dersler</h2>
                <ClassTable
                  classes={allFuture}
                  onEdit={openEdit}
                  onDelete={(id) => deleteMutation.mutate(id)}
                  onCreateZoom={(id) => createZoomMutation.mutate(id)}
                  zoomPending={createZoomMutation.isPending}
                  emptyMessage=""
                />
              </div>
            ) : null;
          })()}

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
