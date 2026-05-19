'use client';

import { motion } from 'motion/react';
import { ArrowRight, Lock, Clock, Ban } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CTABanner() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden relative shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800" />
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 mix-blend-overlay" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 mix-blend-overlay" />

        <div className="relative z-10 px-6 py-20 md:py-24 text-center flex flex-col items-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 max-w-3xl"
          >
            Mulai jualan lebih pintar hari ini.
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-indigo-100 text-lg md:text-xl font-medium mb-12"
          >
            Gratis. Tanpa kartu kredit. Setup cuma 30 detik.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/register">
              <Button size="lg" className="h-16 px-10 text-lg font-bold rounded-full bg-white text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 shadow-xl shadow-indigo-900/20 group transition-all">
                Daftar Sekarang <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex gap-6 mt-12 flex-wrap items-center justify-center text-indigo-200 text-sm font-medium"
          >
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" /> <span>Aman &amp; Terpercaya</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> <span>30 Detik Setup</span>
            </div>
            <div className="flex items-center gap-2">
              <Ban className="w-4 h-4" /> <span>Tanpa Potongan Komisi</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
