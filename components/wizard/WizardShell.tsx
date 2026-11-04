"use client";

import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Step1Upload } from "./Step1Upload";
import { Step2Details } from "./Step2Details";
import { Step3Generating } from "./Step3Generating";
import { FALLBACK_ANALYSIS, FALLBACK_COPY } from "@/lib/fallbacks";
import type { SocialLinks } from '@/lib/social-links';

export type WizardState = {
  step: 1 | 2 | 3;
  // Step 1 results
  imageBase64: string;
  imageMimeType: string;
  analysisResult: typeof FALLBACK_ANALYSIS;
  suggestedPageSlug: string;
  // Step 2 inputs
  whatsappNumber: string;
  harga: string;
  keunggulan: string;
  colorScheme: "elegant" | "bold" | "fresh" | "luxury";
  customPageSlug: string;
  socialLinks: SocialLinks;
  // Step 3 results
  progress: number;
  progressMsg: string;
  generatedCopy: typeof FALLBACK_COPY | null;
  generatedTestimonials: any[];
  error: string | null;
};

export function WizardShell({ brandSlug }: { brandSlug: string }) {
  const [state, setState] = useState<WizardState>({
    step: 1,
    imageBase64: "",
    imageMimeType: "",
    analysisResult: FALLBACK_ANALYSIS,
    suggestedPageSlug: "",
    whatsappNumber: "",
    harga: "",
    keunggulan: "",
    colorScheme: "elegant",
    customPageSlug: "",
    socialLinks: {},
    progress: 0,
    progressMsg: "",
    generatedCopy: null,
    generatedTestimonials: [],
    error: null,
  });

  const updateState = (updates: Partial<WizardState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  return (
    <main className="mx-auto w-full max-w-2xl">
      <Toaster position="top-center" closeButton />
      <Link href="/dashboard" className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm text-ink-muted"><ArrowLeft size={16} aria-hidden="true" />Dashboard</Link>
      <div className="mb-8">
        <div className="mb-5 h-1 overflow-hidden rounded-full bg-neutral-200" role="progressbar" aria-label="Langkah pembuatan halaman" aria-valuemin={1} aria-valuemax={3} aria-valuenow={state.step} aria-valuetext={`Langkah ${state.step} dari 3`}><div className="h-full origin-left bg-brand transition-transform duration-500 ease-soft" style={{ transform: `scaleX(${state.step / 3})` }} /></div>
        <ol className="flex justify-between gap-3" aria-label="Tahapan pembuatan">{['Foto produk', 'Detail jualan', 'Halaman Anda'].map((label, i) => <li key={label} aria-current={state.step === i + 1 ? 'step' : undefined} className={`flex items-center gap-2 text-[11px] sm:text-xs ${state.step >= i + 1 ? 'font-medium text-ink' : 'text-ink-muted'}`}><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${state.step > i + 1 ? 'bg-brand text-white' : 'border bg-white'}`}>{state.step > i + 1 ? <Check size={13} aria-hidden="true" /> : `0${i + 1}`}</span><span>{label}</span></li>)}</ol>
      </div>
      <div className="surface-card p-6 sm:p-10">
        <div key={state.step} className="step-enter">
          {state.step === 1 && <Step1Upload state={state} updateState={updateState} brandSlug={brandSlug} />}
          {state.step === 2 && <Step2Details state={state} updateState={updateState} brandSlug={brandSlug} />}
          {state.step === 3 && <Step3Generating state={state} updateState={updateState} />}
        </div>
      </div>
    </main>
  );
}
