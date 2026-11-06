import Link from "next/link";
import { rupiah, type Menu } from "@/data/menu";

export default function KartuMenu({ item }: { item: Menu }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-5">
      <h2 className="text-lg font-bold text-gray-800">{item.nama}</h2>

      <p className="text-sm text-gray-500 mt-2">{item.kategori}</p>

      <p className="text-purple-700 font-bold mt-3">{rupiah(item.harga)}</p>

      <p className="text-sm text-gray-600 mt-2">Stok: {item.stok}</p>

      {item.stok === 0 ? (
        <p className="text-red-600 font-semibold mt-3">Habis</p>
      ) : (
        <Link
          href={`/menu/${item.id}`}
          className="block text-center bg-purple-700 text-white rounded-lg py-2 mt-4 hover:bg-purple-800"
        >
          Lihat Detail
        </Link>
      )}
    </div>
  );
}
