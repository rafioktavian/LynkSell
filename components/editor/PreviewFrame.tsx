'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Copy, ExternalLink, Monitor, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { LandingPageRenderer, type LandingPageData } from '../landing/LandingPageRenderer';

const FRAME_DOCUMENT = '<!doctype html><html lang="id"><head><meta name="viewport" content="width=device-width, initial-scale=1"><title>Pratinjau halaman produk</title></head><body style="margin:0"><div id="preview-root"></div></body></html>';

export function PreviewFrame({ page }: { page: LandingPageData & { status?: string } }) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('mobile');
  const [origin, setOrigin] = useState('');
  const [mount, setMount] = useState<HTMLElement | null>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState({ width: 390, height: 600 });
  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
        setBounds({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => { setOrigin(window.location.origin); }, []);

  useEffect(() => {
    if (!mount) return;
    const doc = mount.ownerDocument;
    const syncStyles = () => {
      doc.head.querySelectorAll('[data-preview-style]').forEach(node => node.remove());
      document.head.querySelectorAll('style, link[rel="stylesheet"]').forEach(node => {
        const copy = node.cloneNode(true) as HTMLElement;
        copy.dataset.previewStyle = '';
        doc.head.appendChild(copy);
      });
      doc.documentElement.className = document.documentElement.className;
    };
    syncStyles();
    // srcDoc inherits the editor URL as its base. Keep fragment navigation in
    // this document so an anchor never loads the editor inside the frame.
    const handleAnchor = (event: MouseEvent) => {
      const anchor = (event.target as Element)?.closest?.('a[href^="#"]');
      const href = anchor?.getAttribute('href');
      if (!href) return;
      const target = doc.getElementById(href.slice(1));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: doc.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
      if (href === '#product-content') target.focus({ preventScroll: true });
    };
    doc.addEventListener('click', handleAnchor);
    const observer = new MutationObserver(syncStyles);
    observer.observe(document.head, { childList: true, subtree: true, characterData: true });
    return () => { observer.disconnect(); doc.removeEventListener('click', handleAnchor); };
  }, [mount]);

  const publishedUrl = page.status === 'published' && page.pageSlug && page.brandSlug
    ? `${origin}/${page.brandSlug}/${page.pageSlug}` : null;
  const scale = device === 'desktop' ? Math.min(1, bounds.width / 1120) : 1;
  const width = device === 'desktop' ? 1120 : Math.min(390, bounds.width);
  return (
    <div className="flex h-full min-h-0 flex-col bg-[#eaeaec]">
      <div className="z-10 flex min-h-16 flex-wrap items-center justify-between gap-2 border-b bg-white/90 px-3 py-2 sm:px-5">
        <div className="flex rounded-full bg-surface-soft p-1" role="group" aria-label="Ukuran pratinjau">
          {([{ id: 'mobile', Icon: Smartphone, label: 'HP' }, { id: 'desktop', Icon: Monitor, label: 'Desktop' }] as const).map(({ id, Icon, label }) => (
            <button key={id} type="button" aria-pressed={device === id} onClick={() => setDevice(id)} className={`flex min-h-11 items-center gap-2 rounded-full px-3 text-xs font-medium ${device === id ? 'bg-white text-ink shadow-sm' : 'text-ink-muted'}`}><Icon size={16} aria-hidden="true" /><span>{label}</span></button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          {publishedUrl ? <>
            <Button variant="ghost" size="icon" aria-label="Salin link halaman" onClick={async () => { try { await navigator.clipboard.writeText(publishedUrl); toast.success('Link disalin!'); } catch { toast.error('Link belum dapat disalin.'); } }}><Copy size={16} /></Button>
            <Button size="sm" asChild className="rounded-full"><a href={publishedUrl} target="_blank" rel="noopener noreferrer"><ExternalLink size={15} className="mr-2" />Buka</a></Button>
          </> : <span className="rounded-full border px-3 py-1 text-xs text-ink-muted">Pratinjau draft</span>}
        </div>
      </div>
      <div ref={viewport} className="flex min-h-0 flex-1 items-start justify-center overflow-hidden p-3 sm:p-6">
        <div className="relative shrink-0" style={{ width: width * scale, height: bounds.height }}>
          <div className={`absolute left-0 top-0 overflow-hidden border bg-white shadow-soft ${device === 'mobile' ? 'rounded-[32px] border-[6px] border-[#29292d]' : 'rounded-2xl border-neutral-300'}`} style={{ width, height: bounds.height / scale, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
            <iframe ref={frame} title={`Pratinjau ${device === 'mobile' ? 'HP' : 'desktop'}`} srcDoc={FRAME_DOCUMENT} className="absolute inset-0 h-full w-full border-0" onLoad={() => setMount(frame.current?.contentDocument?.getElementById('preview-root') || null)} />
            {mount && createPortal(<LandingPageRenderer page={page} />, mount)}
          </div>
        </div>
      </div>
    </div>
  );
}
