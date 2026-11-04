import Image from 'next/image';
import { ArrowRight, Check, ImageIcon, Sparkles } from 'lucide-react';

export default function DemoVisual() {
  return <div id="contoh" className="marketing-demo page-width" aria-label="Ilustrasi: satu foto menjadi halaman jualan">
    <div className="demo-input reveal" data-reveal>
      <div className="mb-4 flex items-center gap-2 text-xs font-medium text-ink-muted"><ImageIcon size={15} aria-hidden="true" />Foto produk Anda</div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#ebe9e4]">
        <Image src="/demo-product.jpg" alt="Foto ilustrasi produk perawatan tubuh pada kain putih" fill sizes="(max-width: 767px) 36vw, 260px" className="object-cover object-[center_65%]" />
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-ink-muted"><Check size={14} aria-hidden="true" />Satu foto. Cukup.</div>
    </div>
    <div className="demo-transform" aria-hidden="true"><div><Sparkles size={22} strokeWidth={1.5} /></div><span>30 detik</span><ArrowRight size={20} /></div>
    <div className="demo-browser reveal" data-reveal>
      <div className="demo-browser-top"><span className="flex gap-1" aria-hidden="true"><i /><i /><i /></span><span>halaman jualan Anda</span><span aria-hidden="true">↗</span></div>
      <div className="demo-page-nav"><span>ruang.</span><span>Perawatan harian</span></div>
      <div className="demo-page-content">
        <p className="eyebrow text-[9px] text-ink-muted">Dibuat untuk keseharian</p>
        <h2>Rawat diri.<br />Sesederhana ini.</h2>
        <p className="demo-description">Ruang kecil untuk rutinitas yang Anda sukai.</p>
        <span className="demo-mock-cta">Pesan via WhatsApp <ArrowRight size={12} aria-hidden="true" /></span>
        <div className="demo-page-photo"><Image src="/demo-product.jpg" alt="Foto yang sama ditampilkan dalam desain halaman produk" fill priority sizes="(max-width: 767px) 78vw, 600px" className="object-cover object-[center_65%]" /></div>
      </div>
    </div>
    <p className="demo-note">Ilustrasi hasil halaman. Foto yang sama, cerita yang lebih tertata.</p>
  </div>;
}
