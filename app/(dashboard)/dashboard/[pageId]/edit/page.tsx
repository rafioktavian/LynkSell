import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { EditorShell } from '@/components/editor/EditorShell';
import { getAdminDb } from '@/lib/firebase-admin';

export default async function EditPage({ params }: { params: Promise<{ pageId: string }> }) {
  const { pageId } = await params;
  const { isDemoMode, MOCK_USER_SESSION, getDemoPage } = await import('@/lib/demo');
  const isDemo = isDemoMode();
  const session = isDemo ? MOCK_USER_SESSION as any : await auth();
  if (!session?.user?.id) redirect('/login');

  let pageData: any = null;

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

    pageData = { id: pageDoc.id, ...pageDoc.data() } as any;
  }

  // Cek kepemilikan
  if (!isDemo && pageData.userId !== session.user.id) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
       <EditorShell pageData={pageData} />
    </div>
  );
}
