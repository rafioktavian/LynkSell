import { FileText, Eye, CheckCircle2, FileEdit } from "lucide-react";

interface Page {
  id: string;
  status: "draft" | "published";
  viewCount?: number;
}

export function StatsBar({ pages }: { pages: Page[] }) {
  const total = pages.length;
  const published = pages.filter((p) => p.status === "published").length;
  const draft = pages.filter((p) => p.status === "draft").length;
  const views = pages.reduce((acc, p) => acc + (p.viewCount || 0), 0);

  const stats = [
    { label: 'Total halaman', value: total, Icon: FileText },
    { label: 'Sudah terbit', value: published, Icon: CheckCircle2 },
    { label: 'Masih draft', value: draft, Icon: FileEdit },
    { label: 'Kunjungan', value: views, Icon: Eye },
  ];
  return <section aria-label="Ringkasan performa" className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
    {stats.map(({ label, value, Icon }) => <div key={label} className="rounded-3xl border bg-white p-5 sm:p-6"><div className="mb-6 flex items-center justify-between gap-2 text-ink-muted"><p className="text-xs font-medium">{label}</p><Icon size={17} strokeWidth={1.5} aria-hidden="true" /></div><p className="text-3xl font-semibold tracking-[-.04em] tabular-nums">{value.toLocaleString('id-ID')}</p></div>)}
  </section>;
}
