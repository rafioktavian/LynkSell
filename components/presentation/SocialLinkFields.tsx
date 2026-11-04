'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SOCIAL_PLATFORMS, normalizeSocialUrl, type SocialLinks } from '@/lib/social-links';

export function SocialLinkFields({ value, onChange, idPrefix }: { value: SocialLinks; onChange: (value: SocialLinks) => void; idPrefix: string }) {
  return <div className="space-y-4">
    <p className="text-sm text-ink-muted">Opsional. Hanya tautan yang diisi akan tampil di halaman.</p>
    {SOCIAL_PLATFORMS.map(({ key, label, domains }) => {
      const invalid = !!value[key]?.trim() && normalizeSocialUrl(key, value[key]!) === null;
      const id = `${idPrefix}-${key}`;
      return <div key={key} className="space-y-2">
        <Label htmlFor={id}>{label}</Label>
        <Input id={id} type="url" inputMode="url" placeholder={domains.length ? `https://${domains[0]}/...` : 'https://...'} value={value[key] || ''} onChange={event => onChange({ ...value, [key]: event.target.value })} aria-invalid={invalid} aria-describedby={invalid ? `${id}-error` : undefined} />
        {invalid && <p id={`${id}-error`} className="text-xs text-red-700">Masukkan alamat HTTPS {domains.length ? `untuk ${label}` : 'yang valid'}.</p>}
      </div>;
    })}
  </div>;
}
