"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, User, LogOut, ShoppingCart, LayoutDashboard, Shield } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const { itemCount } = useCart();

  const navLinks = [
    { name: "Ana Sayfa", path: "/" },
    { name: "Hakkımda", path: "/about" },
    { name: "Paketler", path: "/classes" },
    { name: "Abonelik", path: "/pricing" },
    { name: "İletişim", path: "/contact" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav
      className={`fixed top-0 w-full backdrop-blur-md z-50 border-b border-border ${
        isHome ? "bg-background/10" : "bg-background/90"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className={`font-[family-name:var(--font-script)] text-4xl ${
              isHome ? "text-white/80" : "text-foreground/90"
            }`}
          >
            Aysu Itır Karaçam
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-lg transition-colors hover:text-primary ${
                  isActive(link.path)
                    ? isHome
                      ? "text-white font-bold"
                      : "text-primary font-medium"
                    : isHome
                      ? "text-white/70 font-medium"
                      : "text-foreground/70 font-medium"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side: Auth + Cart */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                <Link href="/cart" className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={isHome ? "text-white/70 hover:text-white" : ""}
                  >
                    <ShoppingCart size={20} />
                    {itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`gap-2 ${isHome ? "text-white/70 hover:text-white" : ""}`}
                    >
                      <User size={18} />
                      <span className="max-w-[120px] truncate">
                        {session.user.name || session.user.email}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <LayoutDashboard size={16} className="mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer">
                          <Shield size={16} className="mr-2" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-destructive"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      <LogOut size={16} className="mr-2" />
                      Çıkış Yap
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href="/auth/giris">
                <Button variant="default">Giriş Yap</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 ${isHome ? "text-white" : "text-foreground"}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-3 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`block py-2 text-lg font-medium transition-colors hover:text-primary ${
                  isActive(link.path)
                    ? isHome
                      ? "text-white font-bold"
                      : "text-primary font-medium"
                    : isHome
                      ? "text-white/70"
                      : "text-foreground/70"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {session ? (
              <>
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button variant="default" className="w-full mb-2">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/cart" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full mb-2">
                    <ShoppingCart size={16} className="mr-2" />
                    Sepetim
                    {itemCount > 0 && (
                      <span className="ml-2 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </Button>
                </Link>
                {isAdmin && (
                  <Link href="/admin" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full mb-2">
                      <Shield size={16} className="mr-2" />
                      Admin Panel
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  className="w-full text-destructive"
                  onClick={() => {
                    setIsOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                >
                  <LogOut size={16} className="mr-2" />
                  Çıkış Yap
                </Button>
              </>
            ) : (
              <Link href="/auth/giris" onClick={() => setIsOpen(false)}>
                <Button variant="default" className="w-full">
                  Giriş Yap
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
