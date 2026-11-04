import { Star } from 'lucide-react';
const examples = [
  { name: 'Usaha perawatan diri', text: 'Satu halaman untuk mengenalkan produk, menjelaskan manfaat, dan mengajak pembeli mengobrol.' },
  { name: 'Usaha kuliner rumahan', text: 'Foto menu, harga, dan cara pesan yang mudah ditemukan. Bagikan link ketika pelanggan bertanya.' },
  { name: 'Brand fashion lokal', text: 'Beri ruang untuk detail yang membuat produk Anda berbeda. Tampilkan dengan warna brand sendiri.' },
];
export default function Testimonials() {
  return <section className="section-space bg-white">
    <div className="page-width"><div className="reveal mb-12" data-reveal><p className="eyebrow mb-5 text-ink-muted">Berbagai usaha. Satu cara mudah.</p><h2 className="section-title max-w-2xl">Ada ruang untuk<br />usaha Anda.</h2></div>
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5" tabIndex={0} role="region" aria-label="Contoh penggunaan LynkSell">
        {examples.map(example => <article key={example.name} className="flex min-h-[260px] min-w-[85%] snap-start flex-col rounded-3xl border bg-surface-soft p-7 md:min-w-0 md:flex-1"><Star size={22} strokeWidth={1.3} className="mb-8 text-brand" aria-hidden="true" /><h3 className="mb-3 text-xl font-semibold tracking-tight">{example.name}</h3><p className="text-base leading-relaxed text-ink-muted">{example.text}</p></article>)}
      </div>
    </div>
  </section>;
}
