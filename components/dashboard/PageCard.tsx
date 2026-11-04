"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProductImage } from "@/components/presentation/ProductImage";
import { Copy, Eye, Pencil, Trash2, ExternalLink, Loader2, CheckCircle2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deletePageAction } from "@/app/actions/page.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function PageCard({ page }: { page: any }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const timestamp = typeof page.publishedAt === 'number' ? page.publishedAt : page.publishedAt?.seconds ? page.publishedAt.seconds * 1000 : null;
  const publishedDate = timestamp && Number.isFinite(timestamp)
    ? new Date(timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', timeZone: 'Asia/Jakarta' }) : '';

  const [origin, setOrigin] = useState("");
  const [host, setHost] = useState("");
  
  useEffect(() => {
    setOrigin(window.location.origin);
    setHost(window.location.host);
  }, []);

  const publicUrl = origin ? `${origin}/${page.fullSlug}` : `/${page.fullSlug}`;

  const copyUrl = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast.success("URL disalin!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deletePageAction(page.id);
      if (res.success) {
        toast.success("Halaman berhasil dihapus");
        setShowDeleteModal(false);
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

  return (
    <>
      <article className="surface-card group flex h-full flex-col overflow-hidden">
        <Link href={`/dashboard/${page.id}/edit`} className="relative block aspect-[4/3] overflow-hidden border-b bg-surface-soft">
          <span className="sr-only">Edit {page.productName || 'halaman tanpa judul'}. </span>
          {page.productImageUrl ? <ProductImage src={page.productImageUrl} alt={page.productName || 'Foto produk'} sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 380px" className="object-cover transition-transform duration-700 ease-soft group-hover:scale-105" /> : <div className="flex h-full flex-col items-center justify-center gap-3 text-ink-muted"><ImageIcon size={36} strokeWidth={1} aria-hidden="true" /><span className="text-xs">Ruang untuk foto produk Anda</span></div>}
          <span className={`absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium backdrop-blur ${page.status === 'published' ? 'border-white/80 bg-white/95 text-[#14664b]' : 'border-white/80 bg-white/95 text-ink-muted'}`}><span className={`h-1.5 w-1.5 rounded-full ${page.status === 'published' ? 'bg-[#14664b]' : 'bg-neutral-400'}`} />{page.status === 'published' ? 'Terbit' : 'Draft'}</span>
        </Link>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="mb-3 flex items-center justify-between gap-3 text-xs text-ink-muted"><span>{publishedDate ? `Terbit ${publishedDate}` : 'Halaman produk'}</span><span className="inline-flex items-center gap-1.5 tabular-nums"><Eye size={14} aria-hidden="true" />{(page.viewCount || 0).toLocaleString('id-ID')}<span className="sr-only">kunjungan</span></span></div>
          <h3 className="mb-4 line-clamp-2 text-xl font-semibold leading-snug tracking-tight"><Link className="inline-flex min-h-11 items-center" href={`/dashboard/${page.id}/edit`}>{page.productName || 'Halaman tanpa judul'}</Link></h3>
          {page.status === 'published' && <button type="button" className="mb-5 flex min-h-11 w-full items-center gap-2 rounded-xl border bg-surface-soft px-3 text-left text-xs text-ink-muted" onClick={copyUrl} aria-label={`Salin link halaman ${host}/${page.fullSlug}`}><span className="min-w-0 flex-1 truncate">{host}/{page.fullSlug}</span>{copied ? <CheckCircle2 size={15} className="shrink-0 text-[#14664b]" /> : <Copy size={15} className="shrink-0" />}</button>}
          <div className="mt-auto flex items-center justify-between gap-2 border-t pt-4">
            <Button variant="ghost" size="sm" asChild className="rounded-full"><Link href={`/dashboard/${page.id}/edit`}><Pencil size={15} className="mr-2" />Edit halaman</Link></Button>
            <div className="flex items-center gap-1">{page.status === 'published' && <Button variant="ghost" size="icon" asChild className="rounded-full"><a href={`/${page.fullSlug}`} target="_blank" rel="noopener noreferrer" aria-label="Buka halaman produk"><ExternalLink size={17} /></a></Button>}
              <Button variant="ghost" size="icon" className="rounded-full text-ink-muted hover:bg-red-50 hover:text-red-700" onClick={() => setShowDeleteModal(true)} aria-label={`Hapus ${page.productName || 'halaman'}`}><Trash2 size={17} /></Button>
            </div>
          </div>
        </div>
      </article>

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hapus Halaman?</DialogTitle>
            <DialogDescription>
              Halaman &quot;{page.productName}&quot; akan dihapus permanen. Aksi ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 flex-col-reverse sm:flex-row mt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setShowDeleteModal(false)}
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
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin [animation-duration:600ms]" />}
              Ya, Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
