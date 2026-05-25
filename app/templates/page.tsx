import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Contoh Halaman | LynkSell',
  description: 'Contoh hasil halaman landing page jualan yang dibuat dengan AI oleh LynkSell.',
};

export default function TemplatesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900 tracking-tight mb-4">
              Lebih Dari Sekadar <span className="text-indigo-600">Link di Bio</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Lihat contoh rancangan halaman landing page profesional yang dirancang otomatis oleh AI kami 
              untuk berbagai kategori bisnis UMKM.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Elegant Theme */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group">
              <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1600&auto=format&fit=crop" 
                  alt="Template Elegant" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white text-left">
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-2 inline-block">Elegant</span>
                  <h3 className="text-2xl font-bold">Produk Kecantikan & Skincare</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-6">
                  Warna soft dengan tipografi serif yang anggun. Sangat pas untuk produk kecantikan, perhiasan, dan brand luxury.
                </p>
                <Link href="/register">
                  <Button className="w-full bg-slate-900 hover:bg-slate-800 rounded-xl">Buat dengan Template Ini</Button>
                </Link>
              </div>
            </div>

            {/* Fresh Theme */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group">
              <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1600&auto=format&fit=crop" 
                  alt="Template Fresh" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white text-left">
                  <span className="bg-emerald-500/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-2 inline-block">Fresh</span>
                  <h3 className="text-2xl font-bold">Makanan Sehat & Minuman</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-6">
                  Tampilan cerah dengan sentuhan warna hijau dan natural. Membuat produk makanan tampak lebih menggiurkan dan segar.
                </p>
                <Link href="/register">
                  <Button className="w-full bg-slate-900 hover:bg-slate-800 rounded-xl">Buat dengan Template Ini</Button>
                </Link>
              </div>
            </div>

            {/* Bold Theme */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group">
              <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=1600&auto=format&fit=crop" 
                  alt="Template Bold" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white text-left">
                  <span className="bg-rose-500/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-2 inline-block">Bold</span>
                  <h3 className="text-2xl font-bold">Fashion & Sneaker</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-6">
                  Warna kontras yang kuat dengan font besar dan tegas. Dirancang untuk brand fashion kekinian yang ingin tampil beda.
                </p>
                <Link href="/register">
                  <Button className="w-full bg-slate-900 hover:bg-slate-800 rounded-xl">Buat dengan Template Ini</Button>
                </Link>
              </div>
            </div>

            {/* Minimalist Theme */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group">
              <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600&auto=format&fit=crop" 
                  alt="Template Minimalist" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white text-left">
                  <span className="bg-indigo-500/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-2 inline-block">Minimalist</span>
                  <h3 className="text-2xl font-bold">Elektronik & Gadget</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-6">
                  Bersih, rapi, dan teknologi sentris. Fokus utama pada produk tanpa banyak distraksi visual yang tidak perlu.
                </p>
                <Link href="/register">
                  <Button className="w-full bg-slate-900 hover:bg-slate-800 rounded-xl">Buat dengan Template Ini</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
