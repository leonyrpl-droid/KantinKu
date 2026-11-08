"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigasi = [
  { nama: "Beranda", href: "/", ikon: "⌂" },
  { nama: "Menu", href: "/menu", ikon: "♜" },
  { nama: "Favorit", href: "/favorit", ikon: "♡" },
  { nama: "Keranjang", href: "/keranjang", ikon: "🛒" },
  { nama: "Riwayat", href: "/riwayat", ikon: "◷" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="text-3xl font-extrabold text-purple-700 tracking-tight"
        >
          KantinKu
        </Link>

        <nav className="flex flex-wrap items-center gap-2">
          {navigasi.map((item) => {
            const aktif = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  aktif
                    ? "bg-purple-700 text-white shadow-md shadow-purple-200"
                    : "text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                }`}
              >
                <span>{item.ikon}</span>
                {item.nama}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
