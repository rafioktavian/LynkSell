import type { CSSProperties } from 'react';
import { ArrowRight, ChevronRight, Leaf, ShieldCheck, Truck, Sparkles, Heart, Star, Zap, Check, Award, Package, Clock, Droplets, ThumbsUp, type LucideIcon } from 'lucide-react';
import { MotionSurface } from '@/components/presentation/MotionSurface';
import { ProductImage } from '@/components/presentation/ProductImage';
import { cleanCopy, productTheme } from '@/lib/presentation';

interface Benefit { icon?: string; title?: string; desc?: string }
interface Testimonial { id?: string; name?: string; location?: string; rating?: number; text?: string; avatarUrl?: string | null; source?: string }
interface CopyData {
  headline?: string; subheadline?: string; pain_points?: string[]; solution_intro?: string;
  benefits?: Benefit[]; urgency_text?: string; cta_button?: string; whatsapp_message?: string;
}
export interface LandingPageData {
  id?: string; productName?: string; productImageUrl?: string; copyData?: CopyData;
  testimonials?: Testimonial[]; colorScheme?: string; whatsappNumber?: string;
  harga?: string; brandSlug?: string; pageSlug?: string; brandName?: string;
}

const ICONS: Record<string, LucideIcon> = {
  leaf: Leaf, 'shield-check': ShieldCheck, shieldcheck: ShieldCheck, shield: ShieldCheck,
  truck: Truck, sparkles: Sparkles, heart: Heart, star: Star, zap: Zap,
  check: Check, 'check-circle': Check, award: Award, package: Package, clock: Clock,
  droplets: Droplets, 'thumbs-up': ThumbsUp,
};
function BenefitIcon({ name }: { name?: string }) {
  const key = (name || '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase().replace(/[_\s]+/g, '-');
  const Icon = Object.hasOwn(ICONS, key) ? ICONS[key] : Sparkles;
  return <Icon size={28} strokeWidth={1.5} aria-hidden="true" />;
}

export function LandingPageRenderer({ page }: { page: LandingPageData }) {
  const c = page.copyData || {};
  const headline = cleanCopy(c.headline) || cleanCopy(page.productName);
  const subheadline = cleanCopy(c.subheadline);
  const brand = cleanCopy(page.brandName);
  const price = cleanCopy(page.harga);
  const solution = cleanCopy(c.solution_intro);
  const urgency = cleanCopy(c.urgency_text);
  const benefits = (c.benefits || []).filter(b => b && (cleanCopy(b.title) || cleanCopy(b.desc)));
  const pains = (c.pain_points || []).map(cleanCopy).filter(Boolean);
  const testimonials = (page.testimonials || []).filter(t => t && cleanCopy(t.text));
  const hasBenefits = Boolean(solution || benefits.length);
  const hasOrder = Boolean(page.whatsappNumber?.replace(/[^0-9]/g, ''));
  const hasHero = Boolean(headline || subheadline || price || page.productImageUrl || hasOrder || urgency);
  const theme = productTheme(page.colorScheme);
  const BenefitsHeading = headline ? 'h2' : 'h1';
  const BenefitTitle = headline ? 'h3' : 'h2';
  const ReviewsHeading = headline || hasBenefits ? 'h2' : 'h1';
  const ClosingHeading = headline || hasBenefits || testimonials.length > 0 ? 'h2' : 'h1';
  // Preserve the existing WhatsApp destination and message contract.
  const waLink = page.whatsappNumber
    ? `https://wa.me/${page.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(c.whatsapp_message || 'Halo!')}`
    : '#';
  const cta = cleanCopy(c.cta_button) || 'Pesan via WhatsApp';
  const orderButton = (small = false) => <a href={waLink} target="_blank" rel="noopener noreferrer" className={`product-button ${small ? 'product-button-small' : ''}`}><span>{cta}</span><ArrowRight size={17} aria-hidden="true" /></a>;

  return (
    <MotionSurface className={`product-page ${hasOrder ? 'product-has-order' : ''}`} data-theme={theme.name} style={theme.style}>
      <a href="#product-content" className="product-skip">Lewati navigasi</a>
      {(brand || hasHero || hasBenefits || testimonials.length > 0) && <header className="product-nav">
        <nav className="product-width product-nav-inner" aria-label="Navigasi produk">
          {brand && <a href={hasHero ? "#ringkasan" : "#product-content"} className="product-brand">{brand}</a>}
          <div className="product-nav-links">
            {hasHero && <a href="#ringkasan">Ringkasan</a>}
            {hasBenefits && <a href="#keunggulan">Keunggulan</a>}
            {testimonials.length > 0 && <a href="#ulasan">Ulasan</a>}
          </div>
          {hasOrder && orderButton(true)}
        </nav>
      </header>}
      <main id="product-content" tabIndex={-1}>
        {hasHero && <section id="ringkasan" className="product-hero product-width">
          {page.productName && cleanCopy(page.productName) !== headline && <p className="product-eyebrow">{cleanCopy(page.productName)}</p>}
          {headline && <h1 className="product-title">{headline}</h1>}
          {subheadline && <p className="product-body product-hero-sub">{subheadline}</p>}
          {price && <p className="product-price">{price}</p>}
          {(hasOrder || hasBenefits) && <div className="product-actions">
            {hasOrder && orderButton()}
            {hasBenefits && <a className="product-link" href="#keunggulan">Lihat keunggulan <ChevronRight size={18} aria-hidden="true" /></a>}
          </div>}
          {urgency && <p className="product-caption">{urgency}</p>}
          {page.productImageUrl && <div className="product-hero-art">
            <div className="product-photo-scale"><ProductImage src={page.productImageUrl} alt={cleanCopy(page.productName) || headline || 'Foto produk'} priority sizes="(max-width: 768px) 90vw, (max-width: 1280px) 80vw, 1080px" className="product-hero-image" /></div>
          </div>}
        </section>}

        {pains.length > 0 && <section className="product-statements" aria-label="Kebutuhan Anda">
          <div className="product-width">
            {pains.map((pain, i) => <div className="product-statement" key={i}>
              <p className="reveal product-section-title" data-reveal>{pain}</p>
            </div>)}
          </div>
        </section>}

        {hasBenefits && <section id="keunggulan" className="product-section product-width">
          <div className="product-section-heading reveal" data-reveal>
            <p className="product-eyebrow">Keunggulan</p>
            <BenefitsHeading className="product-section-title">{solution || 'Hal kecil. Bedanya terasa.'}</BenefitsHeading>
          </div>
          {benefits.length > 0 && <div className="product-bento">
            {benefits.map((benefit, i) => <article key={i} className="product-benefit reveal" data-reveal style={{ '--reveal-delay': `${i % 3 * 90}ms` } as CSSProperties}>
              <div className="product-benefit-icon"><BenefitIcon name={benefit.icon} /></div>
              <div>{cleanCopy(benefit.title) && <BenefitTitle>{cleanCopy(benefit.title)}</BenefitTitle>}{cleanCopy(benefit.desc) && <p className="product-body">{cleanCopy(benefit.desc)}</p>}</div>
            </article>)}
          </div>}
        </section>}

        {page.productImageUrl && <div className="product-showcase" aria-hidden="true">
          <div className="product-parallax"><ProductImage src={page.productImageUrl} alt="" decorative sizes="100vw" className="product-showcase-image" /></div>
        </div>}

        {testimonials.length > 0 && <section id="ulasan" className="product-section product-reviews">
          <div className="product-width product-section-heading reveal" data-reveal>
            <p className="product-eyebrow">Cerita pelanggan</p>
            <ReviewsHeading className="product-section-title">Dari mereka yang memilih.</ReviewsHeading>
            <p className="product-body">Geser untuk membaca cerita lainnya.</p>
          </div>
          <div className="product-review-track" role="region" aria-label="Ulasan pelanggan, geser untuk membaca" tabIndex={0}>
            {testimonials.map((testimonial, i) => {
              const rating = typeof testimonial.rating === 'number' && Number.isFinite(testimonial.rating) ? Math.max(0, Math.min(5, Math.round(testimonial.rating))) : null;
              return <figure className="product-review-card" key={testimonial.id || i}>
                <div className="product-review-top">
                  {rating !== null && <div className="product-stars" role="img" aria-label={`${rating} dari 5 bintang`}>{Array.from({ length: 5 }, (_, star) => <Star key={star} size={16} fill={star < rating ? 'currentColor' : 'none'} aria-hidden="true" />)}</div>}
                  {testimonial.source === 'ai' && <span className="product-sample-label">Ulasan contoh</span>}
                </div>
                <blockquote>{cleanCopy(testimonial.text)}</blockquote>
                {(cleanCopy(testimonial.name) || cleanCopy(testimonial.location)) && <figcaption>
                  {cleanCopy(testimonial.name) && <span className="product-initial" aria-hidden="true">{cleanCopy(testimonial.name).slice(0, 1)}</span>}
                  <div>{cleanCopy(testimonial.name) && <p className="product-review-name">{cleanCopy(testimonial.name)}</p>}{cleanCopy(testimonial.location) && <p className="product-caption">{cleanCopy(testimonial.location)}</p>}</div>
                </figcaption>}
              </figure>;
            })}
          </div>
        </section>}

        {hasOrder && <section className="product-section product-closing product-width">
          <div className="reveal" data-reveal><ClosingHeading className="product-section-title">{cleanCopy(page.productName) ? `${cleanCopy(page.productName)}. Untuk Anda.` : 'Pilihan baik, mulai di sini.'}</ClosingHeading>
            {price && <p className="product-price">{price}</p>}
            <div className="product-actions">{orderButton()}</div>
          </div>
        </section>}
      </main>
      <footer className="product-footer"><div className="product-width">
        {brand && <p className="product-footer-brand">{brand}</p>}
        {hasOrder && <p>Informasi produk dan pemesanan langsung dengan penjual.</p>}
        <a href="https://lynksell.vercel.app" target="_blank" rel="noopener noreferrer">Dibuat dengan LynkSell <ArrowRight size={12} aria-hidden="true" /></a>
      </div></footer>
      {hasOrder && <aside className="product-mobile-cta" aria-label="Pesan produk">
        {price && <p>{price}</p>}{orderButton(true)}
      </aside>}
    </MotionSurface>
  );
}
