import Link from "next/link";
import { Instagram, Facebook, Youtube, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-heading text-2xl font-bold">Serenity Yoga</h3>
            <p className="text-sm text-primary-foreground/80">
              Transform your mind and body with every breath.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-secondary transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-secondary transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-secondary transition-colors" aria-label="YouTube">
                <Youtube size={20} />
              </a>
              <a href="mailto:tushardogra19@gmail.com" className="hover:text-secondary transition-colors" aria-label="Email">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-secondary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/classes" className="hover:text-secondary transition-colors">
                  Classes
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-secondary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-secondary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard" className="hover:text-secondary transition-colors">
                  My Dashboard
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>123 Wellness Street</li>
              <li>Mumbai, India 400001</li>
              <li className="pt-2">
                <a href="tel:+919876543210" className="hover:text-secondary transition-colors">
                  +91 9XXXXXXXXX
                </a>
              </li>
              <li>
                <a href="mailto:tushardogra19@gmail.com" className="hover:text-secondary transition-colors">
                  hello@example.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Serenity Yoga. All rights reserved.</p>
          <p>Developed by <a href="https://www.linkedin.com/in/tushar-dogra-55b687240/" className="hover:text-secondary transition-colors">Tushar Dogra</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
