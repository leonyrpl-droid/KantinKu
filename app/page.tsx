import Link from "next/link";

export default function Home() {
  return (
    <div>
      <section className="py-16 text-center">
        <h1 className="text-4xl font-bold text-purple-700">
          Selamat Datang di KantinKu
        </h1>

        <p className="mt-4 text-gray-600">
          Nikmati berbagai makanan dan minuman favoritmu di kantin sekolah.
        </p>

        <Link
          href="/menu"
          className="inline-block mt-6 bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-800"
        >
          Lihat Menu
        </Link>
      </section>
    </div>
  );
}
