import type { Metadata } from 'next';
import { Lora, Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const interFont = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LynkSell — Buat Halaman Jualan dari Foto Produk dalam 30 Detik | AI Landing Page UMKM',
  description: 'LynkSell adalah tools AI untuk UMKM Indonesia. Buat halaman jualan profesional dari foto produk dalam 30 detik. Bebas potongan marketplace, 100% milik kamu.',
  keywords: ['landing page jualan', 'tools UMKM', 'AI copywriting', 'halaman produk', 'toko online tanpa marketplace', 'link bio instagram jualan'],
  metadataBase: new URL('https://lynksell.id'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://lynksell.id',
    title: 'LynkSell — Satu Link, Ribuan Pembeli',
    description: 'Buat halaman jualan profesional dari foto produk dalam 30 detik. Bebas potongan komisi marketplace.',
    siteName: 'LynkSell',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LynkSell AI Landing Page Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LynkSell — Satu Link, Ribuan Pembeli',
    description: 'Tools AI untuk UMKM Indonesia. Dari foto ke halaman jualan dalam 30 detik.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "LynkSell",
  "url": "https://lynksell.id",
  "description": "Tools AI untuk UMKM Indonesia membuat halaman jualan profesional dari foto produk dalam 30 detik.",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "IDR",
    "description": "Gratis untuk memulai"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "1000"
  }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Apa itu LynkSell?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "LynkSell adalah tools AI yang membantu UMKM Indonesia membuat halaman jualan profesional hanya dari foto produk dalam 30 detik, tanpa potongan marketplace."
      }
    },
    {
      "@type": "Question",
      "name": "Apakah LynkSell benar-benar gratis?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ya. Kamu bisa mulai gratis tanpa kartu kredit dan tanpa potongan komisi dari semua hasil penjualan."
      }
    },
    {
      "@type": "Question",
      "name": "Platform apa yang didukung?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Link jualan LynkSell bisa disebar di mana saja — bio Instagram, link TikTok, broadcast WhatsApp, atau bahkan dicetak sebagai QR code."
      }
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="id" 
      className={`${lora.variable} ${interFont.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-white flex flex-col font-sans" suppressHydrationWarning>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <main className="flex-1 flex flex-col relative">
          {children}
        </main>
        <Toaster position="bottom-right" richColors theme="light" />
      </body>
    </html>
  );
}
