import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-50 px-6 text-center">
      <div className="max-w-2xl space-y-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Selamat Datang di <span className="text-blue-600">KantinKu</span> 🍲
        </h1>
        <p className="text-lg text-slate-600 max-w-lg mx-auto leading-relaxed">
          Pesan makanan dan minuman favoritmu di kantin sekolah dengan cepat,
          mudah, dan tanpa antre panjang.
        </p>
        <div>
          <Link
            href="/menu"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-full shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-200"
          >
            Lihat Menu Kantin
          </Link>
        </div>
      </div>
    </main>
  );
}
