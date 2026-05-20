import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Mail, Heart, HandHeart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Hubungi Kami & Dukungan | LynkSell',
  description: 'Hubungi tim LynkSell atau berikan dukungan untuk kelangsungan platform ini.',
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900 tracking-tight mb-4">
              Kontak & <span className="text-indigo-600">Dukungan</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              LynkSell dibangun untuk membantu UMKM Indonesia. Jika kamu memiliki kritik, saran, atau sekadar ingin mendukung kelangsungan platform gratis ini, kami sangat mengapresiasinya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                  <Mail className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">Kritik & Saran</h2>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Punya ide fitur baru? Menemukan bug? Atau butuh bantuan seputar platform? Jangan ragu untuk mengirimkan email kepada tim developer kami.
                </p>
              </div>
              
              <a 
                href="mailto:arospace96@gmail.com" 
                className="inline-flex items-center justify-center w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-4 px-6 rounded-xl transition-all shadow-md"
              >
                Kirim Email ke arospace96@gmail.com
              </a>
            </div>

            {/* Support / Donate Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 shadow-md text-white flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-white/20 text-white rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                  <HandHeart className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Dukung LynkSell</h2>
                <p className="text-indigo-100 mb-8 leading-relaxed">
                  LynkSell 100% gratis tanpa potongan untuk penjualanmu. Berikan dukungan donasi seikhlasnya agar kami bisa terus membayar biaya server & AI untuk melayani lebih banyak UMKM.
                </p>
              </div>
              
              <Link href="#" className="inline-flex items-center justify-center w-full bg-white text-indigo-600 hover:bg-slate-50 font-bold py-4 px-6 rounded-xl transition-all shadow-lg group">
                <Heart className="w-5 h-5 mr-2 text-rose-500 group-hover:scale-110 transition-transform" />
                Donasi Sekarang
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
