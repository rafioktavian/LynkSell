import { ArrowUpRight, Palette, Smartphone, MessageCircle, ChartNoAxesColumnIncreasing } from 'lucide-react';
export default function FeaturesSection() {
  return <section id="fitur" className="section-space">
    <div className="page-width">
      <div className="reveal mb-14 max-w-2xl" data-reveal><p className="eyebrow mb-5 text-ink-muted">Dipikirkan sampai detailnya</p><h2 className="section-title">Ringan dipakai.<br />Serius untuk jualan.</h2></div>
      <div className="marketing-bento">
        <article className="feature-lead reveal" data-reveal><p className="eyebrow text-white/70">Tanpa komisi penjualan</p><p className="feature-number">0<span>%</span></p><div><h3>Hasil jualan, untuk Anda.</h3><p>Pembeli terhubung langsung ke WhatsApp. Tidak ada potongan komisi platform dari pesanan Anda.</p></div><ArrowUpRight className="absolute right-8 top-8 opacity-60" size={28} aria-hidden="true" /></article>
        <article className="feature-card reveal" data-reveal><Palette size={28} strokeWidth={1.4} aria-hidden="true" /><div><h3>Terasa seperti brand Anda.</h3><p>Empat palet pilihan dan warna kustom. Ganti suasana tanpa merangkai desain dari awal.</p></div><div className="flex gap-3" aria-hidden="true">{['#1d1d1f', '#4338b8', '#14664b', '#d8bb7c'].map(c => <span key={c} className="h-8 w-8 rounded-full" style={{ background: c }} />)}</div></article>
        <article className="feature-card reveal" data-reveal><Smartphone size={28} strokeWidth={1.4} aria-hidden="true" /><div><h3>Nyaman dari layar kecil.</h3><p>Foto jelas, informasi rapi, dan tombol pesan yang mudah dijangkau dari HP.</p></div></article>
        <article className="feature-card reveal" data-reveal><MessageCircle size={28} strokeWidth={1.4} aria-hidden="true" /><div><h3>Dari tertarik, jadi percakapan.</h3><p>Satu ketukan membuka WhatsApp dengan pesan yang sudah Anda siapkan.</p></div></article>
        <article className="feature-card reveal" data-reveal><ChartNoAxesColumnIncreasing size={28} strokeWidth={1.4} aria-hidden="true" /><div><h3>Lihat yang berkembang.</h3><p>Pantau jumlah kunjungan dan kelola semua halaman produk dari satu dashboard.</p></div></article>
      </div>
    </div>
  </section>;
}
