import { notFound } from "next/navigation";
import Link from "next/link";
import { menu, rupiah } from "@/data/menu";

export default async function DetailMenu({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const item = menu.find((m) => m.id === Number(id));

  if (!item) {
    notFound();
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm border p-8">
      <h1 className="text-3xl font-bold text-purple-700">{item.nama}</h1>

      <p className="text-gray-500 mt-3">Kategori: {item.kategori}</p>

      <p className="text-xl font-bold text-purple-700 mt-5">
        {rupiah(item.harga)}
      </p>

      <p className="mt-3">Stok tersedia: {item.stok}</p>

      {item.stok === 0 && <p className="text-red-600 font-bold mt-3">Habis</p>}

      <Link
        href="/menu"
        className="inline-block mt-6 bg-purple-700 text-white px-5 py-2 rounded-lg"
      >
        Kembali ke Menu
      </Link>
    </div>
  );
}
