'use client';

import { Check, Palette } from 'lucide-react';
import { useId, useState } from 'react';
import { normalizeHex, PRODUCT_THEMES } from '@/lib/presentation';

export function ThemePicker({ value, onChange, allowCustom = true }: { value: string; onChange: (theme: string) => void; allowCustom?: boolean }) {
  const custom = normalizeHex(value);
  const [lastCustom, setLastCustom] = useState(() => normalizeHex(value) || '#4338b8');
  const inputId = useId();
  return <div role="group" aria-label="Tema warna halaman" className="theme-picker">
    {PRODUCT_THEMES.map(theme => <button key={theme.id} type="button" aria-pressed={value === theme.id} className={`theme-swatch ${value === theme.id ? 'theme-selected' : ''}`} onClick={() => onChange(theme.id)}>
      <span className="theme-miniature" style={{ background: theme.background, color: theme.ink }} aria-hidden="true"><span className="theme-mini-line" /><span className="theme-mini-line short" /><span className="theme-mini-button" style={{ background: theme.accent }} /></span>
      <span className="flex items-center justify-between gap-1 text-xs font-medium">{theme.name}{value === theme.id && <Check size={14} aria-hidden="true" />}</span>
      <span className="sr-only">{theme.description}</span>
    </button>)}
    {allowCustom ? <div className={`theme-swatch ${custom ? 'theme-selected' : ''}`}>
      <button type="button" aria-pressed={Boolean(custom)} onClick={() => onChange(custom || lastCustom)} className="w-full text-left">
        <span className="theme-miniature" style={{ background: '#f5f5f7', color: '#1d1d1f' }} aria-hidden="true"><span className="theme-mini-line" /><span className="theme-mini-line short" /><span className="theme-mini-button" style={{ background: custom || lastCustom }} /></span>
        <span className="flex min-h-6 items-center justify-between text-xs font-medium">Kustom{custom ? <Check size={14} /> : <Palette size={13} />}</span>
      </button>
      <label htmlFor={inputId} className="mt-2 flex min-h-11 cursor-pointer items-center justify-between gap-2 border-t pt-2 text-[11px] text-ink-muted"><span>{custom || 'Pilih warna'}</span><input id={inputId} type="color" value={custom || lastCustom} aria-label="Pilih warna aksen kustom" onChange={event => { setLastCustom(event.target.value); onChange(event.target.value); }} className="h-11 w-11 cursor-pointer rounded-lg border bg-transparent p-1" /></label>
    </div> : <div className="theme-swatch flex flex-col justify-between bg-surface-soft text-ink-muted"><Palette size={23} className="my-4" aria-hidden="true" /><span className="text-xs font-medium">Kustom</span><p className="mt-1 text-[10px] leading-relaxed">Atur di editor setelah halaman jadi.</p></div>}
  </div>;
}
