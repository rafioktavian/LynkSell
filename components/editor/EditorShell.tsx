'use client';

import { useCallback, useState } from 'react';
import { Eye, SlidersHorizontal } from 'lucide-react';
import { EditorPanel } from './EditorPanel';
import { PreviewFrame } from './PreviewFrame';

export function EditorShell({ pageData }: { pageData: any }) {
  const [localPage, setLocalPage] = useState(pageData);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const handleUpdateLocal = useCallback((updates: any) => {
    setLocalPage((prev: any) => ({ ...prev, ...updates }));
  }, []);
  return <main aria-label="Editor halaman produk" className="flex h-[calc(100dvh-76px)] min-h-[420px] w-full flex-none flex-col overflow-hidden bg-surface-soft">
    <div className="flex shrink-0 border-b bg-white p-2 lg:hidden" role="group" aria-label="Tampilan editor">
      {([{ id: 'editor', label: 'Sunting halaman', Icon: SlidersHorizontal }, { id: 'preview', label: 'Pratinjau', Icon: Eye }] as const).map(({ id, label, Icon }) => <button key={id} type="button" aria-pressed={activeTab === id} onClick={() => setActiveTab(id)} className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full text-xs font-medium ${activeTab === id ? 'bg-surface-soft text-ink' : 'text-ink-muted'}`}><Icon size={16} aria-hidden="true" />{label}</button>)}
    </div>
    <div className="flex min-h-0 flex-1">
      <div className={`min-h-0 w-full shrink-0 border-r lg:w-[380px] xl:w-[420px] ${activeTab === 'editor' ? 'block' : 'hidden lg:block'}`}><EditorPanel page={localPage} onUpdateLocal={handleUpdateLocal} /></div>
      <div className={`min-h-0 min-w-0 flex-1 ${activeTab === 'preview' ? 'block' : 'hidden lg:block'}`}><PreviewFrame page={localPage} /></div>
    </div>
  </main>;
}
