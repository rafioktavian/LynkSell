'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '@/components/ui/logo';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/70 backdrop-blur-md border-b border-slate-200/50 shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 z-50">
          <Logo className="w-8 h-8 text-indigo-600 drop-shadow-md" />
          <span className="text-xl font-heading font-extrabold text-slate-900 tracking-tight">
            LynkSell
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6">
            <Link href="#fitur" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              Fitur
            </Link>
            <Link href="#harga" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              Harga
            </Link>
            <Link href="#tentang" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              Tentang
            </Link>
          </div>
          <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
            <Link href="/login">
              <Button variant="ghost" className="font-semibold text-slate-700 hover:text-slate-900">
                Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button className="rounded-full px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md shadow-indigo-200/50">
                Daftar Gratis
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden z-50 text-slate-700 p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 left-0 right-0 bg-white border-b border-slate-200 shadow-xl px-6 pt-24 pb-8 flex flex-col gap-6 md:hidden z-40"
            >
              <div className="flex flex-col gap-4">
                <Link href="#fitur" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-slate-700 border-b border-slate-100 pb-4">
                  Fitur
                </Link>
                <Link href="#harga" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-slate-700 border-b border-slate-100 pb-4">
                  Harga
                </Link>
                <Link href="#tentang" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-slate-700 border-b border-slate-100 pb-4">
                  Tentang
                </Link>
              </div>
              <div className="flex flex-col gap-3 mt-4">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full h-12 rounded-xl text-base">
                    Masuk
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full h-12 rounded-xl bg-indigo-600 text-white text-base">
                    Daftar Gratis
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
