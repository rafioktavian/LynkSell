'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Menu, X } from 'lucide-react';
import { Logo } from '@/components/ui/logo';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return <header className="glass-nav sticky top-0 z-50">
    <nav className="page-width flex min-h-[72px] items-center gap-6" aria-label="Navigasi utama">
      <Link href="/" className="flex min-h-11 items-center gap-2.5 text-xl font-semibold tracking-tight"><Logo className="h-8 w-8 text-brand" aria-hidden="true" />LynkSell</Link>
      <div className="ml-auto hidden items-center gap-7 text-xs font-medium text-ink-muted md:flex">
        <Link href="/#cara-kerja" className="inline-flex min-h-11 items-center hover:text-ink">Cara kerja</Link>
        <Link href="/#fitur" className="inline-flex min-h-11 items-center hover:text-ink">Fitur</Link>
        <Link href="/templates" className="inline-flex min-h-11 items-center hover:text-ink">Inspirasi</Link>
      </div>
      <div className="ml-auto flex items-center gap-2 md:ml-2">
        <Link href="/login" className="hidden min-h-11 items-center px-3 text-xs font-medium sm:inline-flex">Masuk</Link>
        <Link href="/register" className="pill-button min-h-11 px-4 py-2 text-xs">Mulai gratis <ArrowRight size={14} aria-hidden="true" /></Link>
        <button type="button" className="flex h-11 w-11 items-center justify-center rounded-full md:hidden" aria-expanded={open} aria-controls="marketing-mobile-menu" aria-label={open ? 'Tutup navigasi' : 'Buka navigasi'} onClick={() => setOpen(!open)}>{open ? <X size={20} /> : <Menu size={20} />}</button>
      </div>
    </nav>
    {open && <nav id="marketing-mobile-menu" aria-label="Navigasi mobile" className="page-width flex flex-col border-t py-3 text-sm md:hidden">
      {[['/#cara-kerja', 'Cara kerja'], ['/#fitur', 'Fitur'], ['/templates', 'Inspirasi'], ['/login', 'Masuk']].map(([href, label]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="flex min-h-12 items-center">{label}</Link>)}
    </nav>}
  </header>;
}
