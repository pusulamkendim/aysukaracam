"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthGuard from "@/components/AuthGuard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, BookOpen, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
  _count: {
    enrollments: number;
    orders: number;
  };
}

interface Enrollment {
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
    product: { name: string; image: string | null } | null;
  };
}


export default function DashboardPage() {
  const { data: session } = useSession();

  const { data: profile } = useQuery<UserProfile>({
    queryKey: ["user-profile"],
    queryFn: () => fetch("/api/user/profile").then((r) => r.json()),
    enabled: !!session,
  });

  const { data: enrollments } = useQuery<Enrollment[]>({
    queryKey: ["user-enrollments"],
    queryFn: () => fetch("/api/user/enrollments").then((r) => r.json()),
    enabled: !!session,
    placeholderData: [],
  });


  const upcomingClasses = (enrollments || []).filter(
    (e) => e.class.scheduledAt && new Date(e.class.scheduledAt) > new Date()
  );

  const pastClasses = (enrollments || []).filter(
    (e) => !e.class.scheduledAt || new Date(e.class.scheduledAt) <= new Date()
  );

  const joinDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("tr-TR", { month: "long", year: "numeric" })
    : "";

  const stats = [
    { icon: Calendar, label: "Kayıtlı Dersler", value: String(profile?._count?.enrollments ?? 0), color: "text-primary" },
    { icon: Clock, label: "Geçmiş Dersler", value: String(pastClasses.length), color: "text-secondary" },
    { icon: ShoppingBag, label: "Siparişler", value: String(profile?._count?.orders ?? 0), color: "text-accent" },
    { icon: Video, label: "Yaklaşan", value: String(upcomingClasses.length), color: "text-primary" },
  ];

  return (
    <AuthGuard>
    <div className="min-h-screen bg-muted/30">
      <Navbar />

      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Başlık */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold mb-2">
              Tekrar hoş geldin, {profile?.name || session?.user?.name || ""}!
            </h1>
            <p className="text-muted-foreground">
              {joinDate && `${joinDate}'den beri üye`}
            </p>
          </div>

          {/* İstatistik Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={index}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Ana İçerik */}
            <div className="lg:col-span-2 space-y-8">
              {/* Yaklaşan Dersler */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Video size={24} />
                        Yaklaşan Canlı Dersler
                      </CardTitle>
                      <CardDescription>Planlanmış derslerinize katılın</CardDescription>
                    </div>
                    <Link href="/classes">
                      <Button variant="outline" size="sm">Tümünü Gör</Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingClasses.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      Yaklaşan canlı ders bulunmuyor
                    </p>
                  ) : (
                    upcomingClasses.slice(0, 5).map((enrollment) => (
                      <div
                        key={enrollment.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{enrollment.class.title}</h3>
                            <Badge variant="secondary" className="text-xs">Canlı</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {enrollment.class.scheduledAt &&
                              new Date(enrollment.class.scheduledAt).toLocaleDateString("tr-TR", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            {enrollment.class.duration && ` • ${enrollment.class.duration} dk`}
                          </p>
                        </div>
                        {enrollment.class.zoomJoinUrl ? (
                          <a href={enrollment.class.zoomJoinUrl} target="_blank" rel="noopener noreferrer">
                            <Button size="sm">Katıl</Button>
                          </a>
                        ) : (
                          <Button size="sm" disabled>Bekleniyor</Button>
                        )}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Geçmiş Derslerim */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen size={24} />
                    Geçmiş Derslerim
                  </CardTitle>
                  <CardDescription>Tamamlanan dersleriniz</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pastClasses.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      Henüz geçmiş ders bulunmuyor
                    </p>
                  ) : (
                    pastClasses.slice(0, 5).map((enrollment) => (
                      <div
                        key={enrollment.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold">{enrollment.class.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {enrollment.class.scheduledAt
                              ? new Date(enrollment.class.scheduledAt).toLocaleDateString("tr-TR", {
                                  day: "numeric",
                                  month: "long",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Tarih belirtilmemiş"}
                            {enrollment.class.duration && ` • ${enrollment.class.duration} dk`}
                          </p>
                        </div>
                        <Badge variant="secondary" className="bg-secondary/20">
                          {enrollment.attended ? "Katıldı" : "Tamamlandı"}
                        </Badge>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Kenar Çubuğu */}
            <div className="space-y-8">
              {/* Hızlı İşlemler */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Hızlı İşlemler</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/classes" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      Derslere Göz At
                    </Button>
                  </Link>
                  <Link href="/cart" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      Sepetim
                    </Button>
                  </Link>
                  <Link href="/pricing" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      Abonelik Planları
                    </Button>
                  </Link>
                  <Link href="/contact" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      Destek İletişimi
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
    </AuthGuard>
  );
}
