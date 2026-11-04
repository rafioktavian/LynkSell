'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

/** One observer per surface; content remains visible without JS. */
export function MotionSurface({ children, className, style, ...props }: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  'data-theme'?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    const view = element?.ownerDocument.defaultView;
    if (!element || !view) return;
    const media = view.matchMedia('(prefers-reduced-motion: reduce)');
    let observer: IntersectionObserver | undefined;
    const setup = () => {
      observer?.disconnect();
      const items = element.querySelectorAll<HTMLElement>('[data-reveal]');
      if (media.matches || !('IntersectionObserver' in view)) {
        items.forEach(item => { item.dataset.pending = 'false'; });
        return;
      }
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.pending = 'false';
            observer?.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, root: element.ownerDocument });
      items.forEach(item => {
        // Never hide a heading that was already painted above the fold.
        item.dataset.pending = String(item.getBoundingClientRect().top > view.innerHeight * 0.95);
        if (item.dataset.pending === 'true') observer!.observe(item);
      });
    };
    setup();
    media.addEventListener('change', setup);
    // The live editor may insert new benefits without remounting the surface.
    const changes = new MutationObserver(setup);
    changes.observe(element, { childList: true, subtree: true });
    return () => { observer?.disconnect(); changes.disconnect(); media.removeEventListener('change', setup); };
  }, []);
  return <div ref={root} className={className} style={style} {...props}>{children}</div>;
}
