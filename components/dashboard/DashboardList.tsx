"use client";

import Link from "next/link";
import { Settings, FileText, Trash2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deletePageAction } from "@/app/actions/page.actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function DashboardList({ pages }: { pages: any[] }) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await deletePageAction(deleteId);
      if (res.success) {
        toast.success("Halaman berhasil dihapus");
        setDeleteId(null);
        router.refresh();
      } else {
        toast.error(res.error || "Gagal menghapus halaman");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setIsDeleting(false);
    }
  };

  const [host, setHost] = useState("");
  useEffect(() => {
    setHost(window.location.host);
  }, []);

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

  const pageToDelete = pages.find(p => p.id === deleteId);

  return (
    <>
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
                    {page.status === 'published' ? `${host}/${page.fullSlug}` : "Draft belum dipublikasikan"}
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
                
                <div 
                  className="p-2 text-slate-400 hover:text-red-600 bg-white border border-transparent shadow-sm group-hover:border-slate-200 rounded-lg shrink-0 ml-2"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDeleteId(page.id);
                  }}
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </div>
                <div 
                  className="p-2 text-slate-400 hover:text-indigo-600 bg-white border border-transparent shadow-sm group-hover:border-slate-200 rounded-lg shrink-0 ml-1"
                  title="Edit"
                >
                  <Settings className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hapus Halaman?</DialogTitle>
            <DialogDescription>
              Halaman &quot;{pageToDelete?.productName || 'Tanpa Judul'}&quot; akan dihapus permanen. Aksi ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 flex-col-reverse sm:flex-row mt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setDeleteId(null)}
              disabled={isDeleting}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="w-full sm:w-auto"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ya, Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

