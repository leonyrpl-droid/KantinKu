"use client";

import { useState } from "react";
import { menu } from "@/data/menu";
import KartuMenu from "@/components/KartuMenu";

export default function HalamanMenu() {
  const [cari, setCari] = useState("");
  const [kategori, setKategori] = useState("Semua");
  const [urutan, setUrutan] = useState("awal");

  const hasil = menu
    .filter((item) => item.nama.toLowerCase().includes(cari.toLowerCase()))
    .filter((item) => kategori === "Semua" || item.kategori === kategori)
    .sort((a, b) => {
      if (urutan === "murah") return a.harga - b.harga;
      if (urutan === "mahal") return b.harga - a.harga;
      if (urutan === "nama") return a.nama.localeCompare(b.nama);
      return a.id - b.id;
    });

  return (
    <div>
      <h1 className="text-3xl font-bold text-purple-700 mb-6">
        Katalog Menu Kantin
      </h1>

      <input
        type="text"
        placeholder="Cari nama menu..."
        value={cari}
        onChange={(e) => setCari(e.target.value)}
        className="w-full border rounded-lg p-3 mb-4"
      />

      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="border rounded-lg p-3"
        >
          <option value="Semua">Semua Kategori</option>
          <option value="Makanan">Makanan</option>
          <option value="Minuman">Minuman</option>
          <option value="Camilan">Camilan</option>
        </select>

        <select
          value={urutan}
          onChange={(e) => setUrutan(e.target.value)}
          className="border rounded-lg p-3"
        >
          <option value="awal">Urutan awal</option>
          <option value="murah">Harga termurah</option>
          <option value="mahal">Harga termahal</option>
          <option value="nama">Nama A-Z</option>
        </select>
      </div>

      {hasil.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {hasil.map((item) => (
            <KartuMenu key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-10">Menu tidak ditemukan.</p>
      )}
    </div>
  );
}
