'use server';

import { auth } from '@/auth';
import { getAdminDb } from '@/lib/firebase-admin';
import { ManualTestimonialSchema, Testimonial } from '@/lib/validations';
import { revalidateTag } from 'next/cache';
import { FieldValue } from 'firebase-admin/firestore';
import crypto from 'crypto';

export type ActionResult = { success: boolean; error?: string; data?: any };

export async function addManualTestimonialAction(pageId: string, formData: FormData): Promise<ActionResult> {
  const { isDemoMode } = await import('@/lib/demo');
  if (isDemoMode()) return { success: true, data: { id: 'demo', source: 'manual', name: 'Demo', location: 'Jakarta', rating: 5, text: 'Demo', createdAt: Date.now() } };
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

    const rawData = {
      name: formData.get('name') as string,
      location: formData.get('location') as string,
      rating: parseFloat(formData.get('rating') as string) || 5,
      text: formData.get('text') as string,
    };

    const validated = ManualTestimonialSchema.safeParse(rawData);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const newTestimonial: Testimonial = {
      id: crypto.randomUUID(),
      source: 'manual',
      name: validated.data.name,
      location: validated.data.location,
      rating: validated.data.rating,
      text: validated.data.text,
      avatarUrl: null, 
      createdAt: Date.now(),
    };

    const existingTestimonials: Testimonial[] = pageDoc.data()?.testimonials || [];
    const manualT = existingTestimonials.filter(t => t.source === 'manual');
    const aiT = existingTestimonials.filter(t => t.source === 'ai');
    
    const updatedTestimonials = [newTestimonial, ...manualT, ...aiT];

    await pageRef.update({
      testimonials: updatedTestimonials,
      updatedAt: FieldValue.serverTimestamp(),
    });

    // @ts-ignore
    revalidateTag('pages', 'max');
    return { success: true, data: newTestimonial };
  } catch (error: any) {
    return { success: false, error: error.message || 'Internal server error' };
  }
}

export async function updateTestimonialAction(pageId: string, testimonialId: string, formData: FormData): Promise<ActionResult> {
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

    const rawData = {
      name: formData.get('name') as string,
      location: formData.get('location') as string,
      rating: parseFloat(formData.get('rating') as string) || 5,
      text: formData.get('text') as string,
    };

    const validated = ManualTestimonialSchema.safeParse(rawData);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const existingTestimonials: Testimonial[] = pageDoc.data()?.testimonials || [];
    const targetIdx = existingTestimonials.findIndex((t) => t.id === testimonialId);

    if (targetIdx === -1) {
      return { success: false, error: 'Testimonial not found' };
    }

    existingTestimonials[targetIdx] = {
      ...existingTestimonials[targetIdx],
      ...validated.data,
    };

    await pageRef.update({
      testimonials: existingTestimonials,
      updatedAt: FieldValue.serverTimestamp(),
    });

    revalidateTag('pages', 'max');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Internal server error' };
  }
}

export async function deleteTestimonialAction(pageId: string, testimonialId: string): Promise<ActionResult> {
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

    const existingTestimonials: Testimonial[] = pageDoc.data()?.testimonials || [];
    const updatedTestimonials = existingTestimonials.filter((t) => t.id !== testimonialId);

    await pageRef.update({
      testimonials: updatedTestimonials,
      updatedAt: FieldValue.serverTimestamp(),
    });

    revalidateTag('pages', 'max');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Internal server error' };
  }
}

export async function reorderTestimonialsAction(pageId: string, orderedIds: string[]): Promise<ActionResult> {
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

    const existingTestimonials: Testimonial[] = pageDoc.data()?.testimonials || [];
    
    const tMap = new Map<string, Testimonial>();
    existingTestimonials.forEach(t => tMap.set(t.id, t));

    const newOrder: Testimonial[] = [];
    orderedIds.forEach(id => {
      if (tMap.has(id)) {
        newOrder.push(tMap.get(id)!);
      }
    });

    if (newOrder.length !== existingTestimonials.length) {
       existingTestimonials.forEach(t => {
         if (!newOrder.find(o => o.id === t.id)) {
            newOrder.push(t);
         }
       });
    }

    const manual = newOrder.filter(t => t.source === 'manual');
    const ai = newOrder.filter(t => t.source === 'ai');
    const finalOrder = [...manual, ...ai];

    await pageRef.update({
      testimonials: finalOrder,
      updatedAt: FieldValue.serverTimestamp(),
    });

    revalidateTag('pages', 'max');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Internal server error' };
  }
}

export async function replaceAITestimonialsAction(pageId: string, newAITestimonials: Testimonial[]): Promise<ActionResult> {
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

    const existingTestimonials: Testimonial[] = pageDoc.data()?.testimonials || [];
    const manualTestimonials = existingTestimonials.filter((t) => t.source === 'manual');

    const updatedTestimonials = [...manualTestimonials, ...newAITestimonials];

    await pageRef.update({
      testimonials: updatedTestimonials,
      updatedAt: FieldValue.serverTimestamp(),
    });

    revalidateTag('pages', 'max');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Internal server error' };
  }
}
