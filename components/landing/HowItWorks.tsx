import Image from 'next/image';
import { Upload, Sparkles, ArrowUpRight, Check, Link2, QrCode } from 'lucide-react';

const steps = [
  { title: 'Mulai dari satu foto.', desc: 'Pilih foto produk terbaik dari HP Anda. AI mengenali produk dan membantu menyiapkan informasinya.', Icon: Upload },
  { title: 'Beri sentuhan Anda.', desc: 'Lengkapi harga dan WhatsApp. Pilih warna, lalu biarkan AI menyusun headline dan cerita produk.', Icon: Sparkles },
  { title: 'Bagikan. Sambut pembeli.', desc: 'Tinjau halaman, publikasikan, lalu taruh link di bio atau kirim lewat chat. Pembeli bisa langsung menghubungi Anda.', Icon: ArrowUpRight },
];
export default function HowItWorks() {
  return <section id="cara-kerja" className="section-space bg-white">
    <div className="page-width">
      <div className="reveal mb-16 max-w-2xl" data-reveal><p className="eyebrow mb-5 text-ink-muted">Cara kerja</p><h2 className="section-title">Dari foto.<br />Jadi cerita. Jadi jualan.</h2></div>
      <ol className="marketing-steps">
        {steps.map(({ title, desc, Icon }, i) => <li key={title} className="marketing-step reveal" data-reveal>
          <div className="step-copy"><p className="mb-5 text-sm font-medium text-brand">0{i + 1}<span className="ml-4 inline-block h-px w-12 bg-current align-middle opacity-30" /></p><h3 className="mb-5 text-3xl font-semibold leading-[1.1] tracking-[-.04em] md:text-4xl">{title}</h3><p className="body-large">{desc}</p></div>
          <div className={`step-art step-art-${i}`} aria-hidden="true">
            {i === 0 && <div className="step-upload"><div className="relative aspect-square w-40 overflow-hidden rounded-2xl"><Image src="/demo-product.jpg" alt="" fill sizes="160px" className="object-cover object-[center_65%]" /></div><span className="mt-5 flex items-center gap-2 text-sm"><Icon size={17} />Foto produk siap</span><span className="mt-2 text-xs text-ink-muted">Dari galeri HP Anda</span></div>}
            {i === 1 && <div className="step-details"><span className="mb-6 flex items-center gap-2 text-xs font-medium text-brand"><Icon size={16} />Cerita produk Anda</span><div className="step-field"><span>Headline</span><strong>Rawat diri. Sesederhana ini.</strong></div><div className="step-field"><span>Harga</span><strong>Rp 129.000</strong></div><div className="mt-5 flex gap-2">{['#1d1d1f', '#4338b8', '#14664b', '#d8bb7c'].map(color => <span key={color} className="h-7 w-7 rounded-full border border-black/10" style={{ background: color }} />)}</div></div>}
            {i === 2 && <div className="step-publish"><div className="mb-7 flex h-14 w-14 items-center justify-center rounded-full bg-[#e3eee7] text-[#14664b]"><Check size={26} /></div><span className="text-xl font-semibold tracking-tight">Siap bertemu pembeli.</span><span className="mt-5 flex items-center gap-2 rounded-full border bg-white px-5 py-3 text-xs"><Link2 size={15} />lynksell.vercel.app/ruang/perawatan</span><QrCode className="mt-7 text-ink-muted" size={44} strokeWidth={1} /></div>}
          </div>
        </li>)}
      </ol>
    </div>
  </section>;
}
