"use client";

import { useState, useMemo, useEffect } from "react";
import { Copy, ExternalLink, Monitor, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function generateHTML(page: any) {
  const c = page.copyData || {};
  const t = page.testimonials || [];
  
  const allColors = {
    elegant: { bg: 'bg-white', primary: 'bg-slate-900', textPrimary: 'text-slate-900', secondary: 'bg-slate-100', textSecondary: 'text-slate-600', button: 'bg-slate-900', buttonHover: 'hover:bg-slate-800' },
    bold: { bg: 'bg-white', primary: 'bg-indigo-600', textPrimary: 'text-indigo-900', secondary: 'bg-indigo-50', textSecondary: 'text-indigo-600', button: 'bg-indigo-600', buttonHover: 'hover:bg-indigo-700' },
    fresh: { bg: 'bg-white', primary: 'bg-emerald-600', textPrimary: 'text-emerald-900', secondary: 'bg-emerald-50', textSecondary: 'text-emerald-700', button: 'bg-emerald-600', buttonHover: 'hover:bg-emerald-700' },
    luxury: { bg: 'bg-neutral-50', primary: 'bg-amber-600', textPrimary: 'text-amber-900', secondary: 'bg-black', textSecondary: 'text-amber-700', button: 'bg-black', buttonHover: 'hover:bg-neutral-800' },
  };
  
  const colors = allColors[page.colorScheme as keyof typeof allColors] || allColors['elegant'];

  const waLink = page.whatsappNumber 
    ? `https://wa.me/${page.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(c.whatsapp_message || 'Halo!')}`
    : '#';

  const formatPrice = (price: string) => price ? price : '';

  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.productName || 'Landing Page'}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'DM Sans', sans-serif; }
    h1, h2, h3, h4 { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="antialiased ${colors.bg} text-neutral-800 selection:bg-black selection:text-white">
  
  <!-- Hero Section -->
  <section class="w-full flex-col md:flex-row flex items-center md:items-start justify-center gap-8 py-10 px-4 md:px-8 max-w-5xl mx-auto">
    <div class="w-full md:w-1/2 flex justify-center order-1 md:order-2">
      <img src="${page.productImageUrl || 'https://placehold.co/600x600?text=Produk'}" alt="${page.productName}" class="w-full max-w-sm aspect-square object-cover rounded-2xl shadow-xl shadow-black/5" />
    </div>
    <div class="w-full md:w-1/2 order-2 md:order-1 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
      <div class="space-y-4">
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight ${colors.textPrimary} leading-tight">${c.headline || 'Headline Utama'}</h1>
        <p class="text-lg md:text-xl text-neutral-600 leading-relaxed">${c.subheadline || 'Subheadline'}</p>
      </div>
      
      <div class="space-y-2 w-full pt-2">
        ${page.harga ? `<p class="text-3xl font-bold ${colors.textPrimary}">${formatPrice(page.harga)}</p>` : ''}
        ${c.urgency_text ? `<p class="text-sm font-medium text-red-600 bg-red-50 inline-block px-3 py-1 rounded-full">${c.urgency_text}</p>` : ''}
      </div>

      <a href="${waLink}" target="_blank" class="w-full md:w-auto inline-flex justify-center items-center px-8 py-4 text-base font-semibold text-white transition-all ${colors.button} ${colors.buttonHover} rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1">
        ${c.cta_button || 'Pesan Sekarang'}
      </a>
    </div>
  </section>

  <!-- Pain Points -->
  ${(c.pain_points && c.pain_points.length > 0) ? `
  <section class="${colors.secondary} py-16 px-4">
    <div class="max-w-3xl mx-auto space-y-8">
      <h2 class="text-center text-2xl font-bold ${colors.textSecondary}">Sering mengalami ini?</h2>
      <div class="space-y-4">
        ${c.pain_points.map((p:string) => p ? `
          <div class="flex items-start gap-4 bg-white/60 backdrop-blur p-4 rounded-xl shadow-sm">
            <span class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 text-lg">❌</span>
            <p class="text-neutral-700 font-medium pt-1">${p}</p>
          </div>
        ` : '').join('')}
      </div>
    </div>
  </section>
  ` : ''}

  <!-- Solution & Benefits -->
  <section class="py-16 px-4 max-w-5xl mx-auto space-y-12">
    ${c.solution_intro ? `
      <div class="text-center max-w-2xl mx-auto space-y-4">
        <h2 class="text-3xl font-bold ${colors.textPrimary}">${c.solution_intro}</h2>
        <div class="w-16 h-1 bg-black mx-auto rounded-full opacity-10"></div>
      </div>
    ` : ''}

    ${(c.benefits && c.benefits.length > 0) ? `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      ${c.benefits.map((b:any) => (b.title || b.desc) ? `
        <div class="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
          <div class="text-4xl mb-4">${b.icon || '✨'}</div>
          <h3 class="text-lg font-bold text-neutral-900 mb-2">${b.title}</h3>
          <p class="text-neutral-600 text-sm leading-relaxed">${b.desc}</p>
        </div>
      ` : '').join('')}
    </div>
    ` : ''}
  </section>

  <!-- Testimonials -->
  ${(t && t.length > 0) ? `
  <section class="bg-neutral-50 py-16 px-4 border-y border-neutral-200">
    <div class="max-w-5xl mx-auto space-y-10">
      <h2 class="text-center text-3xl font-bold ${colors.textPrimary}">Kata Mereka</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${t.map((testi:any) => `
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
            <div class="flex text-amber-400 mb-4">
               ${Array.from({length: testi.rating || 5}).map(() => `<svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`).join('')}
            </div>
            <p class="text-neutral-700 italic mb-6 leading-relaxed">"${testi.text}"</p>
            <div class="flex items-center gap-3">
              <img src="${testi.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(testi.name || 'User')}&background=random`}" class="w-10 h-10 rounded-full object-cover bg-neutral-100"/>
              <div>
                <p class="font-bold text-neutral-900 text-sm">${testi.name}</p>
                <p class="text-xs text-neutral-500">${testi.location}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  ` : ''}

  <!-- Bottom CTA -->
  <section class="py-16 px-4 bg-white">
    <div class="max-w-2xl mx-auto text-center space-y-6">
      <h2 class="text-3xl font-bold ${colors.textPrimary}">Tunggu Apa Lagi?</h2>
      <a href="${waLink}" target="_blank" class="w-full sm:w-auto inline-flex justify-center items-center px-10 py-5 text-lg font-bold text-white transition-all ${colors.button} ${colors.buttonHover} rounded-2xl shadow-xl hover:-translate-y-1">
        ${c.cta_button || 'Pesan Sekarang'}
      </a>
    </div>
  </section>

  <footer class="py-8 text-center text-neutral-400 text-sm border-t">
    Dibuat dengan LynkSell
  </footer>

</body>
</html>
  `;
}

export function PreviewFrame({ page }: { page: any }) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [srcDoc, setSrcDoc] = useState("");

  // Debounced html generation so we don't block main thread while user types
  useEffect(() => {
    const handler = setTimeout(() => {
      setSrcDoc(generateHTML(page));
    }, 500);
    return () => clearTimeout(handler);
  }, [page]);

  const publishedUrl = page.status === 'published' && page.pageSlug 
    ? `https://lynksell.id/${page.brandSlug}/${page.pageSlug}` 
    : null;

  return (
    <div className="flex flex-col h-full bg-neutral-200/50">
      
      {/* Top Bar */}
      <div className="flex-shrink-0 h-14 bg-white border-b px-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center bg-neutral-100 p-1 rounded-lg">
           <button 
             onClick={() => setDevice("mobile")}
             className={`p-1.5 rounded-md flex items-center transition-colors ${device === "mobile" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500 hover:text-neutral-700"}`}
           >
             <Smartphone className="w-4 h-4" />
           </button>
           <button 
             onClick={() => setDevice("desktop")}
             className={`p-1.5 rounded-md flex items-center transition-colors ${device === "desktop" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500 hover:text-neutral-700"}`}
           >
             <Monitor className="w-4 h-4" />
           </button>
        </div>

        <div className="flex items-center gap-2">
           {publishedUrl ? (
              <>
                 <Button variant="ghost" size="sm" className="hidden sm:flex text-neutral-500 hover:text-neutral-800 font-normal" onClick={() => {
                     navigator.clipboard.writeText(publishedUrl);
                     toast.success("Link disalin!");
                 }}>
                     <Copy className="w-4 h-4 mr-2" /> Salin Link
                 </Button>
                 <Button size="sm" className="bg-black hover:bg-neutral-800 text-white" onClick={() => window.open(publishedUrl, "_blank")}>
                     <ExternalLink className="w-4 h-4 mr-2" /> Buka
                 </Button>
              </>
           ) : (
             <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100">Draft Mode</span>
           )}
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 overflow-auto p-4 md:p-8 flex items-start justify-center transition-all min-h-0">
        <div 
           className={`bg-white shadow-xl rounded-b-xl rounded-t-sm border border-neutral-200 overflow-hidden transition-all duration-300 ease-in-out h-full ${
             device === 'mobile' ? 'w-[390px]' : 'w-full max-w-[800px]'
           }`}
        >
          {srcDoc ? (
            <iframe 
              srcDoc={srcDoc} 
              className="w-full h-full border-none bg-white"
              title="Preview Landing Page"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-neutral-400">
              <span className="animate-pulse">Menyiapkan Preview...</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
