"use client";

import TombolFavorit from "@/components/TombolFavorit";
import { use, useState, useEffect } from "react";
import { useRouter, notFound } from "next/navigation";
import Link from "next/link";
import { menu, rupiah } from "@/data/menu";

interface DetailProps {
  params: Promise<{ id: string }>;
}

interface CartItem {
  id: number;
  jumlah: number;
}

export default function DetailMenu({ params }: DetailProps) {
  const { id } = use(params);
  const router = useRouter();

  const item = menu.find((m) => m.id === Number(id));

  const [jumlah, setJumlah] = useState(1);
  const [qtyDiKeranjang, setQtyDiKeranjang] = useState(0);
  const [pesan, setPesan] = useState("");

  const getKeranjang = (): CartItem[] => {
    try {
      const data = localStorage.getItem("keranjang");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    const perbaruiKeranjang = () => {
      const cart = getKeranjang();
      const ditemukan = cart.find((k) => k.id === Number(id));
      setQtyDiKeranjang(ditemukan ? ditemukan.jumlah : 0);
    };

    perbaruiKeranjang();

    window.addEventListener("keranjang-berubah", perbaruiKeranjang);

    return () => {
      window.removeEventListener("keranjang-berubah", perbaruiKeranjang);
    };
  }, [id]);

  if (!item) {
    notFound();
  }

  const sisaStok = Math.max(0, item.stok - qtyDiKeranjang);
  const isHabis = sisaStok === 0;

  const tambahJumlah = () => {
    if (jumlah < sisaStok) {
      setJumlah(jumlah + 1);
      setPesan("");
    }
  };

  const kurangJumlah = () => {
    if (jumlah > 1) {
      setJumlah(jumlah - 1);
      setPesan("");
    }
  };

  const tambahKeKeranjang = () => {
    const cart = getKeranjang();

    const ditemukan = cart.find((k) => k.id === item.id);
    const jumlahLama = ditemukan ? ditemukan.jumlah : 0;

    if (jumlah < 1 || jumlahLama + jumlah > item.stok) {
      setPesan("Jumlah pesanan melebihi stok tersedia.");
      return;
    }

    if (ditemukan) {
      ditemukan.jumlah += jumlah;
    } else {
      cart.push({
        id: item.id,
        jumlah: jumlah,
      });
    }

    localStorage.setItem("keranjang", JSON.stringify(cart));

    window.dispatchEvent(new Event("keranjang-berubah"));

    alert("Menu berhasil ditambahkan ke keranjang!");

    router.push("/keranjang");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/menu"
          className="text-blue-600 font-semibold hover:underline mb-6 inline-block"
        >
          ← Kembali ke Katalog Menu
        </Link>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
          <div className="h-64 bg-gradient-to-br from-blue-500/10 to-blue-50 flex items-center justify-center relative">
            <span
              className={`absolute top-6 right-6 px-4 py-2 rounded-full text-sm font-bold ${
                isHabis
                  ? "bg-rose-100 text-rose-600"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {isHabis ? "Habis" : `Stok: ${sisaStok}`}
            </span>

            <h1 className="text-3xl font-black text-blue-900 text-center px-6">
              {item.nama}
            </h1>
          </div>

          <div className="p-8 space-y-6">
            <div>
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-bold">
                {item.kategori}
              </span>

              <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
                {item.nama}
              </h2>
            </div>

            {/* Tombol Favorit */}
            <TombolFavorit menuId={item.id} />

            <div className="flex justify-between items-center border-y py-5">
              <span className="text-slate-500 font-medium">Harga Satuan</span>

              <span className="text-3xl font-black text-blue-600">
                {rupiah(item.harga)}
              </span>
            </div>

            {isHabis ? (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 p-5 rounded-xl text-center font-bold">
                Menu ini habis.
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border">
                  <span className="font-semibold text-slate-700">
                    Jumlah Pesanan
                  </span>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={kurangJumlah}
                      disabled={jumlah <= 1}
                      className="w-10 h-10 rounded-lg bg-white border font-bold disabled:opacity-40"
                    >
                      -
                    </button>

                    <span className="text-xl font-bold w-6 text-center">
                      {jumlah}
                    </span>

                    <button
                      onClick={tambahJumlah}
                      disabled={jumlah >= sisaStok}
                      className="w-10 h-10 rounded-lg bg-white border font-bold disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-600">
                    Total Harga
                  </span>

                  <span className="text-2xl font-black text-blue-600">
                    {rupiah(item.harga * jumlah)}
                  </span>
                </div>

                {pesan && (
                  <p className="text-rose-600 text-sm font-semibold">{pesan}</p>
                )}

                <button
                  onClick={tambahKeKeranjang}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition"
                >
                  Tambah ke Keranjang
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
