import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import {
  LayoutDashboard, FileText, Image, Settings,
  TrendingUp, Users, DollarSign, Languages,
  LogOut, Shield
} from "lucide-react";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin | ASOPADRES CCSDS",
  robots: { index: false, follow: false },
};

const NAV_ITEMS = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/comunicados", icon: FileText, label: "Comunicados" },
  { href: "/admin/imagenes", icon: Image, label: "Imágenes" },
  { href: "/admin/contenido", icon: Settings, label: "Contenido" },
  { href: "/admin/proyecto", icon: TrendingUp, label: "Proyecto Cancha" },
  { href: "/admin/afiliados", icon: Users, label: "Afiliados" },
  { href: "/admin/donaciones", icon: DollarSign, label: "Donaciones" },
  { href: "/admin/i18n", icon: Languages, label: "Textos i18n" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.className}>
      <body className="bg-gray-50 min-h-screen">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-60 bg-white border-r border-gray-200 flex flex-col fixed top-0 left-0 h-full z-30">
            {/* Brand */}
            <div className="px-5 py-5 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900">ASOPADRES</p>
                  <p className="text-xs text-gray-400">Panel Admin</p>
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
              {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors group"
                >
                  <Icon className="h-4 w-4 text-gray-400 group-hover:text-brand-blue transition-colors" />
                  {label}
                </Link>
              ))}
            </nav>

            {/* Footer */}
            <div className="px-3 py-4 border-t border-gray-100">
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-500 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Ver sitio público
              </Link>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 ml-60 p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
