"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, rupiah } from "@/data/menu";
import KartuMenu from "@/components/KartuMenu";

export default function HalamanFavorit() {
  const [daftarFavorit, setDaftarFavorit] = useState<Menu[]>([]);
  const [memuat, setMemuat] = useState(true);

  useEffect(() => {
    async function ambilFavorit() {
      try {
        const dataFavorit = localStorage.getItem("favorit");
        const idFavorit: number[] = dataFavorit ? JSON.parse(dataFavorit) : [];

        const response = await fetch("/api/menu");

        if (!response.ok) {
          throw new Error("Gagal mengambil data menu");
        }

        const semuaMenu: Menu[] = await response.json();

        setDaftarFavorit(
          semuaMenu.filter((item) => idFavorit.includes(item.id)),
        );
      } catch (error) {
        console.error(error);
      } finally {
        setMemuat(false);
      }
    }

    ambilFavorit();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/menu"
          className="mb-6 inline-block font-semibold text-blue-600 hover:underline"
        >
          ← Kembali ke Katalog
        </Link>

        <h1 className="mb-2 text-3xl font-black text-slate-900">
          Menu Favorit
        </h1>

        <p className="mb-8 text-slate-500">
          Daftar menu yang kamu simpan sebagai favorit.
        </p>

        {memuat ? (
          <p>Memuat menu favorit...</p>
        ) : daftarFavorit.length === 0 ? (
          <div className="rounded-2xl border bg-white p-8 text-center">
            <p className="font-semibold text-slate-600">
              Belum ada menu favorit.
            </p>
            <Link
              href="/menu"
              className="mt-4 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white"
            >
              Lihat Katalog Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {daftarFavorit.map((item) => (
              <KartuMenu key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
