'use client';

import { motion } from 'motion/react';
import { Bot, BadgePercent, Globe2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    title: "AI Copywriting Otomatis",
    description: "Tidak pandai merangkai kata? Serahkan pada Gemini AI. Kami menuliskan headline memikat, menonjolkan manfaat produk, hingga kalimat ajakan beli (CTA) yang terbukti meningkatkan konversi.",
    icon: Bot,
    color: "bg-blue-100 text-blue-600",
    image: "https://images.unsplash.com/photo-1661956600684-97d3a4320e45?auto=format&fit=crop&q=80&w=800&h=600",
    cta: "Lihat hasil AI",
  },
  {
    title: "Tanpa Potongan Komisi",
    description: "Marketplace mengambil potongan 10-25% dari penjualan Anda? Di LynkSell, 100% hasil penjualan masuk ke kantong Anda. Kami tidak menahan uang atau memberikan biaya admin tersembunyi.",
    icon: BadgePercent,
    color: "bg-emerald-100 text-emerald-600",
    image: "https://images.unsplash.com/photo-1580519542036-ed47f3e42214?auto=format&fit=crop&q=80&w=800&h=600",
    cta: "Mulai jual mandiri",
  },
  {
    title: "Siap Disebar di Mana Saja",
    description: "Gunakan satu link LynkSell Anda untuk ditaruh di bio Instagram, TikTok, Facebook, atau broadcast WhatsApp. Tidak perlu suruh pelanggan install aplikasi marketplace lagi.",
    icon: Globe2,
    color: "bg-purple-100 text-purple-600",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800&h=600",
    cta: "Buat link pertama",
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="font-heading text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Kenapa pilih LynkSell?
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Fokus pada kebebasan jualan dan keuntungan maksimal untuk setiap seller UMKM Indonesia.
          </p>
        </motion.div>

        <div className="flex flex-col gap-24">
          {features.map((feature, idx) => {
            const isEven = idx % 2 === 1;
            
            return (
              <div key={idx} className={`flex flex-col ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20`}>
                
                {/* Text Content */}
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7 }}
                  className="flex-1 space-y-6"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.color} mb-2`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-slate-600 leading-relaxed font-medium">
                    {feature.description}
                  </p>
                  <div className="pt-4">
                    <Link href="/register" className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-700 transition-colors group text-lg">
                      {feature.cta}
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>

                {/* Illustration / Image Mockup */}
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="flex-1 w-full"
                >
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] bg-slate-200 border border-slate-200/60">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {/* Decorative gloss effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/20" />
                  </div>
                </motion.div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
