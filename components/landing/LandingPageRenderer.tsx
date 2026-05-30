import React from 'react';

// --- TYPES ---
interface Benefit {
  icon: string;
  title: string;
  desc: string;
}

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  avatarUrl?: string | null;
}

interface CopyData {
  headline?: string;
  subheadline?: string;
  pain_points?: string[];
  solution_intro?: string;
  benefits?: Benefit[];
  urgency_text?: string;
  cta_button?: string;
  whatsapp_message?: string;
}

interface PageData {
  id?: string;
  productName?: string;
  productImageUrl?: string;
  copyData?: CopyData;
  testimonials?: Testimonial[];
  colorScheme?: string;
  whatsappNumber?: string;
  harga?: string;
  brandSlug?: string;
  pageSlug?: string;
  brandName?: string;
}

interface Props {
  page: PageData;
}

function formatPrice(price?: string) {
  return price ? price : '';
}

export function LandingPageRenderer({ page }: Props) {
  const c = page.copyData || {};
  const t = page.testimonials || [];
  
  const isCustomColor = page.colorScheme?.startsWith('#');
  const customHex = isCustomColor ? page.colorScheme : null;

  const allColors = {
    elegant: { bg: 'bg-white', primary: 'bg-slate-900', textPrimary: 'text-slate-900', secondary: 'bg-slate-100', textSecondary: 'text-slate-600', button: 'bg-slate-900', buttonHover: 'hover:bg-slate-800' },
    bold: { bg: 'bg-white', primary: 'bg-indigo-600', textPrimary: 'text-indigo-900', secondary: 'bg-indigo-50', textSecondary: 'text-indigo-600', button: 'bg-indigo-600', buttonHover: 'hover:bg-indigo-700' },
    fresh: { bg: 'bg-white', primary: 'bg-emerald-600', textPrimary: 'text-emerald-900', secondary: 'bg-emerald-50', textSecondary: 'text-emerald-700', button: 'bg-emerald-600', buttonHover: 'hover:bg-emerald-700' },
    luxury: { bg: 'bg-neutral-50', primary: 'bg-amber-600', textPrimary: 'text-amber-900', secondary: 'bg-black', textSecondary: 'text-amber-700', button: 'bg-black', buttonHover: 'hover:bg-neutral-800' },
    custom: { bg: 'bg-white', primary: 'bg-[var(--custom-primary)]', textPrimary: 'text-[var(--custom-primary)]', secondary: 'bg-[var(--custom-secondary)]', textSecondary: 'text-[var(--custom-primary)]', button: 'bg-[var(--custom-primary)]', buttonHover: 'hover:brightness-90 transition-all' }
  };
  
  const colors = isCustomColor ? allColors.custom : (allColors[page.colorScheme as keyof typeof allColors] || allColors['elegant']);

  const waLink = page.whatsappNumber 
    ? `https://wa.me/${page.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(c.whatsapp_message || 'Halo!')}`
    : '#';

  return (
    <>
      <div 
         className={`font-body antialiased ${colors.bg} text-neutral-800 selection:bg-black selection:text-white min-h-screen pb-20 sm:pb-0`}
         style={isCustomColor ? { 
           '--custom-primary': customHex, 
           '--custom-secondary': customHex + '1A' 
         } as React.CSSProperties : undefined}
      >
        
        {/* Hero Section */}
        <section className="w-full flex-col md:flex-row flex items-center md:items-start justify-center gap-8 py-10 px-4 md:px-8 max-w-5xl mx-auto">
          <div className="w-full md:w-1/2 flex justify-center order-1 md:order-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={page.productImageUrl || 'https://placehold.co/600x600?text=Produk'} alt={page.productName || 'Produk'} className="w-full max-w-sm aspect-square object-cover rounded-2xl shadow-xl shadow-black/5" />
          </div>
          <div className="w-full md:w-1/2 order-2 md:order-1 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
            <div className="space-y-4">
              <h1 className={`font-sans text-4xl md:text-5xl font-bold tracking-tight ${colors.textPrimary} leading-tight`}>{c.headline || 'Headline Utama'}</h1>
              <p className="text-lg md:text-xl text-neutral-600 leading-relaxed">{c.subheadline || 'Subheadline'}</p>
            </div>
            
            <div className="space-y-2 w-full pt-2">
              {page.harga && <p className={`text-3xl font-bold ${colors.textPrimary}`}>{formatPrice(page.harga)}</p>}
              {c.urgency_text && <p className="text-sm font-medium text-red-600 bg-red-50 inline-block px-3 py-1 rounded-full">{c.urgency_text}</p>}
            </div>

            <a href={waLink} target="_blank" rel="noopener noreferrer" className={`w-full md:w-auto inline-flex justify-center items-center px-8 py-4 text-base font-semibold text-white transition-all ${colors.button} ${colors.buttonHover} rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1`}>
              {c.cta_button || 'Pesan Sekarang'}
            </a>
          </div>
        </section>

        {/* Pain Points */}
        {c.pain_points && c.pain_points.filter(Boolean).length > 0 && (
          <section className={`${colors.secondary} py-16 px-4`}>
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className={`font-sans text-center text-2xl font-bold ${colors.textSecondary}`}>Sering mengalami ini?</h2>
              <div className="space-y-4">
                {c.pain_points.map((p, i) => p ? (
                  <div key={i} className="flex items-start gap-4 bg-white/60 backdrop-blur p-4 rounded-xl shadow-sm">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 text-lg">❌</span>
                    <p className="text-neutral-700 font-medium pt-1">{p}</p>
                  </div>
                ) : null)}
              </div>
            </div>
          </section>
        )}

        {/* Solution & Benefits */}
        <section className="py-16 px-4 max-w-5xl mx-auto space-y-12">
          {c.solution_intro && (
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <h2 className={`font-sans text-3xl font-bold ${colors.textPrimary}`}>{c.solution_intro}</h2>
              <div className="w-16 h-1 bg-black mx-auto rounded-full opacity-10"></div>
            </div>
          )}

          {c.benefits && c.benefits.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {c.benefits.map((b, i) => (b.title || b.desc) ? (
                <div key={i} className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-4xl mb-4">{b.icon || '✨'}</div>
                  <h3 className={`font-sans text-lg font-bold text-neutral-900 mb-2`}>{b.title}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">{b.desc}</p>
                </div>
              ) : null)}
            </div>
          )}
        </section>

        {/* Testimonials */}
        {t && t.length > 0 && (
          <section className="bg-neutral-50 py-16 px-4 border-y border-neutral-200">
            <div className="max-w-5xl mx-auto space-y-10">
              <h2 className={`font-sans text-center text-3xl font-bold ${colors.textPrimary}`}>Kata Mereka</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {t.map((testi, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
                    <div className="flex text-amber-400 mb-4">
                      {Array.from({length: testi.rating || 5}).map((_, j) => (
                        <svg key={j} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      ))}
                    </div>
                    <p className="text-neutral-700 italic mb-6 leading-relaxed">&quot;{testi.text}&quot;</p>
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={testi.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(testi.name || 'User')}&background=random`} alt={testi.name} className="w-10 h-10 rounded-full object-cover bg-neutral-100"/>
                      <div>
                        <p className={`font-sans font-bold text-neutral-900 text-sm`}>{testi.name}</p>
                        <p className="text-xs text-neutral-500">{testi.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className={`font-sans text-3xl font-bold ${colors.textPrimary}`}>Tunggu Apa Lagi?</h2>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className={`w-full sm:w-auto inline-flex justify-center items-center px-10 py-5 text-lg font-bold text-white transition-all ${colors.button} ${colors.buttonHover} rounded-2xl shadow-xl hover:-translate-y-1`}>
              {c.cta_button || 'Pesan Sekarang'}
            </a>
          </div>
        </section>

        <footer className="py-8 text-center text-neutral-400 text-sm border-t bg-white">
          Dibuat dengan LynkSell
        </footer>

        {/* Floating Mobile CTA */}
        <div className={`md:hidden fixed bottom-4 left-4 right-4 ${colors.bg} rounded-2xl p-4 shadow-2xl border border-neutral-100 flex items-center justify-between`}>
          <div>
            <p className="text-xs text-neutral-500 mb-0.5">Harga Spesial</p>
            <p className={`font-bold ${colors.textPrimary} leading-none text-lg`}>{page.harga ? formatPrice(page.harga) : ''}</p>
          </div>
          <a href={waLink} target="_blank" rel="noopener noreferrer" className={`inline-flex justify-center items-center px-4 py-2 font-semibold text-white transition-all ${colors.button} ${colors.buttonHover} rounded-xl`}>
            {c.cta_button || 'Pesan'}
          </a>
        </div>

      </div>
    </>
  );
}
