import { z } from 'zod';

export const SOCIAL_PLATFORMS = [
  { key: 'instagram', label: 'Instagram', domains: ['instagram.com'] },
  { key: 'facebook', label: 'Facebook', domains: ['facebook.com', 'fb.com'] },
  { key: 'tiktok', label: 'TikTok', domains: ['tiktok.com'] },
  { key: 'youtube', label: 'YouTube', domains: ['youtube.com', 'youtu.be'] },
  { key: 'x', label: 'X / Twitter', domains: ['x.com', 'twitter.com'] },
  { key: 'threads', label: 'Threads', domains: ['threads.net', 'threads.com'] },
  { key: 'linkedin', label: 'LinkedIn', domains: ['linkedin.com'] },
  { key: 'telegram', label: 'Telegram', domains: ['t.me', 'telegram.me'] },
  { key: 'other', label: 'Tautan lainnya', domains: [] },
] as const;

export type SocialKey = typeof SOCIAL_PLATFORMS[number]['key'];
export type SocialLinks = Partial<Record<SocialKey, string>>;

export function normalizeSocialUrl(key: SocialKey, value: string): string | null {
  const input = value.trim();
  if (!input) return '';
  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(input) ? input : `https://${input}`);
    const platform = SOCIAL_PLATFORMS.find(item => item.key === key)!;
    if (url.protocol !== 'https:' || url.username || url.password || url.port || !url.hostname.includes('.')) return null;
    if (platform.domains.length && !platform.domains.some(domain => url.hostname === domain || url.hostname.endsWith(`.${domain}`))) return null;
    return url.href;
  } catch { return null; }
}

export const socialLinksSchema = z.object(Object.fromEntries(SOCIAL_PLATFORMS.map(({ key, label }) => [
  key,
  z.string().max(2048).transform(value => normalizeSocialUrl(key, value)).refine(value => value !== null, `Link ${label} tidak valid. Gunakan alamat HTTPS yang sesuai.`).optional(),
])) as Record<SocialKey, z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string | null, string>, string | null, string>>>).strict()
  .transform(links => Object.fromEntries(Object.entries(links).filter(([, value]) => value)) as SocialLinks);
