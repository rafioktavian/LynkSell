"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { WizardState } from "./WizardShell";
import { ArrowLeft, Sparkles } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function Step2Details({ 
  state, 
  updateState,
  brandSlug
}: { 
  state: WizardState; 
  updateState: (s: Partial<WizardState>) => void;
  brandSlug: string;
}) {

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
        <h2 className="text-2xl font-bold tracking-tight">Lengkapi Detail</h2>
        <p className="text-neutral-500 mt-2">Informasi ini akan dirangkai AI jadi halaman yang menjual.</p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="whatsappNumber">Nomor WhatsApp (Menerima Order)</Label>
          <Input 
            id="whatsappNumber" 
            placeholder="Contoh: 081234567890" 
            value={state.whatsappNumber} 
            onChange={handleWaChange}
            className="text-lg"
          />
          {state.whatsappNumber && (
            <p className="text-xs text-green-600">Terformat: +{state.whatsappNumber}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="harga">Harga Produk</Label>
          <Input 
            id="harga" 
            placeholder="Ketik angka saja, cth: 150000" 
            value={state.harga} 
            onChange={handleHargaChange}
            className="text-lg font-medium"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="keunggulan">Keunggulan Utama <span className="text-neutral-400 font-normal">(AI mengisinya untuk Anda)</span></Label>
          <Textarea 
            id="keunggulan" 
            rows={4} 
            value={state.keunggulan} 
            onChange={(e) => updateState({ keunggulan: e.target.value })} 
            placeholder="Contoh: Formula dermatologis, tanpa paraben, cocok kulit sensitif"
          />
        </div>
        
        <div className="space-y-3">
          <Label>Tema Warna Halaman</Label>
          <RadioGroup 
             defaultValue={state.colorScheme} 
             onValueChange={(val: any) => updateState({ colorScheme: val })}
             className="grid grid-cols-2 gap-4"
          >
            {[
              { id: "elegant", name: "Elegant", desc: "Navy & Merah" },
              { id: "bold", name: "Bold", desc: "Oranye Solid" },
              { id: "fresh", name: "Fresh", desc: "Teal cerah" },
              { id: "luxury", name: "Luxury", desc: "Ungu & Emas" },
            ].map(scheme => (
              <div key={scheme.id} className="relative">
                <RadioGroupItem value={scheme.id} id={scheme.id} className="peer sr-only" />
                <Label
                  htmlFor={scheme.id}
                  className="flex flex-col items-center justify-between rounded-md border-2 border-neutral-200 bg-white p-4 hover:bg-neutral-50 peer-data-[state=checked]:border-neutral-900 peer-data-[state=checked]:bg-neutral-50 cursor-pointer"
                >
                  <span className="font-medium">{scheme.name}</span>
                  <span className="text-xs text-neutral-500 mt-1">{scheme.desc}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="customPageSlug">Ubah URL Halaman (Opsional)</Label>
          <div className="flex items-center">
            <span className="bg-neutral-100 text-neutral-500 px-3 py-2 border border-r-0 border-neutral-300 rounded-l-md text-sm">
              lynksell.id/{brandSlug}/
            </span>
            <Input 
              id="customPageSlug"
              value={state.customPageSlug}
              onChange={(e) => {
                 const cln = e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-');
                 updateState({ customPageSlug: cln });
              }}
              className="rounded-l-none"
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
