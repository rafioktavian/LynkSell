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
      .get();

    pages = pagesSnap.docs.map(doc => {
      const data = doc.data();
      return { 
        id: doc.id, 
        ...data,
        createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : data.createdAt,
        updatedAt: data.updatedAt?.toMillis ? data.updatedAt.toMillis() : data.updatedAt,
        publishedAt: data.publishedAt?.toMillis ? data.publishedAt.toMillis() : data.publishedAt,
      };
    }).sort((a: any, b: any) => {
      const timeA = a.createdAt || 0;
      const timeB = b.createdAt || 0;
      return timeB - timeA;
    });
  }

  const stats = {
    total: pages.length,
    published: pages.filter(p => (p as any).status === "published").length,
    draft: pages.filter(p => (p as any).status === "draft").length,
    views: pages.reduce((acc, curr) => acc + ((curr as any).viewCount || 0), 0)
  };

  return (
    <div className="w-full min-h-screen bg-surface-soft flex flex-col font-sans overflow-hidden">
      <DashboardHeader user={session.user} />
      {!hasBrand && <BrandSetupModal isOpen={true} />}

      <main className="flex-grow px-5 py-10 sm:px-8 sm:py-14 flex flex-col gap-10 max-w-7xl mx-auto w-full h-full min-h-0">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 shrink-0">
          <div>
            <p className="eyebrow mb-4 text-ink-muted">Ruang usaha Anda</p><h1 className="text-3xl sm:text-5xl font-semibold tracking-[-.045em] text-ink mb-3">Halo, {userData?.brandName || session.user.name}.</h1>
            <p className="text-ink-muted text-base leading-relaxed max-w-[48ch]">Pantau performa dan buat landing page baru untuk produk Anda.</p>
          </div>
          <Link href="/dashboard/new">
            <Button className="rounded-full px-6 h-12 text-sm w-full sm:w-auto">
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
