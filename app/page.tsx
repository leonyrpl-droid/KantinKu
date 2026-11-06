
export default function Home() {
  return (
    <div>
      <section className="py-12 text-center">
        <h1 className="text-4xl font-bold text-purple-700">
          Selamat Datang di KantinKu
        </h1>

        <p className="mt-4 text-gray-600">
          Pesan makanan dan minuman favoritmu dengan mudah!
        </p>
      </section>

      <section className="bg-white p-8 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold mb-3">
          Halaman Utama KantinKu
        </h2>

        <p className="text-gray-600">
          Silakan pilih menu untuk melihat makanan dan minuman
          yang tersedia di kantin sekolah.
        </p>
      </section>
    </div>
  );
}
