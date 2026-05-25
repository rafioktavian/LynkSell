'use server';

import { auth } from '@/auth';
import { getAdminDb } from '@/lib/firebase-admin';
import { generateSlug, getUniquePageSlug, formatWhatsApp } from '@/lib/slug';
import { revalidatePath, revalidateTag } from 'next/cache';
import { FieldValue } from 'firebase-admin/firestore';
import { PageDetailsSchema, UpdateSlugSchema, UpdateCopySchema, Testimonial } from '@/lib/validations';

export type ActionResult = { success: boolean; error?: string; data?: any };

type CreatePageInput = {
  productName: string;
  productImageUrl: string;
  copyData: any;
  testimonials: Testimonial[];
  colorScheme: string;
  whatsappNumber: string;
  harga: string;
  targetPembeli: string;
  pageSlug?: string;
};

export async function createPageAction(data: CreatePageInput): Promise<ActionResult> {
  const { isDemoMode } = await import('@/lib/demo');
  if (isDemoMode()) return { success: true, data: { pageId: 'demo', pageSlug: 'demo', fullSlug: 'demo/demo' } };
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const db = getAdminDb();
    const userDoc = await db.collection('users').doc(session.user.id).get();
    
    if (!userDoc.exists) {
      return { success: false, error: 'User not found' };
    }

    const userData = userDoc.data();
    const brandSlug = userData?.brandSlug;

    if (!brandSlug) {
      return { success: false, error: 'Brand setup is required' };
    }
    
    const validDetails = PageDetailsSchema.safeParse({
      productName: data.productName,
      targetPembeli: data.targetPembeli,
      harga: data.harga,
      whatsappNumber: data.whatsappNumber,
      colorScheme: data.colorScheme,
    });
    
    if (!validDetails.success) {
      return { success: false, error: validDetails.error.errors[0].message };
    }
    
    const validCopy = UpdateCopySchema.safeParse(data.copyData);
    if (!validCopy.success) {
      return { success: false, error: validCopy.error.errors[0].message };
    }

    let pageSlugToUse = data.pageSlug || generateSlug(data.productName);
    const pageSlug = await getUniquePageSlug(brandSlug, pageSlugToUse);
    const fullSlug = `${brandSlug}/${pageSlug}`;
    
    const formattedWa = formatWhatsApp(data.whatsappNumber);

    const pageId = db.collection('pages').doc().id;

    await db.collection('pages').doc(pageId).set({
      userId: session.user.id,
      brandSlug,
      pageSlug,
      fullSlug,
      productName: data.productName,
      productImageUrl: data.productImageUrl,
      copyData: validCopy.data,
      testimonials: data.testimonials || [],
      colorScheme: validDetails.data.colorScheme,
      whatsappNumber: formattedWa,
      harga: data.harga,
      targetPembeli: data.targetPembeli,
      status: 'draft',
      viewCount: 0,
      publishedAt: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    await db.collection('slugIndex').doc(`page:${fullSlug.replace(/\//g, ':')}`).set({
      userId: session.user.id,
      type: 'page',
    });

    await db.collection('users').doc(session.user.id).update({
      totalPages: FieldValue.increment(1),
    });

    revalidatePath('/dashboard');
    return { success: true, data: { pageId, pageSlug, fullSlug } };
  } catch (error: any) {
    console.error('Error creating page:', error);
    return { success: false, error: error.message || 'Internal server error' };
  }
}

export type UpdatePageInput = Partial<CreatePageInput>;

export async function updatePageAction(pageId: string, data: UpdatePageInput): Promise<ActionResult> {
  const { isDemoMode } = await import('@/lib/demo');
  if (isDemoMode()) return { success: true };
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const db = getAdminDb();
    const pageRef = db.collection('pages').doc(pageId);
    const pageDoc = await pageRef.get();

    if (!pageDoc.exists) {
      return { success: false, error: 'Page not found' };
    }

    if (pageDoc.data()?.userId !== session.user.id) {
      return { success: false, error: 'Forbidden' };
    }

    const updateData: any = {
      updatedAt: FieldValue.serverTimestamp()
    };
    
    if (data.copyData) {
      const validCopy = UpdateCopySchema.safeParse(data.copyData);
      if (!validCopy.success) {
        return { success: false, error: validCopy.error.errors[0].message };
      }
      updateData.copyData = validCopy.data;
    }
    
    if (data.colorScheme !== undefined) updateData.colorScheme = data.colorScheme;
    if (data.harga !== undefined) updateData.harga = data.harga;
    if (data.whatsappNumber !== undefined) updateData.whatsappNumber = formatWhatsApp(data.whatsappNumber);
    if (data.testimonials !== undefined) updateData.testimonials = data.testimonials;
    if (data.productName !== undefined) updateData.productName = data.productName;
    
    await pageRef.update(updateData);

    revalidatePath('/dashboard');
    const fullSlug = pageDoc.data()?.fullSlug;
    if (fullSlug) {
      revalidatePath(`/${fullSlug}`);
      // @ts-ignore
      revalidateTag('pages', 'max');
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error updating page:', error);
    return { success: false, error: error.message || 'Internal server error' };
  }
}

export async function updatePageSlugAction(pageId: string, newPageSlug: string): Promise<ActionResult> {
  const { isDemoMode } = await import('@/lib/demo');
  if (isDemoMode()) return { success: true };
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const validSlugResult = UpdateSlugSchema.safeParse({ pageSlug: newPageSlug });
    if (!validSlugResult.success) {
       return { success: false, error: validSlugResult.error.errors[0].message };
    }
    
    const cleanNewSlug = validSlugResult.data.pageSlug;

    const db = getAdminDb();
    const pageRef = db.collection('pages').doc(pageId);
    const pageDoc = await pageRef.get();

    if (!pageDoc.exists) {
      return { success: false, error: 'Page not found' };
    }

    const pageData = pageDoc.data();
    if (pageData?.userId !== session.user.id) {
      return { success: false, error: 'Forbidden' };
    }

    const brandSlug = pageData?.brandSlug;
    const oldFullSlug = pageData?.fullSlug;
    const newFullSlug = `${brandSlug}/${cleanNewSlug}`;

    if (oldFullSlug === newFullSlug) {
      return { success: true };
    }

    const snapshot = await db.collection('pages').where('fullSlug', '==', newFullSlug).limit(1).get();
    if (!snapshot.empty) {
      return { success: false, error: 'URL sudah digunakan, gunakan URL lain' };
    }

    await pageRef.update({
      pageSlug: cleanNewSlug,
      fullSlug: newFullSlug,
      updatedAt: FieldValue.serverTimestamp(),
    });

    if (oldFullSlug) {
       await db.collection('slugIndex').doc(`page:${oldFullSlug.replace(/\//g, ':')}`).delete().catch(() => {});
    }
    await db.collection('slugIndex').doc(`page:${newFullSlug.replace(/\//g, ':')}`).set({
      userId: session.user.id,
      type: 'page',
    });

    revalidatePath('/dashboard');
    // @ts-ignore
    revalidateTag('pages', 'max');

    return { success: true };
  } catch (error: any) {
    console.error('Error updating slug:', error);
    return { success: false, error: error.message || 'Internal server error' };
  }
}

export async function publishPageAction(pageId: string): Promise<ActionResult> {
  const { isDemoMode } = await import('@/lib/demo');
  if (isDemoMode()) return { success: true };
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const db = getAdminDb();
    const pageRef = db.collection('pages').doc(pageId);
    const pageDoc = await pageRef.get();

    if (!pageDoc.exists || pageDoc.data()?.userId !== session.user.id) {
      return { success: false, error: 'Forbidden' };
    }

    await pageRef.update({
      status: 'published',
      publishedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    revalidatePath('/dashboard');
    const fullSlug = pageDoc.data()?.fullSlug;
    if (fullSlug) {
      revalidatePath(`/${fullSlug}`);
      // @ts-ignore
      revalidateTag('pages', 'max');
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Internal server error' };
  }
}

export async function unpublishPageAction(pageId: string): Promise<ActionResult> {
  const { isDemoMode } = await import('@/lib/demo');
  if (isDemoMode()) return { success: true };
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const db = getAdminDb();
    const pageRef = db.collection('pages').doc(pageId);
    const pageDoc = await pageRef.get();

    if (!pageDoc.exists || pageDoc.data()?.userId !== session.user.id) {
      return { success: false, error: 'Forbidden' };
    }

    await pageRef.update({
      status: 'draft',
      publishedAt: null,
      updatedAt: FieldValue.serverTimestamp(),
    });

    revalidatePath('/dashboard');
    const fullSlug = pageDoc.data()?.fullSlug;
    if (fullSlug) {
      revalidatePath(`/${fullSlug}`);
      // @ts-ignore
      revalidateTag('pages', 'max');
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Internal server error' };
  }
}

export async function deletePageAction(pageId: string): Promise<ActionResult> {
  const { isDemoMode } = await import('@/lib/demo');
  if (isDemoMode()) return { success: true };
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const db = getAdminDb();
    const pageRef = db.collection('pages').doc(pageId);
    const pageDoc = await pageRef.get();

    if (!pageDoc.exists) {
      return { success: true }; 
    }

    if (pageDoc.data()?.userId !== session.user.id) {
      return { success: false, error: 'Forbidden' };
    }

    await pageRef.delete();

    await db.collection('users').doc(session.user.id).update({
      totalPages: FieldValue.increment(-1),
    });

    revalidatePath('/dashboard');
    const fullSlug = pageDoc.data()?.fullSlug;
    if (fullSlug) {
      // @ts-ignore
      revalidateTag('pages', 'max');
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting page:', error);
    return { success: false, error: error.message || 'Internal server error' };
  }
}
