import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { EditorShell } from '@/components/editor/EditorShell';
import { getAdminDb } from '@/lib/firebase-admin';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export default async function EditPage({ params }: { params: Promise<{ pageId: string }> }) {
  const { pageId } = await params;
  const { isDemoMode, MOCK_USER_SESSION, getDemoPage } = await import('@/lib/demo');
  const isDemo = isDemoMode();
  const session = isDemo ? MOCK_USER_SESSION as any : await auth();
  if (!session?.user?.id) redirect('/login');

  let pageData: any = null;
  let userData: any = { brandName: session.user?.name, brandSlug: 'demo-brand' };

  if (isDemo) {
    const { DEMO_PAGES } = await import('@/lib/constants');
    const demoRef = DEMO_PAGES.find(p => p.pageId === pageId);
    if (!demoRef) {
       pageData = getDemoPage('demo-brand/' + pageId); // Fallback dummy
       pageData.id = pageId;
    } else {
       pageData = getDemoPage(demoRef.brandSlug + '/' + demoRef.pageSlug);
       pageData.id = demoRef.pageId;
    }
  } else {
    const db = await import('@/lib/firebase-admin').then(m => m.getAdminDb());
    const pageDoc = await db.collection('pages').doc(pageId).get();
    
    if (!pageDoc.exists) {
      notFound();
    }

    const rawData = pageDoc.data();
    pageData = { 
      id: pageDoc.id, 
      ...rawData,
      createdAt: rawData?.createdAt?.toMillis ? rawData.createdAt.toMillis() : rawData?.createdAt,
      updatedAt: rawData?.updatedAt?.toMillis ? rawData.updatedAt.toMillis() : rawData?.updatedAt,
      publishedAt: rawData?.publishedAt?.toMillis ? rawData.publishedAt.toMillis() : rawData?.publishedAt,
    } as any;

    const userDoc = await db.collection('users').doc(session.user.id).get();
    const rawUserData = userDoc.data() || {};
    userData = {
      ...rawUserData,
      createdAt: rawUserData?.createdAt?.toMillis ? rawUserData.createdAt.toMillis() : rawUserData?.createdAt,
      updatedAt: rawUserData?.updatedAt?.toMillis ? rawUserData.updatedAt.toMillis() : rawUserData?.updatedAt,
    };
  }

  // Cek kepemilikan
  if (!isDemo && pageData.userId !== session.user.id) {
    redirect('/dashboard');
  }

  // Gabungkan user info
  const combinedUser = { ...session.user, ...userData };

  return (
    <div className="w-full min-h-screen bg-surface-soft flex flex-col font-sans overflow-hidden">
       <DashboardHeader user={combinedUser} backLink="/dashboard" />
       <EditorShell pageData={pageData} />
    </div>
  );
}
