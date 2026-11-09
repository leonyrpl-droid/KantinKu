"use client";

import { useEffect, useState } from "react";

export default function TombolFavorit({ menuId }: { menuId: number }) {
  const [favorit, setFavorit] = useState(false);

  useEffect(() => {
    const periksaFavorit = () => {
      const data = localStorage.getItem("favorit");
      const daftar: number[] = data ? JSON.parse(data) : [];
      setFavorit(daftar.includes(menuId));
    };

    periksaFavorit();

    window.addEventListener("favorit-berubah", periksaFavorit);

    return () => {
      window.removeEventListener("favorit-berubah", periksaFavorit);
    };
  }, [menuId]);

  function toggleFavorit() {
    const data = localStorage.getItem("favorit");
    const daftar: number[] = data ? JSON.parse(data) : [];

    let hasil: number[];

    if (daftar.includes(menuId)) {
      hasil = daftar.filter((id) => id !== menuId);
    } else {
      hasil = [...daftar, menuId];
    }

    localStorage.setItem("favorit", JSON.stringify(hasil));
    setFavorit(hasil.includes(menuId));

    window.dispatchEvent(new Event("favorit-berubah"));
  }

  return (
    <button
      onClick={toggleFavorit}
      className="rounded-xl bg-purple-100 px-5 py-3 font-semibold text-purple-700 hover:bg-purple-200"
    >
      {favorit ? "♥ Favorit" : "♡ Tambah favorit"}
    </button>
  );
}
