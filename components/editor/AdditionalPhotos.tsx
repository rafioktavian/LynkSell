'use client';

import { useRef, useState } from 'react';
import { ArrowDown, ArrowUp, ImageIcon, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { updatePageAction } from '@/app/actions/page.actions';
import { compressImage } from '@/lib/image-compress';
import { ProductImage } from '@/components/presentation/ProductImage';

type Slot = 'hero' | 'benefits' | 'showcase' | 'closing';
type Backgrounds = Partial<Record<Slot, string>>;
const slots: { key: Slot; label: string }[] = [
  { key: 'hero', label: 'Latar Hero (landscape, 1920×1080)' },
  { key: 'benefits', label: 'Foto Keunggulan (potret/persegi)' },
  { key: 'showcase', label: 'Foto Showcase (lebar)' },
  { key: 'closing', label: 'Latar Penutup (landscape)' },
];

export function AdditionalPhotos({ page, onUpdateLocal }: { page: { id: string; backgrounds?: Backgrounds; gallery?: string[] }; onUpdateLocal: (data: { backgrounds?: Backgrounds; gallery?: string[] }) => void }) {
  const [busy, setBusy] = useState<string | null>(null);
  const busyRef = useRef(false);
  const photoState = useRef({ backgrounds: page.backgrounds || {}, gallery: page.gallery || [] });

  async function run(label: string, operation: () => Promise<void>) {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(label);
    try { await operation(); } catch (error) { toast.error(error instanceof Error ? error.message : 'Gagal menyimpan foto'); }
    finally { busyRef.current = false; setBusy(null); }
  }
  async function upload(file: File) {
    if (!file.type.startsWith('image/')) throw new Error('Pilih file gambar');
    if (file.size > 5 * 1024 * 1024) throw new Error('Ukuran foto maksimal 5MB');
    const dataUrl = await compressImage(file, { maxDimension: 1920, qualityPrimary: 0.8, maxSizeBytes: 600_000 });
    const blob = await (await fetch(dataUrl)).blob();
    const form = new FormData();
    form.append('file', blob, `${file.name.replace(/\.[^/.]+$/, '')}.jpg`);
    const response = await fetch('/api/upload', { method: 'POST', body: form });
    const json = await response.json();
    if (!response.ok || !json.success || !json.data?.url) throw new Error(json.error || 'Gagal mengunggah foto');
    return json.data.url as string;
  }
  async function save(change: { backgrounds?: Backgrounds; gallery?: string[] }) {
    const previous = photoState.current;
    photoState.current = { ...photoState.current, ...change };
    onUpdateLocal(change);
    try {
      const result = await updatePageAction(page.id, change);
      if (!result.success) throw new Error(result.error || 'Gagal menyimpan foto');
    } catch (error) {
      photoState.current = previous;
      onUpdateLocal(previous);
      throw error;
    }
    toast.success('Foto berhasil disimpan');
  }
  function uploadSlot(key: Slot, file?: File) {
    if (file) void run(key, async () => save({ backgrounds: { ...photoState.current.backgrounds, [key]: await upload(file) } }));
  }
  function uploadGallery(files: File[]) {
    if (!files.length) return;
    void run('gallery', async () => {
      if (photoState.current.gallery.length + files.length > 6) throw new Error('Maksimal 6 foto galeri');
      if (files.some(file => !file.type.startsWith('image/') || file.size > 5 * 1024 * 1024)) throw new Error('Pilih gambar berukuran maksimal 5MB');
      const uploaded: string[] = [];
      for (const file of files) uploaded.push(await upload(file));
      await save({ gallery: [...photoState.current.gallery, ...uploaded] });
    });
  }
  return <div className="space-y-5">
    <p className="text-sm leading-relaxed text-ink-muted">Foto terang dengan objek jelas paling bagus; teks otomatis diberi lapisan gelap agar tetap terbaca.</p>
    <div className="grid gap-3">
      {slots.map(({ key, label }) => <div key={key} className="rounded-xl border p-3" onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); uploadSlot(key, event.dataTransfer.files[0]); }}>
        <p className="mb-2 text-sm font-medium">{label}</p>
        <div className="flex items-center gap-3">
          <div className="relative flex h-20 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-soft">{page.backgrounds?.[key] ? <ProductImage src={page.backgrounds[key]!} alt={label} className="object-cover" sizes="96px" /> : <ImageIcon size={24} aria-hidden="true" />}</div>
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm"><Upload size={16} />{busy === key ? 'Mengunggah…' : page.backgrounds?.[key] ? 'Ganti' : 'Unggah'}<input className="sr-only" type="file" accept="image/*" disabled={!!busy} onChange={event => { uploadSlot(key, event.target.files?.[0]); event.target.value = ''; }} /></label>
            {page.backgrounds?.[key] && <button type="button" className="min-h-11 rounded-lg border px-3 text-sm" disabled={!!busy} onClick={() => void run(key, async () => { const next = { ...photoState.current.backgrounds }; delete next[key]; await save({ backgrounds: next }); })}>Hapus</button>}
          </div>
        </div>
        <p className="mt-2 text-xs text-ink-muted">Tarik foto ke sini. Maksimal 5MB.</p>
      </div>)}
    </div>
    <div className="space-y-3"><div className="flex items-center justify-between gap-2"><p className="text-sm font-medium">Galeri ({(page.gallery || []).length}/6)</p><label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm"><Upload size={16} />{busy === 'gallery' ? 'Mengunggah…' : 'Unggah foto'}<input className="sr-only" type="file" accept="image/*" multiple disabled={!!busy} onChange={event => { uploadGallery(Array.from(event.target.files || [])); event.target.value = ''; }} /></label></div>
      <div className="grid grid-cols-2 gap-3">{(page.gallery || []).map((url, index) => <div key={`${url}-${index}`} className="overflow-hidden rounded-xl border"><div className="relative aspect-square"><ProductImage src={url} alt={`Foto galeri ${index + 1}`} className="object-cover" sizes="160px" /></div><div className="flex justify-center"><button type="button" aria-label={`Naikkan foto ${index + 1}`} disabled={!!busy || index === 0} className="p-3 disabled:opacity-30" onClick={() => void run('gallery', async () => { const items = [...photoState.current.gallery]; [items[index - 1], items[index]] = [items[index], items[index - 1]]; await save({ gallery: items }); })}><ArrowUp size={16} /></button><button type="button" aria-label={`Turunkan foto ${index + 1}`} disabled={!!busy || index === (page.gallery || []).length - 1} className="p-3 disabled:opacity-30" onClick={() => void run('gallery', async () => { const items = [...photoState.current.gallery]; [items[index + 1], items[index]] = [items[index], items[index + 1]]; await save({ gallery: items }); })}><ArrowDown size={16} /></button><button type="button" aria-label={`Hapus foto ${index + 1}`} disabled={!!busy} className="p-3" onClick={() => void run('gallery', async () => save({ gallery: photoState.current.gallery.filter((_, i) => i !== index) }))}><Trash2 size={16} /></button></div></div>)}</div>
    </div>
  </div>;
}
