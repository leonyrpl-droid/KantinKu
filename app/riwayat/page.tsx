"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { rupiah } from "@/data/menu";

interface ItemPesanan {
  nama: string;
  jumlah: number;
  subtotal: number;
}

interface Pesanan {
  nama: string;
  caraAmbil: string;
  kelas: string;
  item: ItemPesanan[];
  subtotal: number;
  diskon: number;
  ongkir: number;
  total: number;
  tanggal: string;
}

export default function HalamanRiwayat() {
  const [riwayat, setRiwayat] = useState<Pesanan[]>([]);
  const [memuat, setMemuat] = useState(true);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      try {
        const data = localStorage.getItem("riwayat");
        const daftar: Pesanan[] = data ? JSON.parse(data) : [];

        setRiwayat(Array.isArray(daftar) ? daftar : []);
      } catch (error) {
        console.error("Gagal membaca riwayat:", error);
        setRiwayat([]);
      } finally {
        setMemuat(false);
      }
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  // Menghapus seluruh riwayat pesanan
  const hapusRiwayat = () => {
    const yakin = window.confirm(
      "Apakah kamu yakin ingin menghapus seluruh riwayat pesanan?",
    );

    if (!yakin) return;

    localStorage.removeItem("riwayat");
    setRiwayat([]);

    alert("Riwayat pesanan berhasil dihapus.");
  };

  const totalBelanja = riwayat.reduce(
    (total, pesanan) => total + pesanan.total,
    0,
  );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/menu"
          className="mb-6 inline-block font-semibold text-blue-600 hover:underline"
        >
          ← Kembali ke Katalog
        </Link>

        <h1 className="text-3xl font-black text-slate-900">Riwayat Pesanan</h1>

        <p className="mt-2 text-slate-500">
          Daftar pesanan yang pernah kamu lakukan.
        </p>

        {memuat ? (
          <p className="my-8 text-slate-600">Memuat riwayat pesanan...</p>
        ) : (
          <>
            <div className="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border bg-white p-5">
                <p className="text-sm text-slate-500">Jumlah Pesanan</p>
                <p className="mt-2 text-3xl font-black text-blue-600">
                  {riwayat.length}
                </p>
              </div>

              <div className="rounded-2xl border bg-white p-5">
                <p className="text-sm text-slate-500">Total Belanja</p>
                <p className="mt-2 text-3xl font-black text-blue-600">
                  {rupiah(totalBelanja)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={hapusRiwayat}
              disabled={riwayat.length === 0}
              className="mb-6 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Hapus Riwayat
            </button>

            {riwayat.length === 0 ? (
              <div className="rounded-2xl border bg-white p-10 text-center">
                <p className="font-semibold text-slate-600">
                  Belum ada pesanan.
                </p>

                <Link
                  href="/menu"
                  className="mt-4 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white"
                >
                  Lihat Menu
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                {riwayat.map((pesanan, index) => (
                  <div
                    key={`${pesanan.tanggal}-${index}`}
                    className="rounded-2xl border bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-wrap justify-between gap-3 border-b pb-4">
                      <div>
                        <h2 className="text-lg font-bold text-slate-900">
                          {pesanan.nama}
                        </h2>

                        <p className="text-sm text-slate-500">
                          {pesanan.tanggal}
                        </p>
                      </div>

                      <span className="h-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                        Pesanan Berhasil
                      </span>
                    </div>

                    <div className="space-y-2 border-b py-4 text-sm">
                      <p>
                        <span className="font-semibold">Cara pengambilan:</span>{" "}
                        {pesanan.caraAmbil}
                      </p>

                      <p>
                        <span className="font-semibold">Kelas:</span>{" "}
                        {pesanan.kelas}
                      </p>
                    </div>

                    <div className="space-y-3 py-4">
                      <h3 className="font-bold text-slate-700">Rincian Menu</h3>

                      {pesanan.item.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex justify-between gap-3 text-sm"
                        >
                          <span>
                            {item.nama} x {item.jumlah}
                          </span>

                          <span className="font-semibold">
                            {rupiah(item.subtotal)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 border-t pt-4 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{rupiah(pesanan.subtotal)}</span>
                      </div>

                      {pesanan.diskon > 0 && (
                        <div className="flex justify-between text-emerald-600">
                          <span>Diskon</span>
                          <span>-{rupiah(pesanan.diskon)}</span>
                        </div>
                      )}

                      {pesanan.ongkir > 0 && (
                        <div className="flex justify-between">
                          <span>Ongkos Kirim</span>
                          <span>{rupiah(pesanan.ongkir)}</span>
                        </div>
                      )}

                      <div className="flex justify-between border-t pt-3 text-base font-black">
                        <span>Total Bayar</span>
                        <span className="text-blue-600">
                          {rupiah(pesanan.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
