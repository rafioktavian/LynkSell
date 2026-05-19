import Image from 'next/image';
import { safeGet } from '@/lib/parse-gemini';
import { CountdownTimer } from './CountdownTimer';

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
  source: 'manual' | 'ai';
  createdAt?: number;
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
  id: string;
  productName: string;
  productImageUrl: string;
  copyData: CopyData;
  testimonials?: Testimonial[];
  colorScheme: 'elegant' | 'bold' | 'fresh' | 'luxury';
  whatsappNumber: string;
  harga: string;
  brandSlug: string;
  pageSlug?: string;
  brandName?: string;
}

interface Props {
  page: PageData;
}

// --- CONSTANTS ---
const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: 'fb-1',
    name: 'Rina S.',
    location: 'Jakarta Selatan',
    rating: 5,
    text: 'Udah 2 minggu pake dan emg beda banget! Kulit aku yang biasanya kusam sekarang keliatan lebih cerah. Nggak nyangka secepet ini hasilnya 😭',
    avatarUrl: null,
    source: 'ai',
    createdAt: Date.now() - 86_400_000 * 4,
  },
  {
    id: 'fb-2',
    name: 'Mas Fajar',
    location: 'Surabaya',
    rating: 5,
    text: 'Awalnya skeptis sih, tapi nyobain karena ada garansinya. Ternyata beneran kerasa bedanya. Seller juga fast respon dan packing rapiiii!',
    avatarUrl: null,
    source: 'ai',
    createdAt: Date.now() - 86_400_000 * 6,
  },
  {
    id: 'fb-3',
    name: 'Dewi K.',
    location: 'Bandung',
    rating: 5,
    text: 'Harga segini untuk kualitas kayak gini? Ga nyesel sama sekali. Udah rekomendasiin ke temen-temen kantor, dua orang langsung order juga 😄',
    avatarUrl: null,
    source: 'ai',
    createdAt: Date.now() - 86_400_000 * 8,
  },
];

// --- HELPERS ---
function formatRupiah(raw: string | number): string {
  const num = typeof raw === 'string' ? parseInt(raw.replace(/\D/g, ''), 10) : raw;
  if (isNaN(num)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num);
}

function buildWALink(phone: string, message: string): string {
  if (!phone) return '#';
  const digits = phone.replace(/\D/g, '');
  const normalized = digits.startsWith('0')
    ? '62' + digits.slice(1)
    : digits.startsWith('62')
    ? digits
    : '62' + digits;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

function hargaCoret(raw: string | number): string {
  const num = typeof raw === 'string' ? parseInt(raw.replace(/\D/g, ''), 10) : raw;
  if (isNaN(num)) return '';
  const coret = Math.ceil((num * 1.35) / 1000) * 1000;
  return formatRupiah(coret);
}

function sortTestimonials(list: Testimonial[]): Testimonial[] {
  return [
    ...list.filter(t => t.source === 'manual'),
    ...list.filter(t => t.source === 'ai'),
  ];
}

function getAvatarUrl(name: string, avatarUrl?: string | null): string {
  if (avatarUrl) return avatarUrl;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=80&bold=true`;
}

function hitungHematPersen(raw: string | number): number {
  const num = typeof raw === 'string' ? parseInt(raw.replace(/\D/g, ''), 10) : raw;
  if (isNaN(num) || num === 0) return 0;
  const coret = Math.ceil((num * 1.35) / 1000) * 1000;
  return Math.round(((coret - num) / coret) * 100);
}

// --- COLOR SCHEMES ---
const SCHEMES = {
  elegant: { accent: '#0F172A', accentAlpha: '#0F172A12', highlight: '#0EA5E9', ring: '#0F172A30' },
  bold:    { accent: '#EA580C', accentAlpha: '#EA580C12', highlight: '#FB923C', ring: '#EA580C30' },
  fresh:   { accent: '#059669', accentAlpha: '#05966912', highlight: '#34D399', ring: '#05966930' },
  luxury:  { accent: '#7C3AED', accentAlpha: '#7C3AED12', highlight: '#A78BFA', ring: '#7C3AED30' },
} as const;

// --- MAIN COMPONENT ---
export function LandingPageRenderer({ page }: Props) {
  const scheme = SCHEMES[page.colorScheme] ?? SCHEMES.bold;
  const copy = page.copyData ?? {};

  const headline    = safeGet(copy, 'headline',      page.productName);
  const subheadline = safeGet(copy, 'subheadline',   'Produk pilihan terbaik untuk kamu.');
  const solutionIntro = safeGet(copy, 'solution_intro', 'Inilah solusi yang kamu cari.');
  const urgencyText = safeGet(copy, 'urgency_text',  'Stok terbatas — pesan sekarang!');
  const ctaButton   = safeGet(copy, 'cta_button',    'Pesan via WhatsApp Sekarang');
  const waMsgTmpl   = safeGet(copy, 'whatsapp_message', `Halo, saya tertarik dengan ${page.productName}. Masih tersedia?`);

  const painPoints: string[] = [
    safeGet(copy, 'pain_points.0', 'Susah cari produk yang cocok?'),
    safeGet(copy, 'pain_points.1', 'Harga mahal tapi kualitas mengecewakan?'),
    safeGet(copy, 'pain_points.2', 'Takut kena tipu belanja online?')
  ];

  const benefits: Benefit[] = [
    {
      icon: safeGet(copy, 'benefits.0.icon', '✅'),
      title: safeGet(copy, 'benefits.0.title', 'Kualitas Terjamin'),
      desc: safeGet(copy, 'benefits.0.desc', 'Setiap produk dicek ketat sebelum dikirim.')
    },
    {
      icon: safeGet(copy, 'benefits.1.icon', '🚀'),
      title: safeGet(copy, 'benefits.1.title', 'Pengiriman Cepat'),
      desc: safeGet(copy, 'benefits.1.desc', 'Pesan hari ini, besok sampai.')
    },
    {
      icon: safeGet(copy, 'benefits.2.icon', '💯'),
      title: safeGet(copy, 'benefits.2.title', 'Garansi Penuh'),
      desc: safeGet(copy, 'benefits.2.desc', 'Tidak puas? Uang kembali 100%.')
    }
  ];

  const rawTestimonials = Array.isArray(page.testimonials) ? page.testimonials : [];
  let testimonials = sortTestimonials(rawTestimonials);
  if (testimonials.length < 3) {
    testimonials = [...testimonials, ...FALLBACK_TESTIMONIALS].slice(0, Math.max(3, testimonials.length));
  }

  const waLink    = buildWALink(page.whatsappNumber || '080000000000', waMsgTmpl);
  const waLinkAsk = buildWALink(
    page.whatsappNumber || '080000000000',
    `Halo kak 👋 Saya mau tanya dulu soal ${page.productName} sebelum order. Boleh?`
  );

  const hematPersen = hitungHematPersen(page.harga);
  const hargaFormatted = formatRupiah(page.harga);
  const hargaCoretFormatted = hargaCoret(page.harga);

  return (
    // eslint-disable-next-line @next/next/no-sync-scripts
    <main className="font-sans antialiased bg-white text-gray-900 overflow-x-hidden" style={{ '--accent': scheme.accent, '--accent-alpha': scheme.accentAlpha } as React.CSSProperties}>
      <script src="https://cdn.tailwindcss.com"></script>
      <script dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          theme: {
            extend: {
              colors: { accent: 'var(--accent)', 'accent-alpha': 'var(--accent-alpha)' },
              fontFamily: {
                sans: ['"DM Sans"', 'sans-serif'],
                heading: ['"Plus Jakarta Sans"', 'sans-serif'],
              }
            }
          }
        }
      `}} />
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');
        
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up {
          opacity: 0;
          animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-play-state: paused;
        }
        .fade-up.visible { animation-play-state: running; }
        .d1 { animation-delay: 0.05s; }
        .d2 { animation-delay: 0.15s; }
        .d3 { animation-delay: 0.25s; }
        .d4 { animation-delay: 0.35s; }
        .d5 { animation-delay: 0.45s; }

        @keyframes waPulse {
          0%   { box-shadow: 0 0 0 0 rgba(37,211,102,0.55); }
          70%  { box-shadow: 0 0 0 16px rgba(37,211,102,0); }
          100% { box-shadow: 0 0 0 0 rgba(37,211,102,0); }
        }
        .wa-btn { animation: waPulse 2.2s ease infinite; }

        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .ticker-wrap { animation: ticker 22s linear infinite; display: flex; width: max-content; }

        .dot-pattern {
          background-image: radial-gradient(circle, #E5E7EB 1px, transparent 1px);
          background-size: 28px 28px;
        }
      `}} />

      {/* SECTION 1: HERO */}
      <section className="dot-pattern bg-stone-50 pt-16 pb-12 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-24 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 lg:gap-16 items-center text-center lg:text-left">
          
          <div className="flex-1 space-y-6 lg:space-y-8 max-w-2xl mx-auto lg:mx-0">
            <span className="fade-up d1 inline-block bg-accent-alpha border border-accent/20 text-accent text-xs sm:text-sm px-4 py-1.5 rounded-full tracking-wide font-semibold">
              ✦ Produk Unggulan
            </span>
            <h1 className="fade-up d2 font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-gray-900 drop-shadow-sm">
              {headline}
            </h1>
            <p className="fade-up d3 text-lg sm:text-xl text-gray-600 leading-relaxed font-medium">
              {subheadline}
            </p>
            
            <div className="fade-up d4 flex flex-wrap items-baseline justify-center lg:justify-start gap-3 pt-2">
              <span className="text-lg sm:text-xl text-gray-400 line-through">{hargaCoretFormatted}</span>
              <span className="font-heading font-extrabold text-4xl sm:text-5xl text-accent tracking-tight">{hargaFormatted}</span>
              {hematPersen > 0 && (
                <span className="bg-green-100 text-green-700 text-sm font-bold px-3 py-1 rounded-md shadow-sm"> Hemat {hematPersen}%</span>
              )}
            </div>

            <div className="fade-up d5 pt-4">
              <a href={waLink} className="wa-btn inline-flex items-center justify-center gap-3 bg-accent text-white font-heading font-bold text-lg px-8 py-4 rounded-2xl shadow-[0_8px_30px_var(--accent-alpha)] transition-transform hover:-translate-y-1 w-full sm:w-auto">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382C17.15 14.221 15.568 13.441 15.278 13.336C14.989 13.23 14.779 13.177 14.57 13.493C14.36 13.809 13.781 14.494 13.603 14.705C13.424 14.916 13.245 14.943 12.924 14.78C12.603 14.62 11.408 14.234 10.003 12.981C8.909 12.006 8.169 10.796 7.954 10.427C7.739 10.058 7.931 9.856 8.093 9.7L8.472 9.257C8.633 9.068 8.683 8.942 8.788 8.731C8.892 8.52 8.841 8.336 8.761 8.177C8.681 8.019 7.954 6.223 7.649 5.485C7.351 4.767 7.049 4.863 6.855 4.854C6.671 4.846 6.46 4.846 6.25 4.846C6.04 4.846 5.702 4.925 5.412 5.241C5.122 5.557 4.302 6.322 4.302 7.876C4.302 9.43 5.443 10.92 5.604 11.131C5.765 11.341 7.82 14.502 10.963 15.861C11.71 16.184 12.296 16.377 12.756 16.523C13.504 16.76 14.183 16.726 14.717 16.643C15.316 16.55 16.568 15.885 16.826 15.147C17.085 14.409 17.085 13.777 17.005 13.639C16.924 13.5 16.714 13.42 16.393 13.26L17.472 14.382Z" fill="currentColor"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M12.005 2C6.48 2 2 6.48 2 12C2 13.754 2.453 15.427 3.256 16.901L2 22L7.265 20.765C8.718 21.554 10.36 22 12.005 22C17.53 22 22.01 17.52 22.01 12C22.01 6.48 17.53 2 12.005 2ZM12.005 20.302C10.551 20.302 9.176 19.957 7.971 19.349L7.669 19.169L4.015 20.038L4.897 16.484L4.707 16.173C4.053 15.097 3.698 13.593 3.698 12C3.698 7.42 7.425 3.698 12.005 3.698C16.585 3.698 20.312 7.42 20.312 12C20.312 16.58 16.585 20.302 12.005 20.302Z" fill="currentColor"/>
                </svg>
                {ctaButton}
                <span>→</span>
              </a>
            </div>
          </div>

          <div className="flex-1 w-full max-w-md lg:max-w-full mx-auto relative fade-up d3">
            <div className="absolute -inset-4 bg-accent-alpha rounded-[3rem] blur-2xl z-0" />
            <div className="relative z-10 rounded-[2rem] overflow-hidden aspect-square bg-gray-100 shadow-2xl border border-white/50">
              {page.productImageUrl ? (
                <Image src={page.productImageUrl} alt={page.productName} fill className="object-cover" referrerPolicy="no-referrer" unoptimized={true} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">Gambar Produk</div>
              )}
            </div>
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 mt-6 relative z-10">
              {["✓ Garansi Kembali", "✓ Respon Cepat", "✓ Aman"].map(badge => (
                <span key={badge} className="text-xs sm:text-sm font-semibold text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow-sm">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: SOCIAL PROOF TICKER */}
      <section className="bg-gray-950 py-4 overflow-hidden border-y border-gray-900">
        <div className="ticker-wrap">
          {[1, 2].map(i => (
            <div key={i} className="flex shrink-0 pr-10">
              {['⭐⭐⭐⭐⭐  500+ Puas', '✓  Garansi Penuh', '🚀  Kirim Hari Ini', '💬  Langsung Balas', '🔒  Aman Terpercaya', '📦  Packing Tebal'].map((item, idx) => (
                <span key={idx} className="text-gray-400 text-sm font-semibold tracking-wide flex items-center">
                  {item} <span className="mx-6 text-gray-700">·</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: PAIN POINTS */}
      <section className="bg-stone-50 py-16 sm:py-24 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="uppercase text-xs font-bold tracking-[0.15em] text-accent mb-3 fade-up">
            MENGAPA INI TERJADI?
          </h3>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-gray-900 mb-4 fade-up">
            Pernah ngerasa gini?
          </h2>
          <p className="text-lg text-gray-500 mb-12 sm:mb-16 fade-up">
            Masalah yang sering dialami pembeli sebelum nemuin yang tepat.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            {painPoints.map((point, idx) => (
              <div key={idx} className="fade-up relative bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                <span className="absolute -right-2 -top-6 font-heading font-extrabold text-8xl text-gray-50 select-none z-0 transition-transform group-hover:scale-110">
                  {idx + 1}
                </span>
                <div className="text-4xl mb-6 relative z-10">
                  {['😩', '💸', '😟'][idx % 3]}
                </div>
                <p className="font-bold text-gray-800 text-lg leading-snug relative z-10">
                  {point}
                </p>
              </div>
            ))}
          </div>

          <div className="fade-up bg-accent-alpha border border-accent/20 rounded-2xl p-6 mt-12 sm:mt-16">
            <p className="font-heading font-bold text-xl text-accent italic">
              {solutionIntro}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: PRODUK & BENEFITS */}
      <section className="bg-white py-16 sm:py-24 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20 items-center lg:items-start">
          
          <div className="flex-1 w-full max-w-lg mx-auto fade-up lg:sticky lg:top-24">
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-gray-100 shadow-2xl">
              {page.productImageUrl && (
                <Image src={page.productImageUrl} alt={page.productName} fill className="object-cover" referrerPolicy="no-referrer" unoptimized={true} />
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
               {benefits.slice(0, 3).map((b, i) => (
                  <span key={i} className="text-sm font-semibold text-gray-700 bg-gray-50 border border-gray-200 px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
                    <span>{b.icon}</span> {b.title}
                  </span>
               ))}
            </div>
          </div>

          <div className="flex-1 w-full lg:pt-8 text-center lg:text-left">
             <h3 className="fade-up uppercase text-xs font-bold tracking-[0.15em] text-accent mb-3">
               KENAPA {page.productName.toUpperCase()}?
             </h3>
             <h2 className="fade-up font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-10">
               Kami tau apa yang kamu butuhkan.
             </h2>

             <div className="space-y-8 text-left">
               {benefits.map((b, idx) => (
                 <div key={idx} className="fade-up group flex gap-5 sm:gap-6 items-start pb-8 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="w-14 h-14 shrink-0 bg-accent-alpha rounded-2xl flex items-center justify-center text-3xl transition-transform group-hover:scale-110">
                      {b.icon}
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-xl text-gray-900 mb-2">
                        {b.title}
                      </h4>
                      <p className="text-base text-gray-600 leading-relaxed">
                        {b.desc}
                      </p>
                    </div>
                 </div>
               ))}
             </div>

             <a href={waLink} className="fade-up inline-flex items-center justify-center gap-2 mt-12 px-8 py-4 border-2 border-accent text-accent hover:bg-accent hover:text-white rounded-2xl font-heading font-bold text-lg transition-colors w-full sm:w-auto">
                <span>→</span> {ctaButton}
             </a>
          </div>
          
        </div>
      </section>

      {/* SECTION 5: TESTIMONI */}
      <section className="bg-gray-950 py-16 sm:py-24 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto fade-up text-center lg:text-left">
          <h3 className="uppercase text-xs font-bold tracking-[0.15em] text-gray-500 mb-3">
            APA KATA MEREKA
          </h3>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-4">
            Bukan janji — ini faktanya.
          </h2>
          <p className="text-lg text-gray-400 mb-12 sm:mb-16">
            Pembeli asli, pengalaman nyata.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-left">
             {testimonials.map(t => (
                <div key={t.id} className="fade-up bg-[#111] border border-gray-800 rounded-3xl p-8 flex flex-col group hover:border-gray-700 transition-colors">
                   <div className="text-5xl text-accent font-serif opacity-50 mb-4 select-none leading-none">“</div>
                   <p className="italic text-gray-300 leading-relaxed flex-1 mb-8 text-lg">
                     {t.text}
                   </p>
                   <div className="flex gap-1 mb-6">
                     {[...Array(5)].map((_, i) => (
                       <span key={i} className="text-yellow-400 text-lg">★</span>
                     ))}
                   </div>
                   <div className="pt-6 border-t border-gray-800 flex items-center gap-4 mt-auto">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={getAvatarUrl(t.name, t.avatarUrl)} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-gray-800" crossOrigin="anonymous" referrerPolicy="no-referrer" />
                      <div>
                        <div className="font-heading font-bold text-sm text-gray-100">{t.name}</div>
                        <div className="text-xs text-gray-500 font-medium">{t.location}</div>
                      </div>
                   </div>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: HARGA & CTA FINAL */}
      <section className="bg-stone-50 py-16 sm:py-24 px-4 sm:px-8">
        <div className="max-w-2xl mx-auto text-center fade-up">
          <div className="inline-flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-3 mb-10 shadow-sm">
            <span className="text-xl">⏰</span>
            <span className="font-bold text-sm text-red-800 tracking-wide">
              {urgencyText.toUpperCase()}
            </span>
          </div>

          <CountdownTimer pageId={page.id} accentColor={scheme.accent} />

          <p className="text-gray-500 font-medium mb-3 mt-6">Harga spesial hari ini</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6">
             <span className="text-2xl text-gray-400 line-through decoration-1">{hargaCoretFormatted}</span>
             <span className="font-heading font-extrabold text-5xl sm:text-6xl text-accent tracking-tight">{hargaFormatted}</span>
          </div>
          
          {hematPersen > 0 && (
            <div className="mb-8">
              <span className="bg-green-100 text-green-700 text-sm font-bold px-4 py-1.5 rounded-lg shadow-sm">Hemat {hematPersen}%</span>
            </div>
          )}

          <p className="text-sm text-gray-500 mb-12 font-medium">
             ✓ Harga sudah termasuk ongkir Jawa — BISA COD
          </p>

          <a href={waLink} className="wa-btn flex items-center justify-center gap-3 bg-accent hover:opacity-90 transition-opacity text-white w-full py-5 rounded-2xl font-heading font-black text-xl shadow-[0_10px_40px_var(--accent-alpha)] mb-6">
             <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382C17.15 14.221 15.568 13.441 15.278 13.336C14.989 13.23 14.779 13.177 14.57 13.493C14.36 13.809 13.781 14.494 13.603 14.705C13.424 14.916 13.245 14.943 12.924 14.78C12.603 14.62 11.408 14.234 10.003 12.981C8.909 12.006 8.169 10.796 7.954 10.427C7.739 10.058 7.931 9.856 8.093 9.7L8.472 9.257C8.633 9.068 8.683 8.942 8.788 8.731C8.892 8.52 8.841 8.336 8.761 8.177C8.681 8.019 7.954 6.223 7.649 5.485C7.351 4.767 7.049 4.863 6.855 4.854C6.671 4.846 6.46 4.846 6.25 4.846C6.04 4.846 5.702 4.925 5.412 5.241C5.122 5.557 4.302 6.322 4.302 7.876C4.302 9.43 5.443 10.92 5.604 11.131C5.765 11.341 7.82 14.502 10.963 15.861C11.71 16.184 12.296 16.377 12.756 16.523C13.504 16.76 14.183 16.726 14.717 16.643C15.316 16.55 16.568 15.885 16.826 15.147C17.085 14.409 17.085 13.777 17.005 13.639C16.924 13.5 16.714 13.42 16.393 13.26L17.472 14.382Z" fill="currentColor"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M12.005 2C6.48 2 2 6.48 2 12C2 13.754 2.453 15.427 3.256 16.901L2 22L7.265 20.765C8.718 21.554 10.36 22 12.005 22C17.53 22 22.01 17.52 22.01 12C22.01 6.48 17.53 2 12.005 2ZM12.005 20.302C10.551 20.302 9.176 19.957 7.971 19.349L7.669 19.169L4.015 20.038L4.897 16.484L4.707 16.173C4.053 15.097 3.698 13.593 3.698 12C3.698 7.42 7.425 3.698 12.005 3.698C16.585 3.698 20.312 7.42 20.312 12C20.312 16.58 16.585 20.302 12.005 20.302Z" fill="currentColor"/>
             </svg>
             {ctaButton}
          </a>

          <a href={waLinkAsk} className="inline-flex items-center justify-center gap-2 text-accent bg-transparent border border-accent/20 hover:bg-accent/5 font-bold text-base px-6 py-3 rounded-xl transition-colors mb-12 sm:w-auto w-full">
             💬 Tanya Dulu Sebelum Beli
          </a>

          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 pt-10 border-t border-gray-200">
             {["🔒 Transaksi Aman", "📦 Packing Rapi", "↩️ Garansi Penuh"].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-500">
                   {item}
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: FOOTER */}
      <footer className="bg-gray-950 py-16 px-4 pb-32 sm:pb-16 text-center border-t border-gray-900">
         <div className="font-heading font-black text-2xl text-gray-100 tracking-tight mb-6">
            {page.brandName || 'LynkSell'}
         </div>
         <p className="text-gray-500 text-sm max-w-sm mx-auto mb-8 leading-relaxed">
            Halaman resmi {page.brandName ? `toko ${page.brandName}` : 'kami'}. Terimakasih atas kepercayaannya.
         </p>
         
         <a href={waLinkAsk} className="inline-flex items-center gap-2 text-green-500 font-bold hover:text-green-400 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382C17.15 14.221 15.568 13.441 15.278 13.336C14.989 13.23 14.779 13.177 14.57 13.493C14.36 13.809 13.781 14.494 13.603 14.705C13.424 14.916 13.245 14.943 12.924 14.78C12.603 14.62 11.408 14.234 10.003 12.981C8.909 12.006 8.169 10.796 7.954 10.427C7.739 10.058 7.931 9.856 8.093 9.7L8.472 9.257C8.633 9.068 8.683 8.942 8.788 8.731C8.892 8.52 8.841 8.336 8.761 8.177C8.681 8.019 7.954 6.223 7.649 5.485C7.351 4.767 7.049 4.863 6.855 4.854C6.671 4.846 6.46 4.846 6.25 4.846C6.04 4.846 5.702 4.925 5.412 5.241C5.122 5.557 4.302 6.322 4.302 7.876C4.302 9.43 5.443 10.92 5.604 11.131C5.765 11.341 7.82 14.502 10.963 15.861C11.71 16.184 12.296 16.377 12.756 16.523C13.504 16.76 14.183 16.726 14.717 16.643C15.316 16.55 16.568 15.885 16.826 15.147C17.085 14.409 17.085 13.777 17.005 13.639C16.924 13.5 16.714 13.42 16.393 13.26L17.472 14.382Z" fill="currentColor"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M12.005 2C6.48 2 2 6.48 2 12C2 13.754 2.453 15.427 3.256 16.901L2 22L7.265 20.765C8.718 21.554 10.36 22 12.005 22C17.53 22 22.01 17.52 22.01 12C22.01 6.48 17.53 2 12.005 2ZM12.005 20.302C10.551 20.302 9.176 19.957 7.971 19.349L7.669 19.169L4.015 20.038L4.897 16.484L4.707 16.173C4.053 15.097 3.698 13.593 3.698 12C3.698 7.42 7.425 3.698 12.005 3.698C16.585 3.698 20.312 7.42 20.312 12C20.312 16.58 16.585 20.302 12.005 20.302Z" fill="currentColor"/>
            </svg>
            Hubungi via WhatsApp
         </a>

         <div className="border-t border-gray-900 mx-auto max-w-xs my-8" />

         <p className="text-xs text-gray-600 font-medium tracking-wide">
            Powered by LynkSell · Buat landing page jualanmu di <a href="/" className="text-gray-500 underline hover:text-gray-300">lynksell.id</a>
         </p>
      </footer>

      {/* FLOATING MOBILE CTA */}
      <div className="fixed sm:hidden bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 px-4 py-3 pb-8 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
         <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 font-bold tracking-wider">HARGA PROMO</span>
            <span className="font-heading font-black text-xl text-accent leading-none mt-1">
               {hargaFormatted}
            </span>
         </div>
         <a href={waLink} className="bg-accent text-white px-5 py-3 rounded-xl font-heading font-bold text-sm flex items-center gap-2 shadow-lg">
            Pesan Skrg
         </a>
      </div>

      {/* SCRIPT INTERSECTION OBSERVER */}
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script dangerouslySetInnerHTML={{ __html: `
        (() => {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
              }
            });
          }, { threshold: 0.1 });
          document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
        })();
      `}} />
    </main>
  );
}
