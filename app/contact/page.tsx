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
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col">
              <div>
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                  <Mail className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">Kritik & Saran</h2>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Punya ide fitur baru? Menemukan bug? Atau setelah donasi ingin konfirmasi? Jangan ragu untuk hubungi kami.
                </p>
              </div>
              
              <div className="space-y-4 mt-auto">
                <a 
                  href="mailto:lynksellid@gmail.com" 
                  className="inline-flex items-center justify-center w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3.5 px-6 rounded-xl transition-all shadow-sm"
                >
                  <Mail className="w-5 h-5 mr-3" />
                  lynksellid@gmail.com
                </a>
                <a 
                  href="https://wa.me/6289614300254" 
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-medium py-3.5 px-6 rounded-xl transition-all shadow-sm"
                >
                  <svg className="w-5 h-5 mr-3 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                  WhatsApp (+62 896-1430-0254)
                </a>
              </div>
            </div>

            {/* Support / Donate Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 shadow-md text-white flex flex-col">
              <div>
                <div className="w-14 h-14 bg-white/20 text-white rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                  <HandHeart className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Dukung LynkSell</h2>
                <p className="text-indigo-100 mb-6 leading-relaxed">
                  LynkSell 100% gratis tanpa potongan untuk penjualanmu. Berikan dukungan donasi seikhlasnya agar kami bisa terus melayani lebih banyak UMKM.
                </p>

                <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm mb-6 space-y-5 text-sm">
                  <div>
                    <h3 className="font-semibold text-white/80 mb-3 uppercase text-xs tracking-wider flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></span>
                      E-Wallet
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                        <span className="font-medium text-slate-100">OVO</span>
                        <span className="font-mono font-medium text-indigo-100">+62 896-1430-0254</span>
                      </div>
                      <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                        <span className="font-medium text-slate-100">GoPay</span>
                        <span className="font-mono font-medium text-indigo-100">+62 896-1430-0254</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-white/20 pt-5">
                     <h3 className="font-semibold text-white/80 mb-3 uppercase text-xs tracking-wider flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                      Transfer Bank
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-white/5 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-slate-100">BSI</span>
                          <span className="font-mono font-medium text-indigo-100 tracking-wide text-base">7197063453</span>
                        </div>
                        <p className="text-white/60 text-xs text-right">a.n Akhmad Rafi Oktavian</p>
                      </div>
                      <div className="bg-white/5 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-slate-100">Mandiri</span>
                          <span className="font-mono font-medium text-indigo-100 tracking-wide text-base">1310014121570</span>
                        </div>
                        <p className="text-white/60 text-xs text-right">a.n Akhmad Rafi Oktavian</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center text-indigo-200 text-sm mt-auto flex items-center justify-center font-medium">
                <Heart className="w-4 h-4 mr-1.5 text-rose-400" />
                Terima kasih atas kepedulian Anda
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
