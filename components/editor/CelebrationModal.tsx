"use client";

import { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";
import * as QRCode from "qrcode";
import { Copy, Share2, ExternalLink, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "motion/react";

interface CelebrationModalProps {
  pageUrl: string;
  brandSlug: string;
  pageSlug: string;
  onClose: () => void;
}

export function CelebrationModal({ pageUrl, brandSlug, pageSlug, onClose }: CelebrationModalProps) {
  const router = useRouter();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Fallback if window is undefined during SSR
  const host = typeof window !== "undefined" ? window.location.host : "";
  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${pageUrl}` : pageUrl;
  const displayUrl = `${host}/${brandSlug}/${pageSlug}`;

  useEffect(() => {
    // Fire confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#2563EB", "#3B82F6", "#60A5FA"],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#2563EB", "#3B82F6", "#60A5FA"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
    
    // Fallback single burst
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
    });

    // Generate QR Code
    QRCode.toDataURL(fullUrl, { width: 300, margin: 2, color: { dark: '#0F172A', light: '#FFFFFF' } })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error("Error generating QR", err));
  }, [fullUrl]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      toast.success("✓ Link Tersalin!");
    } catch (err) {
      toast.error("Gagal menyalin link.");
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`Cek produkku di ${fullUrl}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleInstaBioCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      toast.success("✓ Link Tersalin! Silakan paste di Bio IG Anda.");
    } catch (err) {
      toast.error("Gagal menyalin link.");
    }
  };

  const handleViewPage = () => {
    window.open(pageUrl, "_blank");
  };

  const handleBackToDashboard = () => {
    router.push("/dashboard");
    onClose();
  };

  const handleCreateNew = () => {
    router.push("/dashboard/new");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
      >
        <div className="p-8 text-center space-y-6">
          <div className="mx-auto bg-blue-100 w-16 h-16 flex items-center justify-center rounded-full mb-4">
            <span className="text-3xl">🎉</span>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Halaman Kamu Sudah Live!</h2>
            <p className="text-slate-500 mt-2">Selamat! Landing page produk Anda sekarang sudah bisa diakses oleh pembeli.</p>
          </div>

          {/* URL Box */}
          <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between border border-slate-200">
            <div className="truncate flex-1 text-left mr-4">
              <p className="text-sm font-medium text-slate-900 truncate">{displayUrl}</p>
            </div>
            <Button variant="secondary" size="sm" onClick={handleCopyLink} className="shrink-0 font-medium">
              <Copy className="w-4 h-4 mr-2" /> Copy Link
            </Button>
          </div>

          {/* QR Code */}
          {qrCodeUrl && (
            <div className="flex justify-center my-6">
              <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32" />
              </div>
            </div>
          )}

          {/* Share Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button variant="outline" className="w-full text-green-600 bg-green-50 hover:bg-green-100 ring-1 ring-green-200/50 border-0" onClick={handleWhatsAppShare}>
              <Share2 className="w-4 h-4 mr-2" /> WA
            </Button>
            <Button variant="outline" className="w-full text-pink-600 bg-pink-50 hover:bg-pink-100 ring-1 ring-pink-200/50 border-0" onClick={handleInstaBioCopy}>
              <Share2 className="w-4 h-4 mr-2" /> Bio IG
            </Button>
            <Button variant="outline" className="w-full text-blue-600 bg-blue-50 hover:bg-blue-100 ring-1 ring-blue-200/50 border-0" onClick={handleCopyLink}>
              <Copy className="w-4 h-4 mr-2" /> Copy
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-slate-100 p-4 bg-slate-50 flex flex-col sm:flex-row gap-3">
          <Button onClick={handleViewPage} className="w-full" size="lg">
            Lihat Halaman <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
        
        <div className="px-4 pb-4 bg-slate-50 flex gap-3">
            <Button variant="outline" onClick={handleBackToDashboard} className="flex-1">
                Dashboard
            </Button>
            <Button variant="outline" onClick={handleCreateNew} className="flex-1">
                <Plus className="w-4 h-4 mr-2" /> Baru
            </Button>
        </div>
      </motion.div>
    </div>
  );
}
