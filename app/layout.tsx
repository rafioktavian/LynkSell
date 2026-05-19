import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const interFont = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LynkSell | AI Landing Page Generator',
  description: 'Buat halaman jualan profesional dari foto produk dalam 30 detik. Tingkatkan konversi penjualan UMKM dengan LynkSell. Bebas potongan marketplace.',
  keywords: ['landing page', 'buat website', 'toko online', 'umkm indonesia', 'ai landing page', 'olshop'],
  metadataBase: new URL('https://lynksell.id'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://lynksell.id',
    title: 'LynkSell | Satu link. Ribuan pembeli.',
    description: 'Buat halaman jualan profesional dari foto produk dalam 30 detik. Gratis tanpa potongan marketplace.',
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
    title: 'LynkSell | Satu link. Ribuan pembeli.',
    description: 'Buat halaman jualan profesional dari foto produk dalam 30 detik menggunakan Gemini AI.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="id" 
      className={`${plusJakarta.variable} ${interFont.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <main className="flex-1 flex flex-col relative">
          {children}
        </main>
        <Toaster position="bottom-right" richColors theme="light" />
      </body>
    </html>
  );
}
