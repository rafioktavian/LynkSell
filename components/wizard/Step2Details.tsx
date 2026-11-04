"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { WizardState } from "./WizardShell";
import { useEffect, useState } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { ThemePicker } from "@/components/presentation/ThemePicker";

export function Step2Details({
  state,
  updateState,
  brandSlug
}: {
  state: WizardState;
  updateState: (s: Partial<WizardState>) => void;
  brandSlug: string;
}) {
  const [host, setHost] = useState("");
  useEffect(() => {
    setHost(window.location.host);
  }, []);

  // Auto format WA
  const handleWaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.startsWith("0")) {
      val = "62" + val.slice(1);
    }
    updateState({ whatsappNumber: val });
  };

  // Auto format Harga
  const handleHargaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (!val) {
      updateState({ harga: "" });
      return;
    }
    const formatted = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(Number(val));
    updateState({ harga: formatted });
  };

  const isComplete = state.whatsappNumber.length >= 10 && state.harga && state.keunggulan;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="eyebrow mb-4 text-ink-muted">Langkah 02</p><h1 className="text-3xl sm:text-4xl font-semibold tracking-[-.04em]">Sedikit detail.<br />Banyak berarti.</h1>
        <p className="text-ink-muted mt-2">Informasi ini akan dirangkai AI jadi halaman yang menjual.</p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="whatsappNumber">Nomor WhatsApp (Menerima Order)</Label>
          <Input
            id="whatsappNumber" type="tel" inputMode="tel" autoComplete="tel"
            placeholder="Contoh: 081234567890"
            value={state.whatsappNumber}
            onChange={handleWaChange}
            className="text-lg"
          />
          {state.whatsappNumber && (
            <p className="text-xs text-[#14664b]">Terformat: +{state.whatsappNumber}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="harga">Harga Produk</Label>
          <Input
            id="harga" inputMode="numeric"
            placeholder="Ketik angka saja, cth: 150000"
            value={state.harga}
            onChange={handleHargaChange}
            className="text-lg font-medium"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="keunggulan">Keunggulan Utama <span className="text-ink-muted font-normal">(AI mengisinya untuk Anda)</span></Label>
          <Textarea
            id="keunggulan"
            rows={4}
            value={state.keunggulan}
            onChange={(e) => updateState({ keunggulan: e.target.value })}
            placeholder="Contoh: Formula dermatologis, tanpa paraben, cocok kulit sensitif"
          />
        </div>

        <div className="space-y-4">
          <Label className="text-base font-semibold">Tema Warna Halaman</Label>
          <ThemePicker value={state.colorScheme} allowCustom={false} onChange={theme => updateState({ colorScheme: theme as WizardState['colorScheme'] })} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customPageSlug">Ubah URL Halaman (Opsional)</Label>
          <div className="flex items-center">
            <span className="bg-surface-soft text-ink-muted max-w-[45%] truncate px-3 py-3 border border-r-0 rounded-l-xl text-xs">
              {host}/{brandSlug}/
            </span>
            <Input
              id="customPageSlug"
              value={state.customPageSlug}
              onChange={(e) => {
                 const cln = e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-');
                 updateState({ customPageSlug: cln });
              }}
              className="min-w-0 rounded-l-none"
            />
          </div>
        </div>
      </div>

      <div className="pt-6 flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          size="lg"
          onClick={() => updateState({ step: 1 })}
          className="w-full sm:w-1/3"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
        </Button>
        <Button
          size="lg"
          onClick={() => updateState({ step: 3 })}
          disabled={!isComplete}
          className="w-full sm:w-2/3"
        >
          <Sparkles className="w-4 h-4 mr-2" /> Generate Halaman Sekarang
        </Button>
      </div>
    </div>
  );
}
