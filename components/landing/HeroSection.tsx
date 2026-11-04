import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';
import DemoVisual from './DemoVisual';

export default function HeroSection() {
  return <section className="marketing-hero">
    <div className="page-width text-center">
      <p className="eyebrow mb-6 text-ink-muted">Ruang baru untuk jualan Anda</p>
      <h1 className="display-title mx-auto max-w-[16ch]">Produk hebat.<br /><span className="text-brand">Layak tampil hebat.</span></h1>
      <p className="body-large mx-auto mt-7 max-w-[44ch]">Dari satu foto ke halaman jualan dalam 30 detik. Anda fokus ke produk. LynkSell merapikan ceritanya.</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
        <Link className="pill-button" href="/register">Mulai gratis <ArrowRight size={17} aria-hidden="true" /></Link>
        <a className="text-link text-ink" href="#contoh">Lihat hasilnya <ChevronRight size={18} aria-hidden="true" /></a>
      </div>
      <p className="mt-5 text-xs text-ink-muted">Tanpa coding. Pesanan langsung ke WhatsApp.</p>
    </div>
    <DemoVisual />
  </section>;
}
