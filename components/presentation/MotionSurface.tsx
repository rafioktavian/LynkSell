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
    const updateNav = () => { element.dataset.scrolled = String(view.scrollY > 12); };
    updateNav();
    view.addEventListener('scroll', updateNav, { passive: true });
    let hero: HTMLElement | null = null;
    let closing: HTMLElement | null = null;
    let ctaObserver: IntersectionObserver | undefined;
    const refreshCta = () => {
      const nextHero = element.querySelector<HTMLElement>('#ringkasan');
      const nextClosing = element.querySelector<HTMLElement>('.product-closing, .editorial-closing');
      if (hero === nextHero && closing === nextClosing) return;
      hero = nextHero;
      closing = nextClosing;
      ctaObserver?.disconnect();
      if (!hero || !('IntersectionObserver' in view)) {
        element.dataset.mobileCta = 'false';
        return;
      }
      const visibility = new Map<HTMLElement, boolean>();
      [hero, closing].forEach(item => {
        if (!item) return;
        const rect = item.getBoundingClientRect();
        visibility.set(item, rect.bottom > 0 && rect.top < view.innerHeight);
      });
      const syncCta = () => {
        element.dataset.mobileCta = String(Boolean(hero && !visibility.get(hero) && !(closing && visibility.get(closing))));
      };
      syncCta();
      ctaObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => visibility.set(entry.target as HTMLElement, entry.isIntersecting));
        syncCta();
      }, { threshold: 0.01 });
      ctaObserver.observe(hero);
      if (closing) ctaObserver.observe(closing);
    };
    refreshCta();
    // Scroll timelines are progressively enhanced for browsers that lack them.
    const parallaxSelector = '.editorial-hero-bg, .editorial-hero-product, .editorial-intro-image .editorial-cover, .editorial-benefit-photo .editorial-cover, .editorial-pains-photo, .editorial-closing > .editorial-cover';
    const needsParallaxFallback = !view.CSS?.supports?.('animation-timeline', 'view()');
    let parallaxFrame = 0;
    const animatedPhotos = new Set<HTMLElement>();
    const clearParallax = () => {
      if (parallaxFrame) view.cancelAnimationFrame(parallaxFrame);
      parallaxFrame = 0;
      animatedPhotos.forEach(photo => { photo.style.transform = ''; });
      animatedPhotos.clear();
    };
    const scheduleParallax = () => {
      if (!needsParallaxFallback || media.matches || parallaxFrame) return;
      parallaxFrame = view.requestAnimationFrame(() => {
        parallaxFrame = 0;
        const positions = Array.from(element.querySelectorAll<HTMLElement>(parallaxSelector)).map(photo => {
          const rect = (photo.parentElement || photo).getBoundingClientRect();
          const progress = Math.max(0, Math.min(1, (view.innerHeight - rect.top) / (view.innerHeight + rect.height)));
          const isProduct = photo.classList.contains('editorial-hero-product');
          const offset = (progress * 2 - 1) * (isProduct ? 1.5 : 2.5);
          return { photo, transform: `translateY(${offset}%)${isProduct ? '' : ' scale(1.1)'}` };
        });
        positions.forEach(({ photo, transform }) => { photo.style.transform = transform; animatedPhotos.add(photo); });
      });
    };
    const updateParallaxPreference = () => { if (media.matches) clearParallax(); else scheduleParallax(); };
    if (needsParallaxFallback) {
      view.addEventListener('scroll', scheduleParallax, { passive: true });
      view.addEventListener('resize', scheduleParallax, { passive: true });
      media.addEventListener('change', updateParallaxPreference);
      scheduleParallax();
    }
    // The live editor can insert or remove sections without remounting the surface.
    const changes = new MutationObserver(() => { setup(); refreshCta(); scheduleParallax(); });
    changes.observe(element, { childList: true, subtree: true });
    return () => {
      observer?.disconnect(); ctaObserver?.disconnect(); changes.disconnect();
      media.removeEventListener('change', setup); view.removeEventListener('scroll', updateNav);
      view.removeEventListener('scroll', scheduleParallax); view.removeEventListener('resize', scheduleParallax);
      media.removeEventListener('change', updateParallaxPreference); clearParallax();
    };
  }, []);
  return <div ref={root} className={className} style={style} {...props}>{children}</div>;
}
