"use client";

import { useState } from "react";
import { menu } from "@/data/menu";
import KartuMenu from "@/components/KartuMenu";

export default function KatalogInteraktif() {
  const [cari, setCari] = useState("");
  const [kategori, setKategori] = useState("Semua");
  const [urut, setUrut] = useState("awal");

  const hasilFilter = menu.filter((item) => {
    const cocokNama = item.nama.toLowerCase().includes(cari.toLowerCase());

    const cocokKategori = kategori === "Semua" || item.kategori === kategori;

    return cocokNama && cocokKategori;
  });

  const hasilUrut = [...hasilFilter].sort((a, b) => {
    if (urut === "murah") return a.harga - b.harga;
    if (urut === "mahal") return b.harga - a.harga;
    if (urut === "nama") return a.nama.localeCompare(b.nama);

    return a.id - b.id;
  });

  return (
    <div>
      {/* Pencarian dan Filter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <input
          type="text"
          placeholder="Cari nama menu..."
          value={cari}
          onChange={(e) => setCari(e.target.value)}
          className="border rounded-xl px-4 py-3 w-full bg-white"
        />

        <select
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="border rounded-xl px-4 py-3 bg-white"
        >
          <option value="Semua">Semua Kategori</option>
          <option value="Makanan">Makanan</option>
          <option value="Minuman">Minuman</option>
          <option value="Camilan">Camilan</option>
        </select>

        <select
          value={urut}
          onChange={(e) => setUrut(e.target.value)}
          className="border rounded-xl px-4 py-3 bg-white"
        >
          <option value="awal">Urutan Awal</option>
          <option value="murah">Harga Termurah</option>
          <option value="mahal">Harga Termahal</option>
          <option value="nama">Nama A-Z</option>
        </select>
      </div>

      {/* Jumlah Menu */}
      <p className="text-sm text-gray-500 mb-5">
        Menampilkan {hasilUrut.length} menu
      </p>

      {/* Kartu Menu */}
      {hasilUrut.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {hasilUrut.map((item) => (
            <KartuMenu key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-12">Menu tidak ditemukan.</p>
      )}
    </div>
  );
}
