import type { CSSProperties } from 'react';

/** Presentation only: stored theme names and fields remain unchanged. */
export const PRODUCT_THEMES = [
  { id: 'elegant', name: 'Elegant', background: '#f5f5f7', ink: '#1d1d1f', accent: '#1d1d1f', description: 'Putih yang tenang' },
  { id: 'bold', name: 'Bold', background: '#f5f5f7', ink: '#1d1d1f', accent: '#4338b8', description: 'Indigo yang berani' },
  { id: 'fresh', name: 'Fresh', background: '#f5f5f7', ink: '#1d1d1f', accent: '#14664b', description: 'Hijau yang segar' },
  { id: 'luxury', name: 'Luxury', background: '#111112', ink: '#f5f5f7', accent: '#d8bb7c', description: 'Gelap dengan emas' },
] as const;

export function normalizeHex(value?: string) {
  if (!value || !/^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(value)) return null;
  return value.length === 4 ? '#' + [...value.slice(1)].map(c => c + c).join('') : value;
}

export function relativeLuminance(hex: string) {
  const rgb = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}

export function productTheme(value?: string): { name: string; style?: CSSProperties } {
  const hex = normalizeHex(value);
  if (hex) {
    const luminance = relativeLuminance(hex);
    return {
      name: 'custom',
      style: {
        '--product-accent': hex,
        // Whichever has greater contrast always reaches at least WCAG AA.
        '--product-on-accent': (luminance + 0.05) / 0.05 > 1.05 / (luminance + 0.05) ? '#000000' : '#ffffff',
      } as CSSProperties,
    };
  }
  return { name: PRODUCT_THEMES.some(t => t.id === value) ? value! : 'elegant' };
}

export function cleanCopy(value?: string | null) {
  return (value || '').replace(/[\p{Extended_Pictographic}\p{Regional_Indicator}\uFE0F\u200D\u20E3]/gu, '').trim();
}

export function canOptimizeImage(src: string) {
  if (src.startsWith('/')) return !src.startsWith('//');
  try {
    const url = new URL(src);
    return url.protocol === 'https:' && ['storage.googleapis.com', 'res.cloudinary.com', 'images.unsplash.com', 'firebasestorage.googleapis.com', 'lh3.googleusercontent.com', 'ui-avatars.com'].includes(url.hostname);
  } catch { return false; }
}
