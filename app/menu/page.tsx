import { menu } from "@/data/menu";
import KatalogInteraktif from "@/components/KatalogInteraktif";

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <span className="text-blue-600 font-bold text-sm">KANTINKU</span>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Katalog Menu 🍲
          </h1>

          <p className="text-gray-500 mt-2">
            Pilih makanan dan minuman favoritmu.
          </p>

          <p className="text-sm text-gray-500 mt-3">
            Total Menu: {menu.length} Item
          </p>
        </div>

        <KatalogInteraktif />
      </div>
    </div>
  );
}
