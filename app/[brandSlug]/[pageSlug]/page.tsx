import { getAdminDb } from '@/lib/firebase-admin';
import { notFound } from 'next/navigation';
import { LandingPageRenderer } from '@/components/landing/LandingPageRenderer';
import { Metadata } from 'next';
import { isDemoMode, getDemoPage } from '@/lib/demo';

async function getPublishedPage(fullSlug: string): Promise<any> {
  "use cache";
  if (isDemoMode()) {
    return getDemoPage(fullSlug);
  }
  
  const db = getAdminDb();
  const snap = await db.collection('pages')
    .where('fullSlug', '==', fullSlug)
    .limit(1)
    .get();
    
  if (snap.empty) return null;
  const rawData = snap.docs[0].data();
  
  if (rawData.status !== 'published') return null;

  return {
    id: snap.docs[0].id,
    ...rawData,
    createdAt: rawData.createdAt?.toMillis ? rawData.createdAt.toMillis() : rawData.createdAt,
    updatedAt: rawData.updatedAt?.toMillis ? rawData.updatedAt.toMillis() : rawData.updatedAt,
    publishedAt: rawData.publishedAt?.toMillis ? rawData.publishedAt.toMillis() : rawData.publishedAt,
  };
}

// Metadata removed temporarily

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
