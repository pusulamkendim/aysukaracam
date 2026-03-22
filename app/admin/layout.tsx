"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, GraduationCap, Users, CreditCard, ArrowLeft, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthGuard from "@/components/AuthGuard";
import { useState } from "react";

const adminLinks = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Ürünler", path: "/admin/urunler", icon: Package },
  { name: "Dersler", path: "/admin/dersler", icon: GraduationCap },
  { name: "Üyeler", path: "/admin/uyeler", icon: Users },
  { name: "Siparişler", path: "/admin/siparisler", icon: CreditCard },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard adminOnly>
    <div className="min-h-screen flex">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-14 px-4 bg-card border-b border-border md:hidden">
        <h2 className="font-bold">Admin Panel</h2>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border p-6 flex flex-col transition-transform duration-200
        md:static md:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="mb-8 hidden md:block">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <p className="text-sm text-muted-foreground">Yönetim Paneli</p>
        </div>

        <div className="mb-8 md:hidden h-8" />

        <nav className="space-y-1 flex-1">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setSidebarOpen(false)}
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

        <Link href="/" onClick={() => setSidebarOpen(false)}>
          <Button variant="ghost" className="w-full justify-start mt-4">
            <ArrowLeft size={16} className="mr-2" />
            Siteye Dön
          </Button>
        </Link>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 pt-18 md:p-8 md:pt-8 bg-muted/30 overflow-auto">
        {children}
      </main>
    </div>
    </AuthGuard>
  );
}
