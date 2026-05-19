"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
          ⚠️
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Terjadi Kesalahan</h1>
        <p className="text-slate-500 mb-8 whitespace-pre-wrap">{error.message || "Mohon maaf, halaman tidak dapat dimuat."}</p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => reset()} variant="default">
            Coba Lagi
          </Button>
          <Button onClick={() => window.location.href = '/'} variant="outline">
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    </div>
  );
}
