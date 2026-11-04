"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, ArrowRight, Sparkles } from "lucide-react";
import { cleanCopy } from "@/lib/presentation";
import { compressImage } from "@/lib/image-compress";
import { toast } from "sonner";
import Image from "next/image";
import { WizardState } from "./WizardShell";

export function Step1Upload({
  state,
  updateState,
  brandSlug
}: {
  state: WizardState;
  updateState: (s: Partial<WizardState>) => void;
  brandSlug: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [analysisError, setAnalysisError] = useState(false);
  const [host, setHost] = useState("");

  useEffect(() => {
    setHost(window.location.host);
  }, []);

  const processFile = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }

    try {
      setLoading(true);
      setAnalysisError(false);
      setProgressMsg("Membaca file...");

      // Compress
      const compressedBase64 = await compressImage(file, {
        onProgress: setProgressMsg,
      });

      setProgressMsg("Menganalisis dengan AI...");

      let analysisResult = state.analysisResult;

      const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

      try {
        if (isDemo) {
          await new Promise(r => setTimeout(r, 1000));
          analysisResult = {
            productName: "Sneakers Keren Sepatu Olahraga",
            category: "Sepatu/Fashion",
            targetPembeli: "Pria dan Wanita, Usia 18-35 Tahun",
            keunggulan_visual: ["Trendy", "Nyaman", "Ringan"],
            tone_warna: "Putih",
            page_slug_suggestion: "sneakers-keren",
            keunggulan: ["Bahan ringan", "Nyaman"],
            harga: ""
          } as any;
        } else {
          const analyzeRes = await fetch("/api/ai/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ base64Image: compressedBase64 })
          });
          const analyzeData = await analyzeRes.json();

          if (analyzeData?.success && analyzeData?.data) {
             analysisResult = analyzeData.data;
          } else {
             setAnalysisError(true);
          }
        }
      } catch (err) {
        console.error("Analysis Error", err);
        setAnalysisError(true);
      }

      // Generate suggested slug
      const nameForSlug = analysisResult.productName || "produk-baru";
      const generatedSlug = nameForSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      updateState({
        imageBase64: compressedBase64,
        imageMimeType: file.type,
        analysisResult: analysisResult,
        suggestedPageSlug: generatedSlug,
        customPageSlug: generatedSlug,
        keunggulan: analysisResult.keunggulan?.join('\n') || "",
        harga: analysisResult.harga || "",
      });

      toast.success("Foto berhasil diproses!");
    } catch (error: any) {
      toast.error("Gagal: " + error.message);
    } finally {
      setLoading(false);
      setProgressMsg("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="eyebrow mb-4 text-ink-muted">Langkah 01</p><h1 className="text-3xl sm:text-4xl font-semibold tracking-[-.04em]">Mulai dengan satu foto.</h1>
        <p className="text-ink-muted mt-2">Pilih foto yang jelas. Kita bantu merapikan cerita produknya.</p>
      </div>

      <div
        className={`relative flex min-h-[320px] flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed p-6 ${dragging ? 'border-brand bg-[#eeecf6]' : 'border-neutral-300 bg-surface-soft'}`}
        aria-busy={loading}
        onDragOver={event => { event.preventDefault(); if (!loading) setDragging(true); }}
        onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setDragging(false); }}
        onDrop={event => { event.preventDefault(); setDragging(false); if (!loading) void processFile(event.dataTransfer.files?.[0]); }}
      >
        {state.imageBase64 ? (
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 mb-4">
              <Image src={state.imageBase64} alt="Pratinjau foto produk yang diunggah" fill sizes="192px" className="object-contain rounded-2xl" unoptimized />
            </div>
            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>Ganti Foto</Button>
          </div>
        ) : (
          <button type="button" disabled={loading} onClick={() => fileInputRef.current?.click()} className="flex min-h-[250px] w-full flex-col items-center justify-center rounded-2xl px-2 text-center">
            <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border bg-white text-brand"><Upload size={25} strokeWidth={1.5} aria-hidden="true" /></span>
            <span className="font-medium text-ink">Pilih atau tarik foto ke sini</span>
            <span className="mt-2 text-xs leading-relaxed text-ink-muted">JPG atau PNG. Foto persegi tampil paling pas.</span>
          </button>
        )}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          aria-label="Pilih foto produk"
          onChange={event => void processFile(event.target.files?.[0])}
          disabled={loading}
        />
        {loading && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-10">
            <div className="w-10 h-10 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin [animation-duration:600ms] mb-4" />
            <p className="font-medium text-ink" role="status" aria-live="polite">{cleanCopy(progressMsg)}</p>
          </div>
        )}
      </div>

      {state.imageBase64 && (
        <div className="bg-surface-soft p-5 rounded-2xl border space-y-4">
           <div className="flex items-center justify-between mb-2">
             <h2 className="font-semibold flex items-center gap-2"><Sparkles size={17} aria-hidden="true" /> Informasi produk Anda</h2>
             {analysisError && <span className="text-xs text-orange-800 bg-orange-100 px-2 py-1 rounded">Lengkapi informasi produk</span>}
           </div>

           <div className="space-y-4">
             <div className="space-y-1.5">
               <Label htmlFor="analysis_productName">Nama Produk</Label>
               <Input
                 id="analysis_productName"
                 value={state.analysisResult.productName}
                 onChange={(e) => updateState({ analysisResult: { ...state.analysisResult, productName: e.target.value }})}
               />
             </div>

             <div className="space-y-1.5">
               <Label htmlFor="analysis_category">Kategori Produk</Label>
               <Input
                 id="analysis_category"
                 value={state.analysisResult.category}
                 onChange={(e) => updateState({ analysisResult: { ...state.analysisResult, category: e.target.value }})}
               />
             </div>

             <div className="space-y-1.5">
               <Label htmlFor="analysis_targetPembeli">Target Pembeli</Label>
               <Input
                 id="analysis_targetPembeli"
                 value={state.analysisResult.targetPembeli}
                 onChange={(e) => updateState({ analysisResult: { ...state.analysisResult, targetPembeli: e.target.value }})}
               />
             </div>

             <div className="text-sm text-neutral-600 bg-white p-3 rounded border border-neutral-200 break-all">
                URL Anda nantinya: <span className="font-medium text-black">{host}/{brandSlug}/{state.suggestedPageSlug}</span>
             </div>
           </div>
        </div>
      )}

      <div className="pt-4 flex justify-end">
        <Button
          size="lg"
          onClick={() => updateState({ step: 2 })}
          disabled={!state.imageBase64 || loading}
          className="w-full sm:w-auto"
        >
          Lanjut Detail <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
