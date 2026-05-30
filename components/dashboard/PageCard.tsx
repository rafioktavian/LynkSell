"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Copy, Eye, Pencil, Trash2, ExternalLink, Loader2, CheckCircle2 } from "lucide-react";
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

  const publishedDate = page.publishedAt
    ? new Date(page.publishedAt.seconds * 1000).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "-";

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
      <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all flex flex-col h-full">
        <div className="p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center flex-grow">
          {/* Thumbnail */}
          <div className="w-full sm:w-24 h-40 sm:h-24 bg-gray-100 rounded-lg flex-shrink-0 relative overflow-hidden border border-gray-200">
            {page.productImageUrl ? (
              <Image
                src={page.productImageUrl}
                alt={page.productName || "Preview"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                <span className="text-xs uppercase font-medium">Btw Foto</span>
              </div>
            )}
            
            {/* Mobile View Count Overlay */}
            <div className="absolute bottom-2 right-2 sm:hidden bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-white flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span className="text-xs font-bold">{page.viewCount || 0}</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-grow min-w-0 flex flex-col h-full justify-between w-full">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    page.status === "published"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {page.status}
                </span>
                {page.status === "published" && (
                  <span className="text-xs text-gray-400 font-medium">Diubah {publishedDate}</span>
                )}
              </div>
              <h3 className="font-bold text-lg text-gray-900 truncate">
                {page.productName || "Draft Tanpa Judul"}
              </h3>
            </div>

            {page.status === "published" && (
              <div className="mt-3 flex items-center bg-gray-50 border border-gray-200 rounded-md py-1.5 px-3 max-w-max self-start cursor-pointer hover:bg-gray-100 transition-colors" onClick={copyUrl}>
                <span className="text-xs font-medium text-gray-600 truncate mr-2">
                  {host}/{page.fullSlug}
                </span>
                {copied ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                )}
              </div>
            )}
          </div>

          {/* Desktop Views Count */}
          <div className="hidden sm:flex flex-col items-center justify-center px-4 shrink-0 border-l border-gray-100 h-16">
            <p className="text-xl font-bold text-gray-900">{page.viewCount || 0}</p>
            <p className="text-[10px] uppercase font-semibold text-gray-500 flex items-center gap-1 mt-0.5">
              <Eye className="w-3 h-3" /> Views
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex items-center justify-between sm:justify-end gap-2">
          {page.status === "published" && (
            <Button variant="outline" size="sm" asChild className="bg-white hover:bg-gray-50">
              <a href={`/${page.fullSlug}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Lihat
              </a>
            </Button>
          )}

          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild className="bg-white hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200">
              <Link href={`/dashboard/${page.id}/edit`}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Link>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                setShowDeleteModal(true);
              }}
              className="bg-white text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              <span className="sr-only">Hapus</span>
            </Button>
          </div>
        </div>
      </div>

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
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ya, Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
