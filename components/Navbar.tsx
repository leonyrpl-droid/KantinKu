"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigasi = [
  { nama: "Beranda", href: "/" },
  { nama: "Menu", href: "/menu" },
  { nama: "Favorit", href: "/favorit" },
  { nama: "Keranjang", href: "/keranjang" },
  { nama: "Riwayat", href: "/riwayat" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-5">
        <h1 className="text-2xl font-bold text-purple-700 mb-5">KantinKu</h1>

        <nav className="flex flex-wrap gap-3">
          {navigasi.map((item) => {
            const aktif = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg transition ${
                  aktif
                    ? "bg-purple-700 text-white font-bold"
                    : "text-gray-600 hover:bg-purple-100"
                }`}
              >
                {item.nama}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
