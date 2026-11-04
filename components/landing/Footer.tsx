import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
export default function Footer() {
  return <footer className="border-t bg-white py-10 text-xs text-ink-muted">
    <div className="page-width">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
        <div><Link href="/" className="mb-3 inline-flex min-h-11 items-center gap-2 text-lg font-semibold tracking-tight text-ink"><Logo className="h-7 w-7 text-brand" aria-hidden="true" />LynkSell</Link><p>Ruang untuk produk. Peluang untuk usaha.</p></div>
        <nav className="flex flex-wrap gap-x-7 gap-y-1" aria-label="Navigasi footer">{[['/templates', 'Inspirasi'], ['/terms', 'Syarat & ketentuan'], ['/privacy', 'Privasi'], ['/contact', 'Kontak']].map(([href, label]) => <Link key={href} href={href} className="inline-flex min-h-11 items-center hover:text-ink">{label}</Link>)}</nav>
      </div>
      <p className="mt-8 border-t pt-6">LynkSell. Dibuat untuk UMKM Indonesia.</p>
    </div>
  </footer>;
}
