"use client";

import { useEffect, useState, useMemo } from "react";
import { menu, rupiah } from "@/data/menu";
import Link from "next/link";

interface CartItem {
  id: number;
  jumlah: number;
}

interface OrderItem {
  nama: string;
  jumlah: number;
  subtotal: number;
}

interface OrderReceipt {
  nama: string;
  caraAmbil: string;
  kelas: string;
  item: OrderItem[];
  subtotal: number;
  diskon: number;
  ongkir: number;
  total: number;
  tanggal: string;
}

const bacaKeranjangAwal = (): CartItem[] => {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem("keranjang");
    if (!data) return [];

    const parsed: unknown = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is CartItem =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as Record<string, unknown>).id === "number" &&
        typeof (item as Record<string, unknown>).jumlah === "number" &&
        Number.isInteger((item as Record<string, unknown>).jumlah) &&
        Number((item as Record<string, unknown>).jumlah) >= 1,
    );
  } catch (error) {
    console.error("Gagal membaca keranjang:", error);
    return [];
  }
};

export default function KeranjangPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [kodePromo, setKodePromo] = useState("");
  const [diskonAktif, setDiskonAktif] = useState(false);
  const [pesanPromo, setPesanPromo] = useState("");
  const [caraAmbil, setCaraAmbil] = useState("Ambil sendiri");
  const [kelas, setKelas] = useState("");
  const [namaPemesan, setNamaPemesan] = useState("");
  const [struk, setStruk] = useState<OrderReceipt | null>(null);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setCart(bacaKeranjangAwal());
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  const simpanKeranjang = (updated: CartItem[]) => {
    setCart(updated);
    localStorage.setItem("keranjang", JSON.stringify(updated));
    window.dispatchEvent(new Event("keranjang-berubah"));
  };

  const updateJumlah = (id: number, delta: number) => {
    const menuItem = menu.find((m) => m.id === id);

    const updated = cart.map((item) => {
      if (item.id === id) {
        const jumlahBaru = item.jumlah + delta;

        if (jumlahBaru < 1) return item;

        if (menuItem && jumlahBaru > menuItem.stok) {
          alert(`Jumlah melebihi stok tersedia (${menuItem.stok}).`);
          return item;
        }

        return { ...item, jumlah: jumlahBaru };
      }

      return item;
    });

    simpanKeranjang(updated);
  };

  const hapusItem = (id: number) => {
    const updated = cart.filter((item) => item.id !== id);
    simpanKeranjang(updated);
  };

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => {
      const found = menu.find((m) => m.id === item.id);
      return total + (found ? found.harga * item.jumlah : 0);
    }, 0);
  }, [cart]);

  const diskonAktifValid = diskonAktif && subtotal >= 20000;

  const diskonNilai = diskonAktifValid ? Math.round(subtotal * 0.1) : 0;

  const ongkir = caraAmbil === "Diantar" ? 2000 : 0;
  const totalBayar = subtotal - diskonNilai + ongkir;

  const pesanPromoTampil =
    diskonAktif && subtotal < 20000
      ? "Promo HEMAT10 butuh belanja minimal Rp 20.000."
      : pesanPromo;

  const handlePakaiPromo = () => {
    const kode = kodePromo.trim().toUpperCase();

    if (kode === "HEMAT10") {
      if (subtotal >= 20000) {
        setDiskonAktif(true);
        setPesanPromo("Promo HEMAT10 dipakai: diskon 10%.");
      } else {
        setDiskonAktif(false);
        setPesanPromo("Promo HEMAT10 butuh belanja minimal Rp 20.000.");
      }
    } else if (kode === "") {
      setDiskonAktif(false);
      setPesanPromo("");
    } else {
      setDiskonAktif(false);
      setPesanPromo("Kode promo tidak dikenal.");
    }
  };

  const handlePesanSekarang = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Keranjang masih kosong.");
      return;
    }

    for (const item of cart) {
      const menuItem = menu.find((m) => m.id === item.id);

      if (
        !menuItem ||
        !Number.isInteger(item.jumlah) ||
        item.jumlah < 1 ||
        item.jumlah > menuItem.stok
      ) {
        alert("Jumlah pesanan tidak valid atau melebihi stok.");
        return;
      }
    }

    if (namaPemesan.trim().length < 3) {
      alert("Nama pemesan minimal 3 huruf.");
      return;
    }

    if (caraAmbil === "Diantar" && kelas.trim().length < 3) {
      alert("Kelas wajib diisi minimal 3 karakter untuk opsi Diantar.");
      return;
    }

    const diskonFinal = diskonAktifValid ? Math.round(subtotal * 0.1) : 0;

    const detailPesanan: OrderReceipt = {
      nama: namaPemesan.trim(),
      caraAmbil,
      kelas: caraAmbil === "Diantar" ? kelas.trim() : "-",
      item: cart.map((c) => {
        const m = menu.find((x) => x.id === c.id);

        return {
          nama: m?.nama || "Menu tidak ditemukan",
          jumlah: c.jumlah,
          subtotal: (m?.harga || 0) * c.jumlah,
        };
      }),
      subtotal,
      diskon: diskonFinal,
      ongkir,
      total: subtotal - diskonFinal + ongkir,
      tanggal: new Date().toLocaleString("id-ID"),
    };

    try {
      const dataLama = localStorage.getItem("riwayat");
      const parsed: unknown = dataLama ? JSON.parse(dataLama) : [];
      const riwayatLama = Array.isArray(parsed) ? parsed : [];

      localStorage.setItem(
        "riwayat",
        JSON.stringify([detailPesanan, ...riwayatLama]),
      );
    } catch (error) {
      console.error("Gagal menyimpan riwayat:", error);
      alert("Pesanan gagal disimpan ke riwayat.");
      return;
    }

    setStruk(detailPesanan);
    setCart([]);
    localStorage.removeItem("keranjang");
    window.dispatchEvent(new Event("keranjang-berubah"));
  };

  if (struk) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
          <div className="text-center">
            <span className="bg-emerald-100 text-emerald-700 font-bold text-xs uppercase px-3 py-1 rounded-full border border-emerald-200">
              Pesanan Berhasil 🎉
            </span>

            <h1 className="text-2xl font-black text-slate-900 mt-3">
              Terima kasih, {struk.nama}!
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Pesanan Anda telah dicatat dan disimpan ke riwayat.
            </p>
          </div>

          <div className="border-t border-b border-slate-100 py-4 space-y-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Metode Ambil:</span>
              <span className="font-semibold text-slate-900">
                {struk.caraAmbil}{" "}
                {struk.caraAmbil === "Diantar"
                  ? `ke ${struk.kelas}`
                  : "di kantin"}
              </span>
            </div>

            <div className="space-y-2 pt-2">
              <span className="font-bold text-xs text-slate-400 uppercase">
                Rincian Menu:
              </span>

              {struk.item.map((it, idx) => (
                <div key={idx} className="flex justify-between text-slate-700">
                  <span>
                    {it.nama} x{it.jumlah}
                  </span>
                  <span className="font-semibold">{rupiah(it.subtotal)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 text-sm pt-2">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>{rupiah(struk.subtotal)}</span>
            </div>

            {struk.diskon > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Diskon Promo</span>
                <span>-{rupiah(struk.diskon)}</span>
              </div>
            )}

            {struk.ongkir > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Ongkos Kirim</span>
                <span>{rupiah(struk.ongkir)}</span>
              </div>
            )}

            <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-200 pt-3">
              <span>Total Bayar</span>
              <span className="text-blue-600">{rupiah(struk.total)}</span>
            </div>
          </div>

          <Link
            href="/menu"
            className="block text-center w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-blue-500/20 transition text-sm"
          >
            Pesan Menu Lainnya
          </Link>

          <Link
            href="/riwayat"
            className="block text-center w-full border border-blue-600 text-blue-600 font-bold py-3.5 rounded-2xl hover:bg-blue-50 transition text-sm"
          >
            Lihat Riwayat Pesanan
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 border-b border-slate-200 pb-6">
          <span className="inline-block bg-blue-100 text-blue-700 font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full mb-2 border border-blue-200">
            Checkout Belanja
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Keranjang <span className="text-blue-600">KantinKu</span> 🛒
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <p className="text-2xl font-bold text-slate-700">
              Keranjang masih kosong.
            </p>

            <p className="text-sm text-slate-400 mt-2 mb-6">
              Yuk pilih makanan atau minuman favoritmu di katalog!
            </p>

            <Link
              href="/menu"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-md transition"
            >
              Lihat Katalog Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                const menuItem = menu.find((m) => m.id === item.id);

                if (!menuItem) return null;

                const subtotalBaris = menuItem.harga * item.jumlah;

                return (
                  <div
                    key={item.id}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  >
                    <div>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase">
                        {menuItem.kategori}
                      </span>

                      <h3 className="font-bold text-lg text-slate-900 mt-2">
                        {menuItem.nama}
                      </h3>

                      <p className="text-sm text-slate-500 font-medium">
                        Harga: {rupiah(menuItem.harga)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                      <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl p-1">
                        <button
                          type="button"
                          onClick={() => updateJumlah(item.id, -1)}
                          disabled={item.jumlah <= 1}
                          className="w-8 h-8 flex items-center justify-center font-bold bg-white rounded-lg shadow-sm hover:bg-slate-100 disabled:opacity-40"
                        >
                          -
                        </button>

                        <span className="w-8 text-center font-bold text-sm">
                          {item.jumlah}
                        </span>

                        <button
                          type="button"
                          onClick={() => updateJumlah(item.id, 1)}
                          disabled={item.jumlah >= menuItem.stok}
                          className="w-8 h-8 flex items-center justify-center font-bold bg-white rounded-lg shadow-sm hover:bg-slate-100 disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-slate-400">Subtotal</p>

                        <p className="font-black text-blue-600 text-base">
                          {rupiah(subtotalBaris)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => hapusItem(item.id)}
                        className="text-rose-500 hover:text-rose-700 p-2 font-bold text-sm transition"
                        title="Hapus"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 h-fit">
              <h3 className="font-bold text-lg text-slate-900 border-b border-slate-100 pb-4">
                Ringkasan Pesanan
              </h3>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Kode Promo
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Cth: HEMAT10"
                    value={kodePromo}
                    onChange={(e) => {
                      setKodePromo(e.target.value);
                      setDiskonAktif(false);
                      setPesanPromo("");
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 uppercase"
                  />

                  <button
                    type="button"
                    onClick={handlePakaiPromo}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
                  >
                    Pakai
                  </button>
                </div>

                {pesanPromoTampil && (
                  <p
                    className={`text-xs font-semibold ${
                      diskonAktifValid ? "text-emerald-600" : "text-rose-500"
                    }`}
                  >
                    {pesanPromoTampil}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Cara Pengambilan
                </label>

                <div className="space-y-2 text-sm">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="caraAmbil"
                      value="Ambil sendiri"
                      checked={caraAmbil === "Ambil sendiri"}
                      onChange={(e) => setCaraAmbil(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />

                    <span className="font-medium text-slate-700">
                      Ambil sendiri di kantin
                    </span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="caraAmbil"
                      value="Diantar"
                      checked={caraAmbil === "Diantar"}
                      onChange={(e) => setCaraAmbil(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />

                    <span className="font-medium text-slate-700">
                      Diantar (+Rp 2.000)
                    </span>
                  </label>
                </div>
              </div>

              {caraAmbil === "Diantar" && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Kelas Tujuan
                  </label>

                  <input
                    type="text"
                    placeholder="Cth: XII RPL 1"
                    value={kelas}
                    onChange={(e) => setKelas(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>
              )}

              <div className="border-t border-slate-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{rupiah(subtotal)}</span>
                </div>

                {diskonAktifValid && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Diskon (10%)</span>
                    <span>-{rupiah(diskonNilai)}</span>
                  </div>
                )}

                {ongkir > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Ongkir</span>
                    <span>{rupiah(ongkir)}</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-200 pt-3">
                  <span>Total</span>
                  <span className="text-blue-600">{rupiah(totalBayar)}</span>
                </div>
              </div>

              <form onSubmit={handlePesanSekarang} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                    Nama Pemesan
                  </label>

                  <input
                    type="text"
                    placeholder="Masukkan nama Anda..."
                    value={namaPemesan}
                    onChange={(e) => setNamaPemesan(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-blue-500/20 transition text-sm"
                >
                  Pesan Sekarang
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
