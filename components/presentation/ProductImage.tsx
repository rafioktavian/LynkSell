'use client';

import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { canOptimizeImage } from '@/lib/presentation';

export function ProductImage({ src, alt, priority = false, className, sizes = '100vw', decorative = false }: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
  decorative?: boolean;
}) {
  const [failed, setFailed] = useState<string | null>(null);
  if (failed === src) return <div role={decorative ? undefined : 'img'} aria-label={decorative ? undefined : alt} aria-hidden={decorative || undefined} className="absolute inset-0 flex items-center justify-center"><ImageIcon size={40} strokeWidth={1} className="opacity-30" /></div>;
  return <Image src={src} alt={decorative ? '' : alt} fill priority={priority} sizes={sizes} className={className} unoptimized={!canOptimizeImage(src)} onError={() => setFailed(src)} />;
}
