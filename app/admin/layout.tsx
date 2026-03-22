"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, GraduationCap, Users, CreditCard, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthGuard from "@/components/AuthGuard";

const adminLinks = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Ürünler", path: "/admin/urunler", icon: Package },
  { name: "Dersler", path: "/admin/dersler", icon: GraduationCap },
  { name: "Üyeler", path: "/admin/uyeler", icon: Users },
  { name: "Siparişler", path: "/admin/siparisler", icon: CreditCard },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AuthGuard adminOnly>
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border p-6 flex flex-col">
        <div className="mb-8">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <p className="text-sm text-muted-foreground">Yönetim Paneli</p>
        </div>

        <nav className="space-y-1 flex-1">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon size={18} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <Link href="/">
          <Button variant="ghost" className="w-full justify-start mt-4">
            <ArrowLeft size={16} className="mr-2" />
            Siteye Dön
          </Button>
        </Link>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-muted/30 overflow-auto">
        {children}
      </main>
    </div>
    </AuthGuard>
  );
}
