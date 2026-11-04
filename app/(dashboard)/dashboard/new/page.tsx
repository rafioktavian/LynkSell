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
    <div className="min-h-screen bg-surface-soft flex items-start justify-center px-4 py-8 sm:p-12">
       <WizardShell brandSlug={userData.brandSlug} />
    </div>
  );
}
