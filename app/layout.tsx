import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://lynksell.vercel.app'),
  title: 'LynkSell - AI Landing Page Generator untuk UMKM',
  description: 'LynkSell membantu UMKM Indonesia membuat halaman jualan profesional, ringan, dan SEO-friendly dalam 30 detik tanpa potongan komisi.',
  keywords: ['Landing Page', 'UMKM Indonesia', 'AI Landing Page', 'Jualan Online', 'Tanpa Komisi'],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://lynksell.vercel.app',
    title: 'LynkSell - Bikin Halaman Jualan Pakai AI',
    description: 'Buat landing page jualan otomatis dengan AI. Upload foto, jadi link siap sebar ke WhatsApp dan Instagram.',
    siteName: 'LynkSell',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'LynkSell AI' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LynkSell - AI Landing Page untuk UMKM',
    description: 'Buat landing page profesional dalam hitungan detik.',
  },
  icons: {
    icon: '/favicon.svg',
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // Accessbility friendly
  themeColor: '#4F46E5', // Primary brand color
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={geist.variable}>
      <body className="antialiased font-sans">
        <div>
          {children}
        </div>
      </body>
    </html>
  );
}
