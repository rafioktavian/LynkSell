"use client";

import Link from "next/link";
import { LogOut, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

export function DashboardHeader({ user }: { user: any }) {
  const [copied, setCopied] = useState(false);

  const brandUrl = typeof window !== "undefined" ? `${window.location.host}/${user?.brandSlug}` : `lynksell.id/${user?.brandSlug}`;

  const copyUrl = () => {
    if (!user?.brandSlug) return;
    navigator.clipboard.writeText(brandUrl);
    setCopied(true);
    toast.success("URL Toko disalin!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10 shrink-0 sticky top-0">
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="font-bold text-xl text-primary tracking-tight">LynkSell</span>
        </Link>
        
        {user?.brandSlug && (
          <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full py-1.5 px-3">
            <span className="text-xs font-medium text-gray-700 truncate max-w-[150px]">
              {user.brandName || "Toko Kamu"}
            </span>
            <div className="w-px h-3 bg-gray-300 mx-1" />
            <button
              onClick={copyUrl}
              className="flex items-center text-xs text-gray-500 hover:text-primary transition-colors"
              title="Salin URL Toko"
            >
              <span className="mr-1 hidden md:block">lynksell.id/{user.brandSlug}</span>
              {copied ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="font-medium text-sm text-gray-900">{user?.name || "Seller"}</p>
          </div>
          <div className="w-9 h-9 bg-primary/10 rounded-full border border-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden">
            {user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt={user.name || "User"} className="w-full h-full object-cover" />
            ) : (
              (user?.name?.[0] || "S").toUpperCase()
            )}
          </div>
        </div>
        
        <div className="w-px h-6 bg-gray-200 mx-1"></div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => signOut({ callbackUrl: "/login" })} 
          className="text-gray-500 hover:text-red-600 hover:bg-red-50 px-2 sm:px-3"
        >
          <LogOut className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:block text-xs font-medium">Keluar</span>
        </Button>
      </div>
    </header>
  );
}
