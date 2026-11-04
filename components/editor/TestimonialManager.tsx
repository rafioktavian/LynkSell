"use client";

import { cleanCopy } from "@/lib/presentation";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  addManualTestimonialAction,
  deleteTestimonialAction,
  updateTestimonialAction,
  reorderTestimonialsAction,
  replaceAITestimonialsAction
} from "@/app/actions/testimonial.actions";
import { toast } from "sonner";
import { Trash2, Plus, Star, Edit2, ChevronUp, ChevronDown, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function formatNameForAvatar(name: string) {
  return encodeURIComponent(name || "User");
}

export function TestimonialManager({ page, onUpdateLocal }: { page: any, onUpdateLocal: (data: any) => void }) {
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", location: "", rating: 5, text: "" });

  const testimonials = page.testimonials || [];
  const manualCount = testimonials.filter((t: any) => t.source === 'manual').length;
  const aiCount = testimonials.filter((t: any) => t.source === 'ai').length;

  const handleAddOrEdit = () => {
    if (!formData.name || !formData.text) return toast.error("Nama dan isi testimoni wajib diisi");

    startTransition(async () => {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("location", formData.location);
      form.append("rating", formData.rating.toString());
      form.append("text", formData.text);

      if (editingId) {
        const req = await updateTestimonialAction(page.id, editingId, form);
        if (req.success) {
            toast.success("Testimoni diperbarui");
            const updated = testimonials.map((t: any) => t.id === editingId ? { ...t, name: formData.name, location: formData.location, rating: formData.rating, text: formData.text } : t);
            onUpdateLocal({ testimonials: updated });
            closeModal();
        } else {
            toast.error("Gagal perbarui testimoni");
        }
      } else {
        const res = await addManualTestimonialAction(page.id, form);
        if (res.success) {
          toast.success("Testimoni ditambahkan");
          const current = page.testimonials || [];
          onUpdateLocal({ testimonials: [res.data, ...current] });
          closeModal();
        } else {
          toast.error(res.error);
        }
      }
    });
  };

  const handleRemove = (id: string) => {
    if(!confirm("Yakin ingin menghapus testimoni ini?")) return;

    startTransition(async () => {
      const res = await deleteTestimonialAction(page.id, id);
      if (res.success) {
        toast.success("Testimoni dihapus");
        const updated = (page.testimonials || []).filter((t: any) => t.id !== id);
        onUpdateLocal({ testimonials: updated });
      } else {
        toast.error(res.error);
      }
    });
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (index === 0 && direction === 'up') return;
    if (index === testimonials.length - 1 && direction === 'down') return;

    const newArr = [...testimonials];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newArr[index], newArr[targetIndex]] = [newArr[targetIndex], newArr[index]];

    startTransition(async () => {
        onUpdateLocal({ testimonials: newArr });
        const res = await reorderTestimonialsAction(page.id, newArr.map(t => t.id));
        if (!res.success) {
            toast.error("Gagal memindahkan testimoni");
            onUpdateLocal({ testimonials });
        }
    });
  };

  const handleGenerateAI = async () => {
    if (!page.productName) return toast.error("Isi Nama Produk terlebih dahulu");

    toast.info("AI sedang menyusun ulang testimoni...");
    startTransition(async () => {
      try {
        const res = await fetch('/api/ai/testimonials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productName: page.productName,
            kategori: page.copyData?.headline || "General",
            targetPembeli: page.targetPembeli || "",
            harga: page.harga || "",
            keunggulan: page.copyData?.benefits?.map((b: any) => b.title + ": " + b.desc).join(" | ") || ""
          })
        });

        if (!res.ok) throw new Error("Gagal memanggil AI");
        const { success, data, error } = await res.json();

        if (success && data?.testimonials) {
           const dbRes = await replaceAITestimonialsAction(page.id, data.testimonials);
           if (dbRes.success) {
             const updated = [
               ...testimonials.filter((t:any) => t.source === 'manual'),
               ...data.testimonials
             ];
             onUpdateLocal({ testimonials: updated });
             toast.success("Testimoni AI berhasil diperbarui");
           } else {
             toast.error("Gagal menyimpan testimoni AI");
           }
        } else {
           toast.error(error || "Generate AI gagal");
        }
      } catch (err: any) {
        toast.error(err.message || "Terjadi kesalahan koneksi");
      }
    });
  };

  const openAddModal = () => {
      setEditingId(null);
      setFormData({ name: "", location: "", rating: 5, text: "" });
      setModalOpen(true);
  };

  const openEditModal = (t: any) => {
      setEditingId(t.id);
      setFormData({ name: t.name, location: t.location || "", rating: t.rating || 5, text: t.text });
      setModalOpen(true);
  };

  const closeModal = () => {
      setModalOpen(false);
      setEditingId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-ink-muted">
          {testimonials.length} testimoni ({manualCount} manual, {aiCount} AI)
        </p>
      </div>

      <div className="space-y-3">
        {testimonials.map((t: any, idx: number) => {
          const isAI = t.source === "ai";
          const avatarUrl = t.avatarUrl || `https://ui-avatars.com/api/?name=${formatNameForAvatar(t.name)}&background=random`;

          return (
            <div key={t.id} className="border rounded-2xl p-4 relative bg-white flex gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-surface-soft text-sm font-medium" aria-hidden="true">{(t.name || "P").slice(0, 1).toUpperCase()}</span>

              <div className="flex-1 min-w-0 pb-12">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-sm text-neutral-900 truncate">{cleanCopy(t.name)}</p>
                </div>

                <div className="flex text-amber-700 mb-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? 'fill-current' : 'text-neutral-300'}`} />
                  ))}
                </div>

                <p className="text-xs text-ink-muted mb-1 truncate">{t.location}</p>
                <p className="text-sm text-neutral-700 line-clamp-2 leading-snug">&quot;{cleanCopy(t.text)}&quot;</p>
              </div>

              {/* Action Buttons */}
              <div className="absolute bottom-2 right-3 flex gap-1 items-center">
                <div className="flex bg-white border rounded-full overflow-hidden">
                  <button type="button" disabled={isPending} onClick={() => handleMove(idx, 'up')} aria-label="Pindahkan ulasan ke atas" className="flex h-11 w-11 items-center justify-center hover:bg-neutral-100 disabled:opacity-30 border-r">
                      <ChevronUp className="w-4 h-4 text-neutral-600" />
                  </button>
                  <button type="button" disabled={isPending} onClick={() => handleMove(idx, 'down')} aria-label="Pindahkan ulasan ke bawah" className="flex h-11 w-11 items-center justify-center hover:bg-neutral-100 disabled:opacity-30">
                      <ChevronDown className="w-4 h-4 text-neutral-600" />
                  </button>
                </div>
                <div className="flex gap-1">
                   <button type="button" disabled={isPending} onClick={() => openEditModal(t)} aria-label="Edit ulasan" className="flex h-11 w-11 items-center justify-center hover:bg-blue-50 text-brand rounded-full">
                      <Edit2 className="w-3.5 h-3.5" />
                   </button>
                   <button type="button" disabled={isPending} onClick={() => handleRemove(t.id)} aria-label="Hapus ulasan" className="flex h-11 w-11 items-center justify-center hover:bg-red-50 text-red-700 rounded-full">
                      <Trash2 className="w-3.5 h-3.5" />
                   </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-2 pt-2">
        <Button type="button" variant="outline" className="flex-1 border-dashed bg-white border-neutral-300 hover:border-neutral-400" onClick={openAddModal}>
          <Plus className="w-4 h-4 mr-2" /> Tambah Manual
        </Button>
        <Button type="button" variant="outline" className="flex-1 bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 hover:text-purple-800" onClick={handleGenerateAI} disabled={isPending}>
          <Sparkles className="w-4 h-4 mr-2" /> Generate Ulang AI
        </Button>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit testimoni" : "Tambah testimoni"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 border-b">
            <div className="space-y-2">
              <label htmlFor="testimonial-name" className="text-sm font-medium">Nama Pelanggan <span className="text-red-500">*</span></label>
              <Input id="testimonial-name" placeholder="Budi Santoso" value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <label htmlFor="testimonial-location" className="text-sm font-medium">Kota/Asal Daerah</label>
              <Input id="testimonial-location" placeholder="Jakarta Selatan" value={formData.location} onChange={e => setFormData(f => ({ ...f, location: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Penilaian (Bintang)</label>
              <div className="flex items-center bg-surface-soft border p-1 rounded-2xl w-max max-w-full">
                {[1, 2, 3, 4, 5].map(r => (
                    <button type="button" key={r} onClick={() => setFormData(f => ({ ...f, rating: r }))} aria-label={`${r} bintang`} aria-pressed={r === formData.rating} className={r <= formData.rating ? 'flex h-11 w-11 items-center justify-center text-amber-700' : 'flex h-11 w-11 items-center justify-center text-ink-muted'}>
                        <Star className="w-6 h-6 fill-current hover:scale-110 transition-transform" />
                    </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <label htmlFor="testimonial-text" className="text-sm font-medium">Ulasan Pembeli <span className="text-red-500">*</span></label>
                <span className="text-xs text-ink-muted">{formData.text.length}/300</span>
              </div>
              <Textarea id="testimonial-text" placeholder="Barangnya bagus banget, sesuai deskripsi!" maxLength={300} value={formData.text} onChange={e => setFormData(f => ({ ...f, text: e.target.value }))} rows={4} />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="ghost" onClick={closeModal} disabled={isPending}>Batal</Button>
            <Button type="button" onClick={handleAddOrEdit} disabled={isPending || !formData.name || !formData.text} className="bg-black text-white px-8">Simpan Testimoni</Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
