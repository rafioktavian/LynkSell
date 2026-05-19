import Link from "next/link";
import { Settings, FileText } from "lucide-react";

export function DashboardList({ pages }: { pages: any[] }) {
  if (pages.length === 0) {
    return (
      <div className="col-span-1 md:col-span-12 bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center justify-center shadow-sm text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Belum Ada Halaman</h3>
        <p className="text-slate-500 max-w-sm mb-6">Anda belum membuat landing page satupun. Klik tombol di atas untuk mulai membuat.</p>
      </div>
    );
  }

  return (
    <div className="col-span-1 md:col-span-12 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h3 className="font-bold text-slate-800 text-lg">Daftar Halaman</h3>
      </div>
      <div className="space-y-3 flex-grow overflow-y-auto custom-scrollbar">
        {pages.map((page) => (
          <Link key={page.id} href={`/dashboard/${page.id}/edit`}>
            <div className="group p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-4 hover:border-indigo-200 hover:bg-white hover:shadow-sm transition-all cursor-pointer">
              <div className="w-14 h-14 bg-slate-200 rounded-lg flex-shrink-0 overflow-hidden relative border border-slate-200">
                {page.productImageUrl ? (
                  <img src={page.productImageUrl} alt={page.productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <FileText className="w-6 h-6 m-auto mt-4 text-slate-400" />
                )}
              </div>
              <div className="flex-grow min-w-0">
                <h4 className="font-bold text-slate-900 truncate">{page.productName || "Tanpa Judul"}</h4>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {page.status === 'published' ? `lynksell.id/${page.fullSlug}` : "Draft belum dipublikasikan"}
                </p>
              </div>
              <div className="text-right hidden sm:block shrink-0 px-4 border-r border-slate-200">
                <p className="text-sm font-bold text-slate-900">{page.viewCount || 0}</p>
                <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Views</p>
              </div>
              <div className="shrink-0 px-2 flex items-center">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${page.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                  {page.status === 'published' ? 'Live' : 'Draft'}
                </span>
              </div>
              <div className="p-2 text-slate-400 hover:text-indigo-600 bg-white border border-transparent shadow-sm group-hover:border-slate-200 rounded-lg shrink-0 ml-2">
                <Settings className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
