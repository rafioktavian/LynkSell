'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { ProductImage } from '@/components/presentation/ProductImage';

export function PhotoGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const track = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open !== null && !element.open) element.showModal();
    else if (open === null && element.open) element.close();
  }, [open]);
  const move = (index: number) => {
    const next = (index + images.length) % images.length;
    const element = track.current;
    const card = element?.children[next] as HTMLElement | undefined;
    if (element && card) element.scrollTo({ left: card.offsetLeft - element.offsetLeft, behavior: element.ownerDocument.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    setActive(next);
  };
  return <section className="editorial-gallery" aria-label="Galeri foto">
    <div className="editorial-gallery-grid" ref={track} onScroll={event => {
      const element = event.currentTarget;
      const children = Array.from(element.children) as HTMLElement[];
      const index = children.reduce((best, child, i) => Math.abs(child.offsetLeft - element.offsetLeft - element.scrollLeft) < Math.abs(children[best].offsetLeft - element.offsetLeft - element.scrollLeft) ? i : best, 0);
      setActive(index);
    }}>
      {images.map((src, index) => <button type="button" className="editorial-gallery-item" key={`${src}-${index}`} onClick={() => setOpen(index)} aria-label={`Lihat foto ${index + 1}`}><ProductImage src={src} alt={`${name} ${index + 1}`} sizes="(max-width: 767px) 85vw, 50vw" className="editorial-cover" /></button>)}
    </div>
    <div className="editorial-controls editorial-gallery-controls"><button type="button" aria-label="Foto sebelumnya" onClick={() => move(active - 1)}><ArrowLeft size={20} /></button><div className="editorial-dots">{images.map((_, i) => <button type="button" key={i} aria-label={`Foto ${i + 1}`} aria-current={active === i ? 'true' : undefined} onClick={() => move(i)}><span /></button>)}</div><button type="button" aria-label="Foto berikutnya" onClick={() => move(active + 1)}><ArrowRight size={20} /></button></div>
    <dialog ref={dialog} className="editorial-lightbox" onClose={() => setOpen(null)} onClick={event => { if (event.target === event.currentTarget) setOpen(null); }}>
      <button type="button" className="editorial-lightbox-close" aria-label="Tutup galeri" onClick={() => setOpen(null)}><X /></button>
      {open !== null && <><div className="editorial-lightbox-image"><ProductImage src={images[open]} alt={`${name} ${open + 1}`} sizes="100vw" className="editorial-contain" /></div><div className="editorial-controls"><button type="button" aria-label="Foto sebelumnya" onClick={() => setOpen((open + images.length - 1) % images.length)}><ArrowLeft /></button><span>{open + 1} / {images.length}</span><button type="button" aria-label="Foto berikutnya" onClick={() => setOpen((open + 1) % images.length)}><ArrowRight /></button></div></>}
    </dialog>
  </section>;
}
