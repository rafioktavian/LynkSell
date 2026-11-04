"use client";

import { Sparkles, CircleAlert } from "lucide-react";
import { cleanCopy } from "@/lib/presentation";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPageAction } from "@/app/actions/page.actions";
import { WizardState } from "./WizardShell";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function Step3Generating({
  state,
  updateState
}: {
  state: WizardState;
  updateState: (s: Partial<WizardState>) => void;
}) {
  const router = useRouter();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    async function runGeneration() {
      try {
        const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

        updateState({ progress: 10, progressMsg: "🖼️ Menyiapkan foto produk...", error: null });

        // Step 1 already compressed and kept the image in wizard state. Use
        // that image directly so creating a page does not depend on a Storage
        // bucket being provisioned for this Firebase project.
        const productImageUrl = isDemo
          ? "https://lh3.googleusercontent.com/a/default-avatar=s96-c"
          : state.imageBase64;

        if (!isDemo && !productImageUrl) throw new Error("Foto produk tidak ditemukan. Kembali ke langkah 1 dan pilih foto lagi.");
        await new Promise(r => setTimeout(r, 300));

        updateState({ progress: 30, progressMsg: "✍️ AI sedang menulis headline..." });

        let copyResult;
        if (isDemo) {
          await new Promise(r => setTimeout(r, 2000));
          copyResult = {
            headline: "Produk Keren " + state.analysisResult.productName,
            subheadline: "Diskon terbatas hanya hari ini.",
            pain_points: ["Pusing mencari barang murah?", "Ingin kualitas premium?"],
            solution_intro: "Ini solusinya!",
            benefits: [{ icon: "star", title: "Terbaik", desc: "Kualitas bintang 5" }],
            urgency_text: "Beli sekarang!",
            cta_button: "Pesan via WA",
            whatsapp_message: "Halo saya mau order"
          };
        } else {
          // Step B: Generate copy
          const generateRes = await fetch("/api/ai/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nama_produk: state.analysisResult.productName,
              kategori: state.analysisResult.category,
              target_pembeli: state.analysisResult.targetPembeli,
              keunggulan: state.keunggulan,
              harga: state.harga
            })
          });
          const copyData = await generateRes.json();
          copyResult = copyData?.data || copyData?.copyData; // handle variations
        }

        updateState({ progress: 60, progressMsg: "⭐ Membuat testimoni starter..." });

        let testimonials;
        if (isDemo) {
          await new Promise(r => setTimeout(r, 2000));
          testimonials = [
            { id: "1", name: "Budi", location: "Jakarta", rating: 5, text: "Bagus banget!", source: "ai", createdAt: Date.now(), avatarUrl: null }
          ];
        } else {
          // Step C: Generate Testimonials
          const testiRes = await fetch("/api/ai/testimonials", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productName: state.analysisResult.productName,
              kategori: state.analysisResult.category,
              targetPembeli: state.analysisResult.targetPembeli,
              harga: state.harga,
              keunggulan: state.keunggulan
            })
          });
          const testiData = await testiRes.json();
          testimonials = testiData?.data || [];
        }

        updateState({ progress: 85, progressMsg: "💾 Menyimpan ke cloud..." });

        // Step D: Save To Firestore
        let resultData;
        if (isDemo) {
           await new Promise(r => setTimeout(r, 2000));
           resultData = { pageId: "demo-1", pageSlug: "demo-page", fullSlug: "demo/demo-page" };
        } else {
          const finalPayload = {
            productName: state.analysisResult.productName,
            productImageUrl,
            copyData: copyResult,
            testimonials,
            colorScheme: state.colorScheme,
            whatsappNumber: state.whatsappNumber,
            harga: state.harga,
            targetPembeli: state.analysisResult.targetPembeli,
            pageSlug: state.customPageSlug || state.suggestedPageSlug
          };

          const result = await createPageAction(finalPayload);
          if (!result.success) throw new Error(result.error || "Gagal menyimpan halaman.");
          resultData = result.data;
        }

        updateState({ progress: 100, progressMsg: "✅ Halaman berhasil dibuat!" });

        // Redirect
        setTimeout(() => {
          router.push(`/dashboard/${resultData?.pageId}/edit`);
        }, 1500);

      } catch (err: any) {
        console.error(err);
        updateState({ error: err.message || "Terjadi kesalahan. Silakan coba lagi." });
        toast.error("Gagal men-generate halaman.");
      }
    }

    runGeneration();
  }, [state, updateState, router]);

  return (
    <div className="py-12 text-center space-y-8">
      <div className="max-w-md mx-auto space-y-4">
        <p className="eyebrow text-ink-muted">Langkah 03</p><h1 className="text-3xl sm:text-4xl font-semibold tracking-[-.04em]">Cerita Anda<br />sedang dirangkai.</h1>
        {state.error ? (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl">
              <CircleAlert size={28} aria-hidden="true" />
            </div>
            <h2 className="text-xl font-semibold text-ink">Proses terhenti</h2>
            <p role="alert" className="text-red-700 text-sm">{state.error}</p>
            <Button
               variant="outline"
               className="mt-4"
               onClick={() => {
                 hasRun.current = false;
                 updateState({ error: null, progress: 0 });
               }}
            >
              Coba Lagi
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
             <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border bg-[#eeecf6] text-brand"><Sparkles size={28} strokeWidth={1.5} aria-hidden="true" /></div>
             <p role="status" aria-live="polite" className="text-base font-medium text-ink">{cleanCopy(state.progressMsg)}</p>

             <div className="relative">
               <div role="progressbar" aria-label="Pembuatan halaman" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(state.progress)} className="h-1 overflow-hidden rounded-full bg-neutral-200"><div className="h-full origin-left bg-brand transition-transform duration-500 ease-soft" style={{ transform: `scaleX(${state.progress / 100})` }} /></div>
               <div className="absolute top-4 right-0 text-xs font-medium text-ink-muted">
                 {Math.round(state.progress)}%
               </div>
             </div>

             <p className="text-sm text-ink-muted">
               Jangan tutup halaman ini. Otomatis dialihkan saat selesai.
             </p>

             {/* Little animated skeleton area to make it look active */}
             <div className="mt-8 space-y-3 opacity-50">
               <div className="h-4 bg-neutral-200 rounded-md w-3/4 mx-auto animate-pulse [animation-duration:700ms]"></div>
               <div className="h-4 bg-neutral-200 rounded-md w-1/2 mx-auto animate-pulse [animation-duration:700ms]"></div>
               <div className="h-4 bg-neutral-200 rounded-md w-5/6 mx-auto animate-pulse [animation-duration:700ms]"></div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
