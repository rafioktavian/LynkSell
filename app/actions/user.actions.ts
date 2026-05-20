'use server';
import { auth } from '@/auth';
import { getAdminDb } from '@/lib/firebase-admin';
import { BrandSetupSchema, RegisterSchema } from '@/lib/validations';
import { generateSlug, getUniqueBrandSlug } from '@/lib/slug';
import { revalidatePath } from 'next/cache';
import { FieldValue } from 'firebase-admin/firestore';
import bcrypt from 'bcryptjs';
import { headers } from 'next/headers';
import { checkRateLimit } from '@/lib/rate-limit';

export type ActionResult = { success: boolean; error?: string; data?: any };

export async function setupBrandAction(formData: FormData): Promise<ActionResult> {
  const { isDemoMode } = await import('@/lib/demo');
  if (isDemoMode()) return { success: true, data: { brandSlug: 'demo-brand' } };
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const brandName = formData.get('brandName') as string;
    const validatedFields = BrandSetupSchema.safeParse({ brandName });

    if (!validatedFields.success) {
      return { success: false, error: validatedFields.error.errors[0].message };
    }

    const { brandName: validBrandName } = validatedFields.data;
    const baseSlug = generateSlug(validBrandName);
    if (!baseSlug) {
      return { success: false, error: 'Nama brand tidak valid' };
    }
    
    const uniqueSlug = await getUniqueBrandSlug(baseSlug);

    const db = getAdminDb();
    
    await db.collection('users').doc(session.user.id).set({
      id: session.user.id,
      name: session.user.name || null,
      email: session.user.email || null,
      image: session.user.image || null,
      brandName: validBrandName,
      brandSlug: uniqueSlug,
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });

    await db.collection('slugIndex').doc(`brand:${uniqueSlug}`).set({
      userId: session.user.id,
      type: 'brand',
    });

    revalidatePath('/dashboard');
    return { success: true, data: { brandSlug: uniqueSlug } };
  } catch (error: any) {
    console.error('Error setting up brand:', error);
    return { success: false, error: error.message || 'Internal server error' };
  }
}

export async function updateUserProfileAction(formData: FormData): Promise<ActionResult> {
  const { isDemoMode } = await import('@/lib/demo');
  if (isDemoMode()) return { success: true };
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const name = formData.get('name') as string;
    const image = formData.get('image') as string;

    if (!name || name.trim().length < 2) {
      return { success: false, error: 'Nama minimal 2 karakter' };
    }

    const db = getAdminDb();
    await db.collection('users').doc(session.user.id).set({
      id: session.user.id,
      name: name.trim(),
      ...(image ? { image } : {}),
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return { success: false, error: error.message || 'Internal server error' };
  }
}

export async function loginUserAction(formData: FormData): Promise<ActionResult> {
  const { isDemoMode } = await import('@/lib/demo');
  if (isDemoMode()) return { success: true };

  try {
    const { signIn: serverSignIn } = await import('@/auth');

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    await serverSignIn('credentials', {
      email,
      password,
      redirect: false,
    });
    
    return { success: true };
  } catch (error: any) {
    if (typeof error === 'object' && error !== null && error.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    if (error?.name === 'AuthError' || error?.type) {
      if (error.type === 'CredentialsSignin') {
        return { success: false, error: 'Email atau password salah' };
      }
      return { success: false, error: error.message || 'Terjadi kesalahan sistem' };
    }
    return { success: false, error: error.message || 'Terjadi kesalahan saat masuk' };
  }
}

export async function registerUserAction(formData: FormData): Promise<ActionResult> {
  const { isDemoMode } = await import('@/lib/demo');
  if (isDemoMode()) return { success: true };
  try {
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip, 10, 60 * 1000)) {
      return { success: false, error: 'Terlalu banyak permintaan. Coba lagi dalam 1 menit.' };
    }
    
    const data = Object.fromEntries(formData.entries());
    const parsed = RegisterSchema.safeParse(data);
    if (!parsed.success) return { success: false, error: parsed.error.errors[0].message };
    const db = getAdminDb();
    const existing = await db.collection("users").where("email", "==", parsed.data.email).get();
    if (!existing.empty) return { success: false, error: "Email sudah terdaftar" };
    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    const userId = db.collection("users").doc().id;
    await db.collection("users").doc(userId).set({ id: userId, email: parsed.data.email, name: parsed.data.name, passwordHash, createdAt: FieldValue.serverTimestamp() });
    return { success: true };
  } catch (err) {
    return { success: false, error: "Gagal" };
  }
}
