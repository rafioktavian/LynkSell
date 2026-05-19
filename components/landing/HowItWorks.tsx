'use client';

import { motion } from 'motion/react';
import { Upload, Sparkles, Send } from 'lucide-react';

const steps = [
  {
    num: "01",
    title: "Upload Foto Produk",
    desc: "Cukup pakai foto dari HP Anda. Tidak perlu mikir desain atau deskripsi panjang.",
    icon: Upload,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    num: "02",
    title: "AI Bekerja",
    desc: "Gemini AI akan memproses foto, menuliskan headline, detail, dan urgensi pembelian secara otomatis.",
    icon: Sparkles,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    num: "03",
    title: "Mulai Jualan",
    desc: "Dapatkan link landing page unik yang siap dipasang di bio Instagram, TikTok, atau dikirim via WhatsApp.",
    icon: Send,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  }
];

export default function HowItWorks() {
  return (
    <section id="fitur" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Semudah 1-2-3
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Hanya butuh 30 detik untuk mengubah foto biasa menjadi halaman jualan profesional yang siap mendatangkan pembeli.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="relative group bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute top-6 right-6 font-heading text-6xl font-black text-slate-100 select-none transition-colors group-hover:text-slate-100/70 z-0">
                {step.num}
              </div>
              
              <div className="relative z-10">
                <div className={`w-14 h-14 ${step.bg} rounded-2xl flex items-center justify-center mb-8`}>
                  <step.icon className={`w-7 h-7 ${step.color}`} />
                </div>
                <h3 className="font-heading text-xl font-bold text-slate-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
