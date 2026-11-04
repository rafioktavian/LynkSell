import Link from 'next/link';
import { ArrowRight, Layers } from 'lucide-react';
import { PageCard } from './PageCard';

export function DashboardList({ pages }: { pages: any[] }) {
  if (!pages.length) return <section className="surface-card flex min-h-[420px] flex-col items-center justify-center px-6 py-16 text-center">
    <div className="mb-7 flex h-20 w-20 items-center justify-center rounded-[28px] border bg-surface-soft text-brand"><Layers size={32} strokeWidth={1.3} aria-hidden="true" /></div>
    <p className="eyebrow mb-4 text-ink-muted">Cerita pertama Anda</p><h2 className="text-3xl font-semibold tracking-[-.04em]">Satu foto. Banyak kemungkinan.</h2><p className="body-large mx-auto mt-4 max-w-[38ch]">Halaman jualan pertama Anda dimulai di sini. Siapkan foto produk, sisanya kita buat bersama.</p><Link className="pill-button mt-7" href="/dashboard/new">Buat halaman pertama <ArrowRight size={17} aria-hidden="true" /></Link>
  </section>;
  return <section aria-labelledby="pages-heading"><div className="mb-6 flex items-end justify-between gap-4"><div><p className="eyebrow mb-2 text-ink-muted">Koleksi Anda</p><h2 id="pages-heading" className="text-2xl font-semibold tracking-tight">Halaman produk</h2></div><span className="text-xs text-ink-muted">{pages.length} halaman</span></div><div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{pages.map(page => <PageCard key={page.id} page={page} />)}</div></section>;
}
