import { getAdminDb } from './firebase-admin';

export function generateSlug(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .substring(0, 60);
}

export async function getUniqueBrandSlug(baseSlug: string): Promise<string> {
  const db = getAdminDb();
  let slug = baseSlug || 'brand';
  let attempt = 1;
  const maxAttempts = 20;

  while (attempt <= maxAttempts) {
    const snapshot = await db.collection('users').where('brandSlug', '==', slug).limit(1).get();
    if (snapshot.empty) {
      // Check the slugIndex as an alternative uniqueness test if desired, 
      // but users collection where('brandSlug', '==', slug) is direct.
      return slug;
    }
    attempt++;
    slug = `${baseSlug}-${attempt}`;
  }
  
  return `${baseSlug}-${Date.now()}`;
}

export async function getUniquePageSlug(brandSlug: string, basePageSlug: string): Promise<string> {
  const db = getAdminDb();
  let slug = basePageSlug || 'page';
  let attempt = 1;
  const maxAttempts = 20;

  while (attempt <= maxAttempts) {
    const fullSlug = `${brandSlug}/${slug}`;
    const snapshot = await db.collection('pages').where('fullSlug', '==', fullSlug).limit(1).get();
    if (snapshot.empty) {
      return slug;
    }
    attempt++;
    slug = `${basePageSlug}-${attempt}`;
  }

  return `${basePageSlug}-${Date.now()}`;
}

export async function getUniqueSlug(baseSlug: string, type: "brand" | "page", userId?: string): Promise<string> {
  return type === 'brand' ? getUniqueBrandSlug(baseSlug) : getUniquePageSlug('', baseSlug);
}

export function formatWhatsApp(input: string): string {
  if (!input) return '';
  const digitsOnly = input.replace(/\D/g, '');
  if (digitsOnly.startsWith('08')) {
    return '62' + digitsOnly.slice(1);
  }
  if (digitsOnly.startsWith('628')) {
    return digitsOnly;
  }
  return digitsOnly;
}
