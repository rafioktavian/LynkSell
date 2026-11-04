"use client";

import Link from "next/link";
import { LogOut, Copy, CheckCircle2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Logo } from "@/components/ui/logo";

export function DashboardHeader({ user, backLink }: { user: any, backLink?: string }) {
  const [copied, setCopied] = useState(false);
  const [host, setHost] = useState("");
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setHost(window.location.host);
    setOrigin(window.location.origin);
  }, []);

  const brandUrl = origin ? `${origin}/${user?.brandSlug}` : `/${user?.brandSlug}`;

  const copyUrl = () => {
    if (!user?.brandSlug) return;
    navigator.clipboard.writeText(brandUrl);
    setCopied(true);
    toast.success("URL Toko disalin!");
    setTimeout(() => setCopied(false), 2000);
  };

  return <header className="glass-nav sticky top-0 z-40 w-full shrink-0">
    <div className="mx-auto flex min-h-[76px] max-w-[1440px] items-center justify-between gap-3 px-5 sm:px-8">
      <div className="flex min-w-0 items-center gap-5">
        {backLink ? <Link href={backLink} className="inline-flex min-h-11 items-center gap-1.5 rounded-full pr-2 text-sm font-medium"><ChevronLeft size={18} aria-hidden="true" />Kembali</Link> : <Link href="/dashboard" aria-label="LynkSell dashboard" className="inline-flex min-h-11 items-center gap-2 text-lg font-semibold tracking-tight"><Logo className="h-8 w-8 text-brand" aria-hidden="true" /><span className="hidden sm:inline">LynkSell</span></Link>}
        {user?.brandSlug && <button type="button" onClick={copyUrl} className="hidden min-h-11 max-w-[260px] items-center gap-2 rounded-full border bg-white/60 px-4 text-xs text-ink-muted md:flex" aria-label={`Salin link toko ${user.brandName || user.brandSlug}`}><span className="truncate">{user.brandName || user.brandSlug}</span>{copied ? <CheckCircle2 size={14} className="shrink-0 text-[#14664b]" /> : <Copy size={14} className="shrink-0" />}</button>}
      </div>
      <div className="flex items-center gap-3 sm:gap-5"><span className="hidden text-xs text-ink-muted sm:inline">{user?.name || 'Seller'}</span><span className="flex h-9 w-9 items-center justify-center rounded-full border bg-[#eae7f4] text-sm font-semibold text-brand" aria-hidden="true">{(user?.name?.[0] || 'S').toUpperCase()}</span><Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: '/login' })} className="rounded-full px-3 text-ink-muted" aria-label="Keluar akun"><LogOut size={16} /><span className="ml-2 hidden sm:inline">Keluar</span></Button></div>
    </div>
    <Toaster position="top-center" closeButton />
  </header>;
}
