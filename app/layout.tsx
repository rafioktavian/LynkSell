import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, DM_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://lynksell.id'),
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
    url: 'https://lynksell.id',
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
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
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
    <html lang="id" className={`${plusJakartaSans.variable} ${dmSans.variable}`}>
      <body className="antialiased font-body">
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
