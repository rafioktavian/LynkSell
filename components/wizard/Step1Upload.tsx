"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, ImageIcon, ArrowRight } from "lucide-react";
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
  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [analysisError, setAnalysisError] = useState(false);
  const [host, setHost] = useState("");

  useEffect(() => {
    setHost(window.location.host);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }

    try {
      setLoading(true);
      setAnalysisError(false);
      setProgressMsg("📸 Membaca file...");

      // Compress
      const compressedBase64 = await compressImage(file, {
        onProgress: setProgressMsg,
      });

      setProgressMsg("🤖 Menganalisis dengan AI...");
      
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
        imageFile: file,
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
        <h2 className="text-2xl font-bold tracking-tight">Upload Foto Produk</h2>
        <p className="text-neutral-500 mt-2">Foto yang bagus dapat meningkatkan konversi penjualan.</p>
      </div>

      <div 
        className={`border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden ${state.imageBase64 ? "border-neutral-200 bg-neutral-50/50" : "border-neutral-300 hover:bg-neutral-50"}`}
        onClick={() => !loading && fileInputRef.current?.click()}
      >
        {state.imageBase64 ? (
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 mb-4">
              <Image src={state.imageBase64} alt="Preview" fill className="object-contain rounded-lg" unoptimized />
            </div>
            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>Ganti Foto</Button>
          </div>
        ) : (
          <>
            <ImageIcon className="w-12 h-12 text-neutral-400 mb-4" />
            <p className="font-medium text-neutral-600">Klik atau drag untuk upload</p>
            <p className="text-sm text-neutral-400 mt-1">Format JPG/PNG, ukuran ideal 1:1</p>
          </>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange}
          disabled={loading}
        />
        {loading && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-10">
            <div className="w-10 h-10 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mb-4" />
            <p className="font-medium text-neutral-800">{progressMsg}</p>
          </div>
        )}
      </div>

      {state.imageBase64 && (
        <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-100 space-y-4">
           <div className="flex items-center justify-between mb-2">
             <h3 className="font-semibold flex items-center gap-2">✨ Hasil Analisis AI</h3>
             {analysisError && <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">Menggunakan data fallback</span>}
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
