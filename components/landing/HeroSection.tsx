'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
      {/* Background Gradient Mesh - very subtle */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-white" />
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[600px] bg-purple-100/40 rounded-full blur-3xl -z-10 mix-blend-multiply opacity-70" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-3xl -z-10 mix-blend-multiply opacity-70" />

      <div className="max-w-7xl mx-auto px-6 text-center z-10 w-full flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50/80 text-indigo-700 text-sm font-semibold mb-8 border border-indigo-100 backdrop-blur-sm"
        >
          <span className="text-amber-500">✦</span>
          <span>AI-Powered untuk UMKM Indonesia</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          className="font-heading font-extrabold tracking-tight text-slate-900 leading-[1.05] text-[clamp(2.8rem,6vw,5.5rem)] max-w-4xl mx-auto mb-8"
        >
          Satu Link.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient-x">
            Ribuan Pembeli.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
          className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Buat halaman jualan profesional hanya dari sebuah foto — dalam 30 detik. Tanpa potongan marketplace. 100% untung buat Anda.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-14"
        >
          <Link href="/register" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto rounded-full px-8 h-14 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 text-base font-semibold group transition-all">
              Mulai Gratis <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 h-14 bg-white/80 backdrop-blur-sm border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 text-base font-semibold group transition-all">
            <PlayCircle className="w-5 h-5 mr-2 text-slate-400 group-hover:text-indigo-600 transition-colors" /> Lihat Demo
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.6 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="flex -space-x-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Avatar key={i} className="w-10 h-10 border-2 border-white shadow-sm ring-2 ring-slate-50">
                <AvatarImage src={`https://i.pravatar.cc/100?img=${i + 10}`} />
                <AvatarFallback className="bg-indigo-100 text-indigo-700 font-medium text-xs">U{i}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <div className="text-sm font-medium text-slate-500">
            <span className="font-bold text-slate-700">1.000+</span> seller aktif di Indonesia
          </div>
        </motion.div>
      </div>
    </section>
  );
}
