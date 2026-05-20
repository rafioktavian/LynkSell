"use client";

import { useState, useTransition, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updatePageAction, publishPageAction } from "@/app/actions/page.actions";
import { toast } from "sonner";
import { Save, Globe, Upload, Trash2, Plus, ChevronDown, ChevronUp, Copy, PartyPopper } from "lucide-react";
import { TestimonialManager } from "./TestimonialManager";
import { compressImage } from "@/lib/image-compress";
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
  return (
    <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
      <button 
        className="w-full flex items-center justify-between p-4 font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors"
        onClick={onToggle}
      >
        {title}
        {isOpen ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
      </button>
      {isOpen && (
        <div className="p-4 border-t bg-white">
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

  useEffect(() => {
    onUpdateLocal({
      productName: debouncedFormData.productName,
      whatsappNumber: debouncedFormData.whatsappNumber,
      harga: debouncedFormData.harga,
      colorScheme: debouncedFormData.colorScheme,
      pageSlug: debouncedFormData.pageSlug,
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
  }, [debouncedFormData, debouncedPainPoints, debouncedBenefits]);

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
      if (!res.ok) throw new Error(data.error);

      // Instant UI update
      onUpdateLocal({ productImageUrl: data.url });
      
      // Background save to avoid lost image if not clicking save
      startTransition(async () => {
         await updatePageAction(page.id, { productImageUrl: data.url });
      });

      toast.success("Foto Produk berhasil diubah");
    } catch (err: any) {
      toast.error(err.message || 'Gagal upload foto');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    startTransition(async () => {
      const isSlugChanged = formData.pageSlug !== page.pageSlug;
      const updates: any = {
        productName: formData.productName,
        whatsappNumber: formData.whatsappNumber,
        harga: formData.harga,
        colorScheme: formData.colorScheme,
        pageSlug: formData.pageSlug,
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

      if (isSlugChanged) {
        updates.fullSlug = `${page.brandSlug}/${formData.pageSlug}`;
      }
      
      const res = await updatePageAction(page.id, updates);
      if (res.success) {
        toast.success("Perubahan disimpan sebagai Draft");
        if (isSlugChanged) {
            onUpdateLocal({ fullSlug: updates.fullSlug, pageSlug: formData.pageSlug });
        }
      } else {
        toast.error(res.error || "Gagal menyimpan");
      }
    });
  };

  const handlePublish = () => {
    startTransition(async () => {
      await handleSave();
      
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

  const publishedUrl = `lynksell.id/${page.brandSlug}/${page.pageSlug}`;
  const fullUrl = `https://${publishedUrl}`;

  return (
    <div className="relative pb-24 min-h-full">
      <div className="p-4 space-y-4">
        
        {/* SECTION 1 - Info Produk */}
        <AccordionSection title="1. Info Produk & Harga" isOpen={openSection === 0} onToggle={() => toggleSection(0)}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Foto Utama</Label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded overflow-hidden border">
                  <img src={page.productImageUrl} className="w-full h-full object-cover" alt="Product" />
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
              <Label>Nama Produk</Label>
              <Input name="productName" value={formData.productName} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Harga (Contoh: Rp 99.000)</Label>
              <Input name="harga" value={formData.harga} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Nomor WhatsApp Pembeli</Label>
              <Input name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} placeholder="081234..." />
              <p className="text-xs text-neutral-500">Menerima pesan pesanan ke nomor ini.</p>
            </div>
          </div>
        </AccordionSection>

        {/* SECTION 2 - URL Halaman */}
        <AccordionSection title="2. URL Halaman (Link Olshop)" isOpen={openSection === 1} onToggle={() => toggleSection(1)}>
           <div className="space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900 break-all mr-2">{publishedUrl}</span>
              <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-blue-700" onClick={() => {
                navigator.clipboard.writeText(fullUrl);
                toast.success("Link disalin!");
              }}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2 pt-2 border-t text-sm">
               <Label className="text-neutral-600">Edit Slug Akhir</Label>
               <div className="flex gap-2 items-center">
                 <span className="text-neutral-500 whitespace-nowrap">.../{page.brandSlug}/</span>
                 <Input className="h-8" name="pageSlug" value={formData.pageSlug} onChange={handleChange} />
               </div>
               {formData.pageSlug !== page.pageSlug && page.status === "published" && (
                 <p className="text-xs text-red-600 mt-2 font-medium bg-red-50 p-2 rounded">
                   ⚠️ Mengubah URL akan memutus semua link yang sudah dibagikan sebelumnya.
                 </p>
               )}
            </div>
           </div>
        </AccordionSection>

        {/* SECTION 3 - Tampilan */}
        <AccordionSection title="3. Tema Warna Tampilan" isOpen={openSection === 2} onToggle={() => toggleSection(2)}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-2">
             {[
               { id: 'elegant', text: 'Elegant', colors: ['bg-slate-900', 'bg-slate-100'] },
               { id: 'bold', text: 'Bold', colors: ['bg-orange-600', 'bg-orange-50'] },
               { id: 'fresh', text: 'Fresh', colors: ['bg-emerald-600', 'bg-emerald-50'] },
               { id: 'luxury', text: 'Luxury', colors: ['bg-violet-600', 'bg-black'] }
             ].map((theme) => {
                const isSelected = formData.colorScheme === theme.id;
                return (
                  <button
                    type="button"
                    key={theme.id}
                    onClick={(e) => {
                      e.preventDefault();
                      setFormData({...formData, colorScheme: theme.id});
                    }}
                    className={`relative flex flex-col items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? "border-blue-600 bg-blue-50/50 shadow-md transform scale-[1.02]" 
                        : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 hover:shadow-sm"
                    }`}
                  >
                     {/* Checkmark indicator for selected state */}
                     {isSelected && (
                       <div className="absolute -top-3 -right-3 bg-blue-600 text-white rounded-full p-1 shadow-sm border-2 border-white">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                       </div>
                     )}
                     
                     <div className="flex w-full h-16 rounded-lg overflow-hidden border shadow-inner">
                       <div className={`flex-[2] ${theme.colors[0]}`} />
                       <div className={`flex-[1] ${theme.colors[1]}`} />
                     </div>
                     <span className={`text-sm font-bold ${isSelected ? 'text-blue-700' : 'text-neutral-700'}`}>
                       {theme.text}
                     </span>
                  </button>
                );
             })}
          </div>
        </AccordionSection>

        {/* SECTION 4 - Copy & Teks */}
        <AccordionSection title="4. Copywriting & Teks" isOpen={openSection === 3} onToggle={() => toggleSection(3)}>
            <div className="space-y-5">
               <div className="space-y-2">
                 <div className="flex justify-between">
                    <Label>Headline</Label>
                    <span className="text-xs text-neutral-400">{formData.headline.length}/100</span>
                 </div>
                 <Textarea maxLength={100} name="headline" value={formData.headline} onChange={handleChange} rows={2} />
               </div>
               
               <div className="space-y-2">
                 <div className="flex justify-between">
                    <Label>Subheadline</Label>
                    <span className="text-xs text-neutral-400">{formData.subheadline.length}/200</span>
                 </div>
                 <Textarea maxLength={200} name="subheadline" value={formData.subheadline} onChange={handleChange} rows={2} />
               </div>

               <div className="space-y-3 pt-3 border-t">
                  <Label>Masalah Pembeli (Pain Points)</Label>
                  {painPoints.map((pt, i) => (
                    <div key={i} className="flex gap-2">
                      <Input value={pt} onChange={(e) => {
                        const newArr = [...painPoints]; newArr[i] = e.target.value; setPainPoints(newArr);
                      }} />
                      <Button type="button" variant="ghost" size="icon" className="text-red-500 h-9 w-9 flex-shrink-0" onClick={() => {
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
                  <Label>Solusi & Intro</Label>
                  <Input name="solution_intro" value={formData.solution_intro} onChange={handleChange} />
               </div>

               <div className="space-y-3">
                  <Label>Manfaat (Benefits)</Label>
                  {benefits.map((b, i) => (
                    <div key={i} className="bg-neutral-50 p-3 rounded-lg border space-y-2 relative">
                      <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 text-red-500 h-6 w-6" onClick={() => {
                        const newArr = benefits.filter((_, idx) => idx !== i); setBenefits(newArr);
                      }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <div className="flex gap-2">
                        <Input placeholder="Icon emoji" className="w-16" value={b.icon || "✨"} onChange={(e) => {
                           const newArr = [...benefits]; newArr[i].icon = e.target.value; setBenefits(newArr);
                        }} />
                        <Input placeholder="Judul Manfaat" value={b.title} onChange={(e) => {
                          const newArr = [...benefits]; newArr[i].title = e.target.value; setBenefits(newArr);
                        }} className="font-medium" />
                      </div>
                      <Textarea placeholder="Deskripsi singkat" value={b.desc} onChange={(e) => {
                        const newArr = [...benefits]; newArr[i].desc = e.target.value; setBenefits(newArr);
                      }} rows={2} className="text-sm" />
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => setBenefits([...benefits, { icon: "✅", title: "", desc: "" }])}>
                    <Plus className="w-4 h-4 mr-2" /> Tambah Manfaat
                  </Button>
               </div>

               <div className="space-y-3 pt-3 border-t">
                  <Label>Call to Action & Urgensi</Label>
                  <div className="space-y-2">
                    <Label className="text-xs text-neutral-500">Teks Urgensi</Label>
                    <Input name="urgency_text" value={formData.urgency_text} onChange={handleChange} placeholder="Sisa 5 Produk Hari Ini!" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-neutral-500">Tombol Aksi</Label>
                    <Input name="cta_button" value={formData.cta_button} onChange={handleChange} placeholder="Pesan Sekarang" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-neutral-500">Pesan Template WA</Label>
                    <Textarea name="whatsapp_message" value={formData.whatsapp_message} onChange={handleChange} rows={2} />
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
      <div className="absolute bottom-0 left-0 w-full bg-white border-t p-3 lg:p-4 flex flex-col sm:flex-row gap-2 z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <Button 
          type="button"
          onClick={handleSave} 
          disabled={isPending} 
          variant="outline" 
          className="flex-1 sm:flex-none"
        >
          <Save className="w-4 h-4 mr-2" /> Simpan Draft
        </Button>
        <Button 
          type="button"
          onClick={handlePublish} 
          disabled={isPending || (page.status === 'published' && formData.pageSlug === page.pageSlug)} 
          className="flex-1 bg-black hover:bg-neutral-800 text-white"
        >
          <Globe className="w-4 h-4 mr-2" /> 
          {page.status === 'published' ? "Update Publish" : "Publish & Dapatkan Link →"}
        </Button>
      </div>

      {/* CELEBRATION MODAL */}
      <Dialog open={showCelebration} onOpenChange={setShowCelebration}>
        <DialogContent className="sm:max-w-md text-center flex flex-col items-center">
          <DialogHeader>
            <DialogTitle className="text-center w-full">🎉 Yey! Halaman Siap Jualan</DialogTitle>
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
