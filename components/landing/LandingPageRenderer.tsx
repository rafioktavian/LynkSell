import { ArrowRight, AtSign, Link as LinkIcon, MessageCircle, Music2, Send } from 'lucide-react';
import { MotionSurface } from '@/components/presentation/MotionSurface';
import { ProductImage } from '@/components/presentation/ProductImage';
import { PhotoGallery } from './PhotoGallery';
import { ReviewCarousel } from './ReviewCarousel';
import { cleanCopy, productTheme } from '@/lib/presentation';
import { normalizeSocialUrl, SOCIAL_PLATFORMS, type SocialKey, type SocialLinks } from '@/lib/social-links';

function SocialIcon({ platform }: { platform: SocialKey }) {
  if (platform === 'instagram') return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>;
  if (platform === 'youtube') return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 8.2c-.2-1.6-1.1-2.5-2.7-2.7C17.5 5.2 14.8 5 12 5s-5.5.2-7.3.5C3.1 5.7 2.2 6.6 2 8.2a28 28 0 0 0 0 7.6c.2 1.6 1.1 2.5 2.7 2.7 1.8.3 4.5.5 7.3.5s5.5-.2 7.3-.5c1.6-.2 2.5-1.1 2.7-2.7a28 28 0 0 0 0-7.6ZM10 15.5v-7l6 3.5-6 3.5Z" /></svg>;
  if (platform === 'facebook' || platform === 'linkedin' || platform === 'x') return <span aria-hidden="true" style={{ fontSize: platform === 'linkedin' ? 17 : 22, fontWeight: 700, lineHeight: 1 }}>{platform === 'facebook' ? 'f' : platform === 'linkedin' ? 'in' : '𝕏'}</span>;
  const Icon = { tiktok: Music2, threads: AtSign, telegram: Send, other: LinkIcon }[platform];
  return Icon ? <Icon size={20} aria-hidden="true" /> : null;
}

interface Benefit { icon?: string; title?: string; desc?: string }
interface Testimonial { id?: string; name?: string; location?: string; rating?: number; text?: string; avatarUrl?: string | null; source?: string }
interface CopyData { headline?: string; subheadline?: string; pain_points?: string[]; solution_intro?: string; benefits?: Benefit[]; urgency_text?: string; cta_button?: string; whatsapp_message?: string }
export interface LandingPageData {
  id?: string; productName?: string; productImageUrl?: string; copyData?: CopyData;
  testimonials?: Testimonial[]; colorScheme?: string; whatsappNumber?: string;
  harga?: string; brandSlug?: string; pageSlug?: string; brandName?: string;
  backgrounds?: { hero?: string; benefits?: string; showcase?: string; closing?: string };
  gallery?: string[];
  socialLinks?: SocialLinks;
}

export function LandingPageRenderer({ page }: { page: LandingPageData }) {
  const c = page.copyData || {};
  const headline = cleanCopy(c.headline) || cleanCopy(page.productName);
  const subheadline = cleanCopy(c.subheadline);
  const name = cleanCopy(page.productName);
  const brand = cleanCopy(page.brandName);
  const price = cleanCopy(page.harga);
  const solution = cleanCopy(c.solution_intro);
  const urgency = cleanCopy(c.urgency_text);
  const benefits = (c.benefits || []).filter(b => b && (cleanCopy(b.title) || cleanCopy(b.desc))).slice(0, 4);
  const pains = (c.pain_points || []).map(cleanCopy).filter(Boolean).slice(0, 2);
  const gallery = (page.gallery || []).filter(Boolean).slice(0, 6);
  const reviews = (page.testimonials || []).filter(t => t && cleanCopy(t.text));
  const hasBenefits = Boolean(benefits.length || solution);
  const hasOrder = Boolean(page.whatsappNumber?.replace(/[^0-9]/g, ''));
  const heroPhoto = page.backgrounds?.hero;
  const introPhoto = page.productImageUrl || page.backgrounds?.benefits;
  const closingPhoto = page.backgrounds?.closing || heroPhoto;
  const hasHero = Boolean(headline || subheadline || price || page.productImageUrl || heroPhoto || hasOrder || urgency);
  const waLink = page.whatsappNumber ? `https://wa.me/${page.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(c.whatsapp_message || 'Halo!')}` : '#';
  const cta = cleanCopy(c.cta_button) || 'Pesan via WhatsApp';
  const orderButton = (small = false) => <a href={waLink} target="_blank" rel="noopener noreferrer" className={`product-button ${small ? 'product-button-small' : ''}`}><MessageCircle size={19} aria-hidden="true" /><span>{cta}</span><ArrowRight size={17} aria-hidden="true" /></a>;
  const introText = subheadline || cleanCopy(benefits[0]?.desc);
  const theme = productTheme(page.colorScheme);
  const socialLinks = SOCIAL_PLATFORMS.flatMap(({ key, label }) => {
    const value = page.socialLinks?.[key];
    const url = typeof value === 'string' ? normalizeSocialUrl(key as SocialKey, value) : null;
    return url ? [{ key, label, url }] : [];
  });
  return <MotionSurface className={`product-page editorial-page ${hasOrder ? 'product-has-order' : ''}`} data-theme={theme.name} style={theme.style}>
    <a href="#product-content" className="product-skip">Lewati navigasi</a>
    {(brand || hasOrder) && <header className="product-nav"><nav className="product-width product-nav-inner" aria-label="Navigasi produk">{brand && <a className="product-brand" href="#ringkasan">{brand}</a>}{hasOrder && orderButton(true)}</nav></header>}
    <main id="product-content" tabIndex={-1}>
      {hasHero && <section id="ringkasan" className={`editorial-hero ${heroPhoto ? 'has-background' : ''}`}>
        {heroPhoto ? <ProductImage src={heroPhoto} alt="" decorative priority sizes="100vw" className="editorial-hero-bg" /> : page.productImageUrl && <div className="editorial-hero-product"><ProductImage src={page.productImageUrl} alt={name || headline || 'Foto produk'} priority sizes="(max-width: 767px) 100vw, 65vw" className="editorial-contain" /></div>}
        <div className="editorial-hero-shade" />
        <div className="editorial-hero-copy product-width">{brand && <p className="editorial-kicker">{brand}</p>}{headline && <h1>{headline}</h1>}{subheadline && <p className="editorial-hero-sub">{subheadline}</p>}{price && <p className="editorial-price">{price}</p>}<div className="editorial-actions">{hasOrder && orderButton()}{hasBenefits && <a className="editorial-outline" href="#keunggulan">Lihat keunggulan <ArrowRight size={17} aria-hidden="true" /></a>}</div>{urgency && <p className="editorial-urgency">{urgency}</p>}</div>
      </section>}
      {benefits.some(b => cleanCopy(b.title)) && <div className="editorial-pill-row product-width">{benefits.slice(0, 3).map((benefit, index) => cleanCopy(benefit.title) && <span key={index}>{cleanCopy(benefit.title)}</span>)}</div>}
      {(solution || introText) && <section className={`editorial-intro product-width ${introPhoto ? 'has-photo' : ''}`}><div className="reveal" data-reveal>{solution && <h2>{solution}</h2>}{introText && <p>{introText}</p>}</div>{introPhoto && <div className="editorial-intro-image"><ProductImage src={introPhoto} alt={name || 'Foto produk'} sizes="(max-width: 767px) 90vw, 45vw" className="editorial-cover" /></div>}</section>}
      {pains.length > 0 && <section className="editorial-pains" aria-label="Kebutuhan Anda">{pains.map((pain, i) => <div className="editorial-pain" key={i}><p className="reveal" data-reveal>{pain}</p></div>)}</section>}
      {benefits.length > 0 && <section id="keunggulan" className="editorial-benefits">{benefits.map((benefit, i) => <article className={`editorial-benefit ${gallery[i] ? 'has-photo' : ''}`} key={i}><div className="editorial-benefit-copy reveal" data-reveal><span className="editorial-number">{String(i + 1).padStart(2, '0')}</span>{cleanCopy(benefit.title) && <h2>{cleanCopy(benefit.title)}</h2>}{cleanCopy(benefit.desc) && <p>{cleanCopy(benefit.desc)}</p>}</div>{gallery[i] && <div className={`editorial-benefit-photo editorial-crop-${i}`}><ProductImage src={gallery[i]} alt={name || 'Foto produk'} sizes="(max-width: 767px) 100vw, 50vw" className="editorial-cover" /></div>}</article>)}</section>}
      {!benefits.length && solution && <span id="keunggulan" />}
      {gallery.length >= 2 && <PhotoGallery images={gallery} name={name || 'Foto produk'} />}
      {reviews.length > 0 && <section id="ulasan" className="editorial-reviews"><ReviewCarousel reviews={reviews} /></section>}
      {hasOrder && <section className="editorial-closing">{closingPhoto && <ProductImage src={closingPhoto} alt="" decorative sizes="100vw" className="editorial-cover" />}<div className="editorial-closing-shade" /><div className="editorial-closing-copy reveal" data-reveal>{(name || brand) && <h2>{name || brand}</h2>}{price && <p className="editorial-price">{price}</p>}{orderButton()}</div></section>}
    </main>
    <footer className="product-footer"><div className="product-width">{socialLinks.length > 0 && <nav className="product-social-links" aria-label="Media sosial">{socialLinks.map(({ key, label, url }) => <a key={key} href={url} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}><SocialIcon platform={key} /></a>)}</nav>}<a className="product-footer-credit" href="https://lynksell.vercel.app" target="_blank" rel="noopener noreferrer">Dibuat dengan LynkSell <ArrowRight size={12} aria-hidden="true" /></a></div></footer>
    {hasOrder && <aside className="product-mobile-cta" aria-label="Pesan produk">{orderButton()}</aside>}
  </MotionSurface>;
}
