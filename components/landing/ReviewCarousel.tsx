'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { cleanCopy } from '@/lib/presentation';

type Review = { id?: string; name?: string; location?: string; rating?: number; text?: string; source?: string };
export function ReviewCarousel({ reviews }: { reviews: Review[] }) {
  const [active, setActive] = useState(0);
  const review = reviews[active] || reviews[0];
  const rating = typeof review.rating === 'number' && Number.isFinite(review.rating) ? Math.max(0, Math.min(5, Math.round(review.rating))) : null;
  return <div className="editorial-review-inner">
    <figure key={review.id || active}>
      {rating !== null && <div className="editorial-stars" role="img" aria-label={`${rating} dari 5 bintang`}>{Array.from({ length: 5 }, (_, i) => <Star key={i} size={18} fill={i < rating ? 'currentColor' : 'none'} aria-hidden="true" />)}</div>}
      {review.source === 'ai' && <span className="editorial-sample">Ulasan contoh</span>}
      <blockquote>{cleanCopy(review.text)}</blockquote>
      {(review.name || review.location) && <figcaption>{[cleanCopy(review.name), cleanCopy(review.location)].filter(Boolean).join(' · ')}</figcaption>}
    </figure>
    {reviews.length > 1 && <div className="editorial-controls"><button type="button" aria-label="Ulasan sebelumnya" onClick={() => setActive((active + reviews.length - 1) % reviews.length)}><ArrowLeft size={20} /></button><div className="editorial-dots">{reviews.map((item, i) => <button key={item.id || i} type="button" aria-label={`Ulasan ${i + 1}`} aria-current={i === active ? 'true' : undefined} onClick={() => setActive(i)}><span /></button>)}</div><button type="button" aria-label="Ulasan berikutnya" onClick={() => setActive((active + 1) % reviews.length)}><ArrowRight size={20} /></button></div>}
  </div>;
}
