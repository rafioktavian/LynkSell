"use client";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-black text-slate-200 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Halaman Tidak Ditemukan</h2>
        <p className="text-slate-600 mb-8">
          Maaf, halaman jualan yang Anda tuju mungkin sudah dihapus atau URL-nya salah.
        </p>
        <a href="/" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 py-3">
          Buat halaman jualanmu sendiri &rarr;
        </a>
      </div>
    </div>
  );
}
