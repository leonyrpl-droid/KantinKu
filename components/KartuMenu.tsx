import Link from "next/link";
import { menu, rupiah } from "@/data/menu";

type MenuItem = (typeof menu)[number];

interface KartuMenuProps {
  item: MenuItem;
}

export default function KartuMenu({ item }: KartuMenuProps) {
  const isHabis = item.stok === 0;

  return (
    <div
      className={`rounded-2xl border shadow-sm transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
        isHabis
          ? "bg-slate-100 border-slate-300 opacity-70"
          : "bg-white border-slate-200 hover:shadow-xl hover:border-blue-300"
      }`}
    >
      <div>
        {/* Visual Gambar Menu */}
        <div
          className={`h-44 flex items-center justify-center relative overflow-hidden ${
            isHabis
              ? "bg-slate-200"
              : "bg-gradient-to-br from-blue-500/10 via-slate-100 to-blue-50"
          }`}
        >
          <span
            className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full shadow-sm border ${
              isHabis
                ? "bg-slate-300 border-slate-400 text-slate-700"
                : "bg-emerald-50 border-emerald-200 text-emerald-700"
            }`}
          >
            {isHabis ? "Habis" : `Stok: ${item.stok}`}
          </span>

          <span
            className={`text-lg font-bold text-center px-4 ${
              isHabis ? "text-slate-500" : "text-blue-900/70"
            }`}
          >
            {item.nama}
          </span>
        </div>

        {/* Informasi Produk */}
        <div className="p-6">
          <div className="mb-3">
            <span className="bg-blue-50 text-blue-700 text-[11px] font-bold px-3 py-1 rounded-md border border-blue-100 uppercase tracking-wider">
              {item.kategori}
            </span>
          </div>

          <h3
            className={`font-bold text-xl ${
              isHabis ? "text-slate-500" : "text-slate-900"
            }`}
          >
            {item.nama}
          </h3>

          <div className="mt-4 flex items-baseline justify-between border-t border-slate-200 pt-4">
            <span className="text-xs text-slate-400 font-medium">
              Harga Satuan
            </span>

            <span
              className={`text-2xl font-black ${
                isHabis ? "text-slate-500" : "text-blue-600"
              }`}
            >
              {rupiah(item.harga)}
            </span>
          </div>
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="p-6 pt-0">
        {isHabis ? (
          <button
            type="button"
            disabled
            className="block w-full rounded-xl bg-slate-300 text-slate-600 font-bold py-3 text-sm cursor-not-allowed"
          >
            Menu Habis
          </button>
        ) : (
          <Link
            href={`/menu/${item.id}`}
            className="block text-center w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md shadow-blue-500/10 transition-all duration-200 text-sm"
          >
            Lihat Detail Menu
          </Link>
        )}
      </div>
    </div>
  );
}
