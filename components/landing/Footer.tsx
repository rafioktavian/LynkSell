'use client';

import Link from 'next/link';
import { Logo } from '@/components/ui/logo';

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200/60 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Logo Column */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Logo className="w-8 h-8 text-indigo-600 drop-shadow-md" />
              <span className="text-xl font-heading font-extrabold text-slate-900 tracking-tight">
                LynkSell
              </span>
            </Link>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Platform landing page AI pertama yang membebaskan UMKM Indonesia dari potongan komisi marketplace.
            </p>
          </div>

          {/* Links Column */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Produk</h4>
            <ul className="space-y-3">
              <li><Link href="#fitur" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Fitur</Link></li>
              <li><Link href="#harga" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Harga</Link></li>
              <li><Link href="/login" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Masuk</Link></li>
              <li><Link href="/register" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Daftar</Link></li>
            </ul>
          </div>

          {/* Socials Column */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Sosial Media</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Instagram</a></li>
              <li><a href="#" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">TikTok</a></li>
              <li><a href="#" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Twitter / X</a></li>
              <li><a href="#" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Facebook</a></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Perusahaan</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Tentang Kami</a></li>
              <li><Link href="/privacy" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="/terms" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Syarat &amp; Ketentuan</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Kontak</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} LynkSell. Seluruh hak cipta dilindungi.
          </p>
          <p className="text-sm text-slate-500 font-medium flex items-center gap-1">
            Dibuat dengan ❤️ untuk UMKM Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
