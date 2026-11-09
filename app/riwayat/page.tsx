"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { rupiah } from "@/data/menu";

type ItemPesanan = {
  id?: number;
  nama?: string;
  namaMenu?: string;
  jumlah?: number;
  harga?: number;
  subtotal?: number;
};

type Pesanan = {
  nama?: string;
  namaPemesan?: string;
  kelas?: string;
  tanggal?: string;
  total?: number;
  subtotal?: number;
  item?: ItemPesanan[];
  items?: ItemPesanan[];
  keranjang?: ItemPesanan[];
};

export default function HalamanRiwayat() {
  const [riwayat, setRiwayat] = useState<Pesanan[]>([]);

  useEffect(() => {
    try {
      const data = localStorage.getItem("riwayat");
      const daftar: Pesanan[] = data ? JSON.parse(data) : [];

      setRiwayat([...daftar].reverse());
    } catch {
      setRiwayat([]);
    }
  }, []);

  const totalBelanja = riwayat.reduce(
    (total, pesanan) => total + Number(pesanan.total ?? pesanan.subtotal ?? 0),
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

        <div className="my-6 grid gap-4 sm:grid-cols-2">
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

        {riwayat.length === 0 ? (
          <div className="rounded-2xl border bg-white p-10 text-center">
            <p className="font-semibold text-slate-600">Belum ada pesanan.</p>

            <Link
              href="/menu"
              className="mt-4 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white"
            >
              Lihat Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {riwayat.map((pesanan, index) => {
              const daftarItem =
                pesanan.item ?? pesanan.items ?? pesanan.keranjang ?? [];

              return (
                <div
                  key={index}
                  className="rounded-2xl border bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-wrap justify-between gap-3 border-b pb-4">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        {pesanan.nama ?? pesanan.namaPemesan ?? "Pesanan"}
                      </h2>
                      <p className="text-sm text-slate-500">
                        {pesanan.kelas ?? ""}
                      </p>
                    </div>

                    <p className="text-sm text-slate-500">
                      {pesanan.tanggal ?? "Tanggal tidak tersedia"}
                    </p>
                  </div>

                  <div className="space-y-2 py-4">
                    {daftarItem.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="flex justify-between gap-3 text-sm"
                      >
                        <span>
                          {item.nama ??
                            item.namaMenu ??
                            `Menu ID ${item.id ?? "-"}`}{" "}
                          x {item.jumlah ?? 1}
                        </span>
                        <span>
                          {rupiah(
                            Number(
                              item.subtotal ??
                                (item.harga ?? 0) * (item.jumlah ?? 1),
                            ),
                          )}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between border-t pt-4 font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">
                      {rupiah(Number(pesanan.total ?? pesanan.subtotal ?? 0))}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
