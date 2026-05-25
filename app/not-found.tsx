"use client";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-700 mb-6">Halaman Tidak Ditemukan</h2>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">
          Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>
        <a href="/" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 py-3">
          Kembali ke Beranda
        </a>
      </div>
    </div>
  );
}
