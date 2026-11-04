import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
export default function CTABanner() {
  return <section className="section-space bg-[#eae7f4] text-center">
    <div className="page-width reveal" data-reveal><p className="eyebrow mb-6 text-brand">Giliran produk Anda</p><h2 className="section-title mx-auto max-w-[19ch]">Jualan berikutnya,<br />mulai dengan satu foto.</h2><p className="body-large mx-auto mt-6">Buat halaman pertama Anda. Rapikan ceritanya. Bagikan ke mana saja.</p><Link href="/register" className="pill-button mt-8">Buat halaman gratis <ArrowRight size={17} aria-hidden="true" /></Link><p className="mt-5 text-xs text-ink-muted">Tanpa kartu kredit. Tanpa coding.</p></div>
  </section>;
}
