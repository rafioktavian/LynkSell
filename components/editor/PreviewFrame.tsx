"use client";

import { useState, useMemo, useEffect } from "react";
import { Copy, ExternalLink, Monitor, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { LandingPageRenderer } from "../landing/LandingPageRenderer";

function generateHTML(page: any) {
  const div = document.createElement("div");
  const root = createRoot(div);
  flushSync(() => {
    root.render(<LandingPageRenderer page={page} />);
  });
  const reactHtml = div.innerHTML;
  setTimeout(() => root.unmount(), 0);

  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.productName || 'Landing Page'}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body style="margin: 0; padding: 0;">
  ${reactHtml}
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

  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const publishedUrl = page.status === 'published' && page.pageSlug 
    ? `${origin}/${page.brandSlug}/${page.pageSlug}` 
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
