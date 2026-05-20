"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";
import { setupBrandAction } from "@/app/actions/user.actions";
import { useRouter } from "next/navigation";

function generateClientSlug(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .substring(0, 60);
}

export function BrandSetupModal({ isOpen }: { isOpen: boolean }) {
  const [brandName, setBrandName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const slugPreview = generateClientSlug(brandName);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName || brandName.trim().length < 2) {
      setError("Nama brand minimal 2 karakter");
      return;
    }

    setIsLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("brandName", brandName.trim());

    try {
      const res = await setupBrandAction(formData);
      if (!res.success) {
        setError(res.error || "Gagal menyimpan nama toko");
      } else {
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Buat Toko Kamu 🚀</DialogTitle>
          <DialogDescription>
            Masukkan nama toko atau brand kamu untuk membuat link jualan permanen.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="brandName">Nama Brand/Toko</Label>
            <Input
              id="brandName"
              placeholder="Contoh: Cantik Store, Dapur Mama"
              value={brandName}
              onChange={(e) => {
                setBrandName(e.target.value);
                if (error) setError("");
              }}
              disabled={isLoading}
              autoFocus
            />
            {brandName && (
              <div className="text-sm bg-gray-50 p-2 rounded text-gray-600 border border-gray-100 flex items-center gap-1.5">
                <span className="text-xs font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded">URL Preview</span>
                <span className="px-1 text-gray-400 text-xs">{typeof window !== 'undefined' ? window.location.host : ''}/</span><span className="font-semibold text-gray-900">{slugPreview || "..."}</span>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || !brandName}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan Nama Toko
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
