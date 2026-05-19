"use client";

import { useState } from "react";
import { Step1Upload } from "./Step1Upload";
import { Step2Details } from "./Step2Details";
import { Step3Generating } from "./Step3Generating";
import { FALLBACK_ANALYSIS, FALLBACK_COPY } from "@/lib/fallbacks";

export type WizardState = {
  step: 1 | 2 | 3;
  // Step 1 results
  imageBase64: string;
  imageFile: File | null;
  imageMimeType: string;
  analysisResult: typeof FALLBACK_ANALYSIS;
  suggestedPageSlug: string;
  // Step 2 inputs
  whatsappNumber: string;
  harga: string;
  keunggulan: string;
  colorScheme: "elegant" | "bold" | "fresh" | "luxury";
  customPageSlug: string;
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
    imageFile: null,
    imageMimeType: "",
    analysisResult: FALLBACK_ANALYSIS,
    suggestedPageSlug: "",
    whatsappNumber: "",
    harga: "",
    keunggulan: "",
    colorScheme: "elegant",
    customPageSlug: "",
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
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Progress Indicator */}
      <div className="mb-8 flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 w-full h-0.5 bg-neutral-200 -z-10 -translate-y-1/2"></div>
        <div className="absolute left-0 top-1/2 h-0.5 bg-neutral-900 -z-10 -translate-y-1/2 transition-all duration-300" style={{ width: state.step === 1 ? '0%' : state.step === 2 ? '50%' : '100%' }}></div>
        
        {[1, 2, 3].map((stepNum) => (
          <div key={stepNum} className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${state.step >= stepNum ? "bg-neutral-900 border-neutral-900 text-white" : "bg-white border-neutral-300 text-neutral-500"}`}>
            {state.step > stepNum ? "✓" : stepNum}
          </div>
        ))}
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-neutral-200">
        {state.step === 1 && (
          <Step1Upload state={state} updateState={updateState} brandSlug={brandSlug} />
        )}
        {state.step === 2 && (
          <Step2Details state={state} updateState={updateState} brandSlug={brandSlug} />
        )}
        {state.step === 3 && (
          <Step3Generating state={state} updateState={updateState} />
        )}
      </div>
    </div>
  );
}