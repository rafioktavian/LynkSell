import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getAdminDb } from '@/lib/firebase-admin';
import { BrandSetupModal } from '@/components/onboarding/BrandSetupModal';
import Link from "next/link";
import { Plus } from "lucide-react";
import { StatsBar } from '@/components/dashboard/StatsBar';
import { DashboardList } from '@/components/dashboard/DashboardList';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/button';
import { DEMO_PAGES } from '@/lib/constants';
import { isDemoMode, MOCK_USER_SESSION } from '@/lib/demo';

export default async function DashboardPage() {
  const isDemo = isDemoMode();
  const session = isDemo ? MOCK_USER_SESSION : await auth();
  
  if (!session?.user?.id) redirect('/login');

  let hasBrand = true;
  let userData: any = { brandName: session.user?.name, brandSlug: 'demo-brand' };
  let pages: any[] = [];

  if (isDemo) {
    pages = DEMO_PAGES.map((p, index) => ({
      ...p,
      id: p.pageId,
      fullSlug: `${p.brandSlug}/${p.pageSlug}`,
      status: 'published',
      viewCount: 150 + index * 50,
      createdAt: { toDate: () => new Date() },
      updatedAt: { toDate: () => new Date() }
    }));
  } else {
    const db = getAdminDb();
    
    // Ambil user dari database langsung untuk brandSlug terupdate
    const userDoc = await db.collection('users').doc(session.user.id).get();
    userData = userDoc.data() || {};
    hasBrand = !!userData?.brandSlug;

    const pagesSnap = await db.collection('pages')
      .where('userId', '==', session.user.id)
      .orderBy('createdAt', 'desc')
      .get();

    pages = pagesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  const stats = {
    total: pages.length,
    published: pages.filter(p => (p as any).status === "published").length,
    draft: pages.filter(p => (p as any).status === "draft").length,
    views: pages.reduce((acc, curr) => acc + ((curr as any).viewCount || 0), 0)
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col font-sans overflow-hidden">
      <DashboardHeader user={session.user} />
      {!hasBrand && <BrandSetupModal isOpen={true} />}

      <main className="flex-grow p-4 sm:p-8 flex flex-col gap-6 max-w-5xl mx-auto w-full h-full min-h-0">
        
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Selamat Datang, {userData?.brandName || session.user.name}!</h1>
            <p className="text-slate-500 text-sm">Pantau performa dan buat landing page baru untuk produk Anda.</p>
          </div>
          <Link href="/dashboard/new">
            <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 rounded-xl px-6 h-12 text-base w-full sm:w-auto text-white">
              <Plus className="w-5 h-5 mr-2" />
              Buat Halaman Baru
            </Button>
          </Link>
        </div>

        {pages.length > 0 && <StatsBar pages={pages} />}

        <DashboardList pages={pages} />

      </main>
    </div>
  );
}
