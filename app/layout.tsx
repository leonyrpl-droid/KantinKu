import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KantinKu",
  description: "Aplikasi Pemesanan Kantin Sekolah",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 min-h-screen text-slate-900`}
      >
        {/* Navbar / Navigasi Utama */}
        <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            {/* Logo KantinKu diubah menjadi warna biru */}
            <Link
              href="/"
              className="text-xl font-black text-blue-600 tracking-tight"
            >
              KantinKu
            </Link>

            {/* Menu Navigasi dengan warna teks yang jelas dan efek hover biru */}
            <nav className="flex space-x-6 text-sm font-semibold text-slate-700">
              <Link href="/" className="hover:text-blue-600 transition">
                Beranda
              </Link>
              <Link href="/menu" className="hover:text-blue-600 transition">
                Menu
              </Link>
              <Link href="/favorit" className="hover:text-blue-600 transition">
                Favorit
              </Link>
              <Link
                href="/keranjang"
                className="hover:text-blue-600 transition"
              >
                Keranjang
              </Link>
              <Link href="/riwayat" className="hover:text-blue-600 transition">
                Riwayat
              </Link>
            </nav>
          </div>
        </header>

        {/* Konten Halaman */}
        <main>{children}</main>
      </body>
    </html>
  );
}
