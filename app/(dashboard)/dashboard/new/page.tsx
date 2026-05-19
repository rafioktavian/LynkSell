import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { WizardShell } from '@/components/wizard/WizardShell';
import { getAdminDb } from '@/lib/firebase-admin';

export default async function NewPage() {
  const { isDemoMode, MOCK_USER_SESSION } = await import('@/lib/demo');
  const isDemo = isDemoMode();
  const session = isDemo ? MOCK_USER_SESSION as any : await auth();
  
  if (!session?.user?.id) redirect('/login');
  
  let userData: any = { brandSlug: 'demo-brand' };
  
  if (!isDemo) {
    const db = await import('@/lib/firebase-admin').then(m => m.getAdminDb());
    const userDoc = await db.collection('users').doc(session.user.id).get();
    userData = userDoc.data() || {};
  }

  if (!userData?.brandSlug) {
      redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8">
       <WizardShell brandSlug={userData.brandSlug} />
    </div>
  );
}
