"use client";

import { useState, useTransition, useRef, useEffect, useId } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updatePageAction, publishPageAction, updatePageSlugAction } from "@/app/actions/page.actions";
import { toast } from "sonner";
import { Save, Globe, Upload, Trash2, Plus, ChevronDown, ChevronUp, Copy, PartyPopper, ImageIcon } from "lucide-react";
import { ThemePicker } from "@/components/presentation/ThemePicker";
import { ProductImage } from "@/components/presentation/ProductImage";
import { TestimonialManager } from "./TestimonialManager";
import { compressImage } from "@/lib/image-compress";
import { AdditionalPhotos } from "./AdditionalPhotos";
import { SocialLinkFields } from '@/components/presentation/SocialLinkFields';
import { socialLinksSchema, type SocialLinks } from '@/lib/social-links';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Simple Accordion Item
function AccordionSection({
  title,
  isOpen,
  onToggle,
  children
}: {
  title: string,
  isOpen: boolean,
  onToggle: () => void,
  children: React.ReactNode
}) {
  const contentId = useId();
  return (
    <div className="overflow-hidden rounded-2xl border bg-white">
      <button
        type="button" aria-expanded={isOpen} aria-controls={contentId}
        className="w-full min-h-14 flex items-center justify-between gap-3 p-5 text-left text-sm font-medium text-ink hover:bg-surface-soft"
        onClick={onToggle}
      >
        {title}
        {isOpen ? <ChevronUp className="w-5 h-5 text-ink-muted" /> : <ChevronDown className="w-5 h-5 text-ink-muted" />}
      </button>
      {isOpen && (
        <div id={contentId} className="p-5 border-t bg-white">
          {children}
        </div>
      )}
    </div>
  );
}

// Debounce hook for optimistic updates
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export function EditorPanel({ page, onUpdateLocal }: { page: any, onUpdateLocal: (data: any) => void }) {
  const [formData, setFormData] = useState({
    productName: page.productName || "",
    headline: page.copyData?.headline || "",
    subheadline: page.copyData?.subheadline || "",
    urgency_text: page.copyData?.urgency_text || "",
    cta_button: page.copyData?.cta_button || "",
    whatsapp_message: page.copyData?.whatsapp_message || "",
    solution_intro: page.copyData?.solution_intro || "",
    whatsappNumber: page.whatsappNumber || "",
    harga: page.harga || "",
    colorScheme: page.colorScheme || "elegant",
    pageSlug: page.pageSlug || "",
  });

  const [painPoints, setPainPoints] = useState<string[]>(page.copyData?.pain_points || []);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(page.socialLinks || {});
  const [benefits, setBenefits] = useState<any[]>(page.copyData?.benefits || []);
  const [openSection, setOpenSection] = useState<number>(0);

  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showCelebration, setShowCelebration] = useState(false);

  // Debounced optimistic updates
  const debouncedFormData = useDebounce(formData, 500);
  const debouncedPainPoints = useDebounce(painPoints, 500);
  const debouncedBenefits = useDebounce(benefits, 500);
  const debouncedSocialLinks = useDebounce(socialLinks, 500);

  useEffect(() => {
    onUpdateLocal({
      productName: debouncedFormData.productName,
      whatsappNumber: debouncedFormData.whatsappNumber,
      harga: debouncedFormData.harga,
      colorScheme: debouncedFormData.colorScheme,
      pageSlug: debouncedFormData.pageSlug,
      socialLinks: debouncedSocialLinks,
      copyData: {
        ...page.copyData,
        headline: debouncedFormData.headline,
        subheadline: debouncedFormData.subheadline,
        urgency_text: debouncedFormData.urgency_text,
        cta_button: debouncedFormData.cta_button,
        whatsapp_message: debouncedFormData.whatsapp_message,
        solution_intro: debouncedFormData.solution_intro,
        pain_points: debouncedPainPoints,
        benefits: debouncedBenefits,
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFormData, debouncedPainPoints, debouncedBenefits, debouncedSocialLinks]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const compressedBase64 = await compressImage(file);

      const resBase64 = await fetch(compressedBase64);
      const blob = await resBase64.blob();

      const formData = new FormData();
      formData.append('file', blob, file.name.replace(/\.[^/.]+$/, "") + ".jpg");

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.data?.url) throw new Error(data.error || 'Gagal mengunggah foto');

      // Instant UI update
      onUpdateLocal({ productImageUrl: data.data.url });
      try {
        const result = await updatePageAction(page.id, { productImageUrl: data.data.url });
        if (!result.success) throw new Error(result.error || 'Gagal menyimpan foto');
      } catch (error) {
        onUpdateLocal({ productImageUrl: page.productImageUrl });
        throw error;
      }

      toast.success("Foto Produk berhasil diubah");
    } catch (err: any) {
      toast.error(err.message || 'Gagal upload foto');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const saveUpdates = async () => {
    const parsedSocialLinks = socialLinksSchema.safeParse(socialLinks);
    if (!parsedSocialLinks.success) return { success: false, error: parsedSocialLinks.error.errors[0].message };
    const isSlugChanged = formData.pageSlug !== page.pageSlug;

    if (isSlugChanged) {
      const slugRes = await updatePageSlugAction(page.id, formData.pageSlug);
      if (!slugRes.success) {
        return { success: false, error: slugRes.error };
      }
    }

    const updates: any = {
      productName: formData.productName,
      socialLinks: parsedSocialLinks.data,
      whatsappNumber: formData.whatsappNumber,
      harga: formData.harga,
      colorScheme: formData.colorScheme,
      copyData: {
        ...page.copyData,
        headline: formData.headline,
        subheadline: formData.subheadline,
        urgency_text: formData.urgency_text,
        cta_button: formData.cta_button,
        whatsapp_message: formData.whatsapp_message,
        solution_intro: formData.solution_intro,
        pain_points: painPoints,
        benefits: benefits,
      }
    };

    const res = await updatePageAction(page.id, updates);
    if (res.success) {
      if (isSlugChanged) {
          const newFullSlug = `${page.brandSlug}/${formData.pageSlug}`;
          onUpdateLocal({ fullSlug: newFullSlug, pageSlug: formData.pageSlug });
      }
      return { success: true };
    } else {
      return { success: false, error: res.error };
    }
  };

  const handleSave = () => {
    startTransition(async () => {
      const res = await saveUpdates();
      if (res.success) {
        toast.success("Perubahan disimpan sebagai Draft");
      } else {
        toast.error(res.error || "Gagal menyimpan");
      }
    });
  };

  const handlePublish = () => {
    startTransition(async () => {
      const saveRes = await saveUpdates();
      if (!saveRes.success) {
        toast.error(saveRes.error || "Gagal menyimpan sebelum publish");
        return;
      }

      const res = await publishPageAction(page.id);
      if (res.success) {
        onUpdateLocal({ status: "published" });
        setShowCelebration(true);
      } else {
        toast.error(res.error || "Gagal mem-publish");
      }
    });
  };

  const toggleSection = (idx: number) => {
    setOpenSection(openSection === idx ? -1 : idx);
  };

  const [host, setHost] = useState("");
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setHost(window.location.host);
    setOrigin(window.location.origin);
  }, []);

  const publishedUrl = `${host}/${page.brandSlug}/${page.pageSlug}`;
  const fullUrl = `${origin}/${page.brandSlug}/${page.pageSlug}`;

  return (
    <div className="editor-panel flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto p-4 space-y-3 sm:p-5">
        <div className="px-1 pb-5 pt-2"><p className="eyebrow mb-3 text-ink-muted">Sunting halaman</p><h1 className="text-2xl font-semibold tracking-[-.04em]">Buat terasa milik Anda.</h1><p className="mt-3 text-sm leading-relaxed text-ink-muted">Lihat perubahan di pratinjau. Simpan saat siap.</p></div>

        {/* SECTION 1 - Info Produk */}
        <AccordionSection title="1. Info Produk & Harga" isOpen={openSection === 0} onToggle={() => toggleSection(0)}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Foto Utama</Label>
              <div className="flex items-center gap-4">
                <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border bg-surface-soft">
                  {page.productImageUrl ? <ProductImage src={page.productImageUrl} className="object-cover" sizes="80px" alt={page.productName || 'Foto produk'} /> : <ImageIcon size={24} className="text-ink-muted" aria-hidden="true" />}
                </div>
                <div>
                  <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                  <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                    <Upload className="w-4 h-4 mr-2" />
                    {isUploading ? "Mengunggah..." : "Ganti Foto"}
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-productName">Nama Produk</Label>
              <Input id="edit-productName" name="productName" value={formData.productName} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-harga">Harga (Contoh: Rp 99.000)</Label>
              <Input id="edit-harga" name="harga" value={formData.harga} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-whatsappNumber">Nomor WhatsApp Pembeli</Label>
              <Input id="edit-whatsappNumber" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} placeholder="081234..." />
              <p className="text-xs text-ink-muted">Menerima pesan pesanan ke nomor ini.</p>
            </div>
          </div>
        </AccordionSection>

        <AccordionSection title="Foto Tambahan" isOpen={openSection === 5} onToggle={() => toggleSection(5)}>
          <AdditionalPhotos page={page} onUpdateLocal={onUpdateLocal} />
        </AccordionSection>

        <AccordionSection title="Media Sosial (Opsional)" isOpen={openSection === 6} onToggle={() => toggleSection(6)}>
          <SocialLinkFields idPrefix="edit-social" value={socialLinks} onChange={setSocialLinks} />
        </AccordionSection>

        {/* SECTION 2 - URL Halaman */}
        <AccordionSection title="2. URL Halaman (Link Olshop)" isOpen={openSection === 1} onToggle={() => toggleSection(1)}>
           <div className="space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900 break-all mr-2">{publishedUrl}</span>
              <Button type="button" size="icon" variant="ghost" className="h-11 w-11 text-brand" aria-label="Salin link halaman" onClick={() => {
                navigator.clipboard.writeText(fullUrl);
                toast.success("Link disalin!");
              }}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2 pt-2 border-t text-sm">
               <Label htmlFor="edit-pageSlug" className="text-ink-muted">Edit Slug Akhir</Label>
               <div className="flex gap-2 items-center">
                 <span className="text-ink-muted whitespace-nowrap">.../{page.brandSlug}/</span>
                 <Input className="h-8" id="edit-pageSlug" name="pageSlug" value={formData.pageSlug} onChange={handleChange} />
               </div>
               {formData.pageSlug !== page.pageSlug && page.status === "published" && (
                 <p className="text-xs text-red-600 mt-2 font-medium bg-red-50 p-2 rounded">
                   Mengubah URL akan memutus semua link yang sudah dibagikan sebelumnya.
                 </p>
               )}
            </div>
           </div>
        </AccordionSection>

        {/* SECTION 3 - Tampilan */}
        <AccordionSection title="3. Tema Warna Tampilan" isOpen={openSection === 2} onToggle={() => toggleSection(2)}>
          <ThemePicker value={formData.colorScheme} onChange={colorScheme => setFormData({ ...formData, colorScheme })} />
        </AccordionSection>

        {/* SECTION 4 - Copy & Teks */}
        <AccordionSection title="4. Copywriting & Teks" isOpen={openSection === 3} onToggle={() => toggleSection(3)}>
            <div className="space-y-5">
               <div className="space-y-2">
                 <div className="flex justify-between">
                    <Label htmlFor="edit-headline">Headline</Label>
                    <span className="text-xs text-ink-muted">{formData.headline.length}/100</span>
                 </div>
                 <Textarea maxLength={100} id="edit-headline" name="headline" value={formData.headline} onChange={handleChange} rows={2} />
               </div>

               <div className="space-y-2">
                 <div className="flex justify-between">
                    <Label htmlFor="edit-subheadline">Subheadline</Label>
                    <span className="text-xs text-ink-muted">{formData.subheadline.length}/200</span>
                 </div>
                 <Textarea maxLength={200} id="edit-subheadline" name="subheadline" value={formData.subheadline} onChange={handleChange} rows={2} />
               </div>

               <div className="space-y-3 pt-3 border-t">
                  <Label>Masalah Pembeli (Pain Points)</Label>
                  {painPoints.map((pt, i) => (
                    <div key={i} className="flex gap-2">
                      <Input aria-label={`Masalah pembeli ${i + 1}`} value={pt} onChange={(e) => {
                        const newArr = [...painPoints]; newArr[i] = e.target.value; setPainPoints(newArr);
                      }} />
                      <Button type="button" variant="ghost" size="icon" className="text-red-600 h-11 w-11 flex-shrink-0" aria-label="Hapus masalah" onClick={() => {
                        const newArr = painPoints.filter((_, idx) => idx !== i); setPainPoints(newArr);
                      }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => setPainPoints([...painPoints, ""])}>
                    <Plus className="w-4 h-4 mr-2" /> Tambah 1 Masalah
                  </Button>
               </div>

               <div className="space-y-3 pt-3 border-t">
                  <Label htmlFor="edit-solution_intro">Solusi & Intro</Label>
                  <Input id="edit-solution_intro" name="solution_intro" value={formData.solution_intro} onChange={handleChange} />
               </div>

               <div className="space-y-3">
                  <Label>Manfaat (Benefits)</Label>
                  {benefits.map((b, i) => (
                    <div key={i} className="bg-neutral-50 p-3 rounded-lg border space-y-2 relative">
                      <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 text-red-600 h-11 w-11" aria-label="Hapus manfaat" onClick={() => {
                        const newArr = benefits.filter((_, idx) => idx !== i); setBenefits(newArr);
                      }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <div className="flex gap-2">
                        <select aria-label={`Ikon manfaat ${i + 1}`} className="h-12 min-w-0 w-28 shrink-0 rounded-xl border bg-white px-2 text-xs" value={['sparkles', 'leaf', 'shield-check', 'truck', 'heart', 'star', 'zap', 'award', 'package', 'clock', 'droplets', 'thumbs-up'].includes(b.icon) ? b.icon : 'sparkles'} onChange={e => {
                          const newArr = [...benefits]; newArr[i].icon = e.target.value; setBenefits(newArr);
                        }}>
                          {[['sparkles', 'Istimewa'], ['leaf', 'Alami'], ['shield-check', 'Terpercaya'], ['truck', 'Pengiriman'], ['heart', 'Pilihan hati'], ['star', 'Favorit'], ['zap', 'Cepat'], ['award', 'Kualitas'], ['package', 'Kemasan'], ['clock', 'Hemat waktu'], ['droplets', 'Kesegaran'], ['thumbs-up', 'Direkomendasikan']].map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                        </select>
                        <Input aria-label="Judul manfaat" placeholder="Judul Manfaat" value={b.title} onChange={(e) => {
                          const newArr = [...benefits]; newArr[i].title = e.target.value; setBenefits(newArr);
                        }} className="font-medium" />
                      </div>
                      <Textarea aria-label="Deskripsi manfaat" placeholder="Deskripsi singkat" value={b.desc} onChange={(e) => {
                        const newArr = [...benefits]; newArr[i].desc = e.target.value; setBenefits(newArr);
                      }} rows={2} className="text-sm" />
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => setBenefits([...benefits, { icon: "sparkles", title: "", desc: "" }])}>
                    <Plus className="w-4 h-4 mr-2" /> Tambah Manfaat
                  </Button>
               </div>

               <div className="space-y-3 pt-3 border-t">
                  <Label>Call to Action & Urgensi</Label>
                  <div className="space-y-2">
                    <Label htmlFor="edit-urgency_text" className="text-xs text-ink-muted">Teks Urgensi</Label>
                    <Input id="edit-urgency_text" name="urgency_text" value={formData.urgency_text} onChange={handleChange} placeholder="Sisa 5 Produk Hari Ini!" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-cta_button" className="text-xs text-ink-muted">Tombol Aksi</Label>
                    <Input id="edit-cta_button" name="cta_button" value={formData.cta_button} onChange={handleChange} placeholder="Pesan Sekarang" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-whatsapp_message" className="text-xs text-ink-muted">Pesan Template WA</Label>
                    <Textarea id="edit-whatsapp_message" name="whatsapp_message" value={formData.whatsapp_message} onChange={handleChange} rows={2} />
                  </div>
               </div>
            </div>
        </AccordionSection>

        {/* SECTION 5 - Testimoni */}
        <AccordionSection title="5. Bukti Sosial (Testimoni)" isOpen={openSection === 4} onToggle={() => toggleSection(4)}>
            <TestimonialManager page={page} onUpdateLocal={onUpdateLocal} />
        </AccordionSection>

      </div>

      {/* STICKY BOTTOM BAR */}
      <div className="shrink-0 w-full bg-white border-t p-3 lg:p-4 flex flex-col sm:flex-row gap-2 z-10 pb-[max(.75rem,env(safe-area-inset-bottom))]">
        <Button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          variant="outline"
          className="flex-1 sm:flex-none rounded-full"
        >
          <Save className="w-4 h-4 mr-2" /> Simpan Draft
        </Button>
        <Button
          type="button"
          onClick={handlePublish}
          disabled={isPending}
          className="flex-1 rounded-full"
        >
          <Globe className="w-4 h-4 mr-2" />
          {page.status === 'published' ? "Update Publish" : "Publish & Dapatkan Link →"}
        </Button>
      </div>

      {/* CELEBRATION MODAL */}
      <Dialog open={showCelebration} onOpenChange={setShowCelebration}>
        <DialogContent className="sm:max-w-xl text-center flex flex-col items-center">
          <DialogHeader>
            <DialogTitle className="text-center w-full">Yey! Halaman Siap Jualan</DialogTitle>
          </DialogHeader>
          <div className="py-6 flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <PartyPopper className="w-8 h-8" />
            </div>
            <p className="text-neutral-600">
              Landing page jualan Anda sudah online dan bisa dibagikan ke calon pembeli.
            </p>
            <div className="w-full bg-neutral-100 p-3 rounded-lg border flex items-center justify-between mt-2">
               <span className="font-medium text-sm truncate pr-2">https://{publishedUrl}</span>
               <Button type="button" size="sm" onClick={() => {
                 navigator.clipboard.writeText(fullUrl);
                 toast.success("Link berhasil disalin!");
               }}>
                 Copy
               </Button>
            </div>
            <div className="flex w-full gap-2 mt-4">
               <Button type="button" variant="outline" className="flex-1" onClick={() => setShowCelebration(false)}>Tutup</Button>
               <Button type="button" className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={() => window.open(fullUrl, "_blank")}>
                 Buka Halaman
               </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
