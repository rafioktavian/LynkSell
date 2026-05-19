import { getAdminDb } from '@/lib/firebase-admin';
import { notFound } from 'next/navigation';
import { LandingPageRenderer } from '@/components/landing/LandingPageRenderer';
import { Metadata } from 'next';
import { isDemoMode, getDemoPage } from '@/lib/demo';

async function getPublishedPage(fullSlug: string): Promise<any> {
  'use cache';
  if (isDemoMode()) {
    return getDemoPage(fullSlug);
  }
  
  const db = getAdminDb();
  const snap = await db.collection('pages')
    .where('fullSlug', '==', fullSlug)
    .where('status', '==', 'published')
    .limit(1)
    .get();
    
  return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
}

export async function generateMetadata({ params }: { params: Promise<{ brandSlug: string, pageSlug: string }> }): Promise<Metadata> {
  const { brandSlug, pageSlug } = await params;
  const fullSlug = `${brandSlug}/${pageSlug}`;
  const page = await getPublishedPage(fullSlug);
  
  if (!page) {
    return { title: 'Halaman Tidak Ditemukan | LynkSell' };
  }

  return {
    title: `${page.productName} | ${page.brandSlug}`,
    description: page.copyData?.headline || `Beli ${page.productName} sekarang`,
    openGraph: {
      title: page.productName,
      description: page.copyData?.headline,
      images: page.productImageUrl ? [page.productImageUrl] : [],
    }
  };
}

export default async function Page({ params }: { params: Promise<{ brandSlug: string, pageSlug: string }> }) {
  const { brandSlug, pageSlug } = await params;
  const fullSlug = `${brandSlug}/${pageSlug}`;
  
  const pageData = await getPublishedPage(fullSlug);

  if (!pageData) {
    notFound();
  }

  // Fire and forget increment view count (bukan di-await supaya tidak blocking render)
  const db = getAdminDb();
  db.collection('pages').doc(pageData.id).update({
    viewCount: (pageData.viewCount || 0) + 1
  }).catch(console.error);

  return <LandingPageRenderer page={pageData} />;
}
