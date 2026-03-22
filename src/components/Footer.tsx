import Link from "next/link";
import { Instagram, Facebook, Youtube, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Marka */}
          <div className="space-y-4">
            <h3 className="font-heading text-2xl font-bold">Aysu Itır Karaçam</h3>
            <p className="text-sm text-primary-foreground/80">
              Her nefeste bedenini ve zihnini dönüştür.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/aysuitirkaracam/" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-secondary transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-secondary transition-colors" aria-label="YouTube">
                <Youtube size={20} />
              </a>
              <a href="mailto:aysuitirkaracam@gmail.com" className="hover:text-secondary transition-colors" aria-label="E-posta">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Hızlı Bağlantılar */}
          <div>
            <h4 className="font-semibold mb-4">Hızlı Bağlantılar</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-secondary transition-colors">
                  Hakkımda
                </Link>
              </li>
              <li>
                <Link href="/classes" className="hover:text-secondary transition-colors">
                  Dersler
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-secondary transition-colors">
                  Fiyatlandırma
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-secondary transition-colors">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Kaynaklar */}
          <div>
            <h4 className="font-semibold mb-4">Kaynaklar</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard" className="hover:text-secondary transition-colors">
                  Platformum
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  SSS
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Gizlilik Politikası
                </a>
              </li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h4 className="font-semibold mb-4">İletişim</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>Aliağa, İzmir, Türkiye</li>
              <li className="pt-2">
                <a href="tel:+905425645236" className="hover:text-secondary transition-colors">
                  +90 542 564 52 36
                </a>
              </li>
              <li>
                <a href="mailto:aysuitirkaracam@gmail.com" className="hover:text-secondary transition-colors">
                  aysuitirkaracam@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Aysu Itır Karaçam. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
