import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Sparkles, Upload, Wand2, Share2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <header className="w-full py-4 px-6 sm:px-12 flex justify-between items-center max-w-7xl mx-auto border-b border-transparent">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">LynkSell</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
            Masuk
          </Link>
          <Link href="/register">
            <Button size="sm" className="rounded-full px-5 bg-indigo-600 hover:bg-indigo-700 text-white">
              Daftar Gratis
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center pt-20 pb-16 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100/50 text-indigo-700 text-sm font-semibold mb-8 border border-indigo-200">
          <Sparkles className="w-4 h-4" />
          <span>Generasi Baru Jualan Online</span>
        </div>
        
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
          Satu link. <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Ribuan pembeli.
          </span><br className="hidden sm:block" />
          Tanpa marketplace.
        </h1>
        
        <p className="text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
          Buat halaman jualan kelas profesional hanya dari sebuah foto produk dalam 30 detik. 
          Bebas potongan komisi, 100% milik Anda.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/register" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto rounded-full px-8 text-base h-14 bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 group text-white">
              Mulai Gratis <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
             <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 text-base h-14 border-slate-300 text-slate-700 hover:bg-slate-100 bg-white">
               Masuk Dashboard
             </Button>
          </Link>
        </div>

        <div className="mt-12 text-sm text-slate-500 font-medium">
          <p>⚡ Sudah dipakai 1.000+ seller di seluruh Indonesia</p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full text-left max-w-5xl">
           <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
             <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
               <Upload className="w-6 h-6 text-indigo-600" />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">1. Upload Foto</h3>
             <p className="text-slate-600 leading-relaxed">
               Cukup upload foto produk terbaik Anda. Tidak perlu pusing mikir alat atau desain.
             </p>
           </div>
           
           <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
             <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
               <Wand2 className="w-6 h-6 text-purple-600" />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">2. AI Bekerja</h3>
             <p className="text-slate-600 leading-relaxed">
               Gemini AI akan menuliskan copywriting yang menjual (headline, manfaat, urgensi).
             </p>
           </div>
           
           <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
             <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
               <Share2 className="w-6 h-6 text-emerald-600" />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">3. Siap Jualan</h3>
             <p className="text-slate-600 leading-relaxed">
               Dapatkan link khusus yang siap disebar di Bio Instagram, TikTok, atau WhatsApp.
             </p>
           </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 mt-auto border-t border-slate-200 text-center">
        <p className="text-slate-500 flex items-center justify-center gap-2 text-sm font-medium">
          Diberdayakan oleh <Sparkles className="w-4 h-4 text-amber-500" /> Gemini AI
        </p>
      </footer>
    </div>
  );
}
