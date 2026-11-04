# LynkSell — verifikasi UI lanjutan

Diperiksa pada 3 November 2026. Audit Chrome dijalankan lewat Lighthouse CLI dengan profil pengujian terpisah. Tidak ada login otomatis, pembacaan profil pengguna, atau penulisan ke backend nyata.

## Halaman marketing: build produksi

| Ukuran | Performa | Aksesibilitas | Best practices | SEO | Laporan |
| --- | ---: | ---: | ---: | ---: | --- |
| mobile | 96 | 100 | 100 | 100 | [Lighthouse HTML](/tmp/lynksell-redesign/quality/marketing-mobile-final.report.html) |
| desktop | 100 | 100 | 100 | 100 | [Lighthouse HTML](/tmp/lynksell-redesign/quality/marketing-desktop-final.report.html) |

Lighthouse 12.8.2; throttling bawaan Lighthouse. Skor adalah hasil lokal satu kali pengukuran setelah build final, bukan jaminan skor semua deployment/perangkat.

| Metrik mobile | Hasil |
| --- | --- |
| First Contentful Paint | 1.0 s |
| Largest Contentful Paint | 2.6 s |
| Total Blocking Time | 80 ms |
| Cumulative Layout Shift | 0 |
| Speed Index | 1.0 s |

## Matriks komponen di Chrome

30 fixture memakai komponen React dan CSS produksi yang sama: 20 kombinasi produk (empat preset + hex kustom, data lengkap/minimal, HP/desktop), 8 layar aplikasi, dan 2 empty state dashboard. Fixture berada di luar project dan tidak menambah route aplikasi. Adapter gambar/Link/Server Actions diganti untuk isolasi; permintaan persistensi diblokir. Karena itu hasil ini memverifikasi presentasi dan aksesibilitas komponen, bukan performa Next.js/Firebase halaman produk terpublikasi.

| Fixture | Aksesibilitas | Best practices | Laporan |
| --- | ---: | ---: | --- |
| product-elegant-full-mobile | 100 | 100 | [HTML](/tmp/lynksell-redesign/quality/product-elegant-full-mobile.report.html) |
| product-elegant-full-desktop | 100 | 100 | [HTML](/tmp/lynksell-redesign/quality/product-elegant-full-desktop.report.html) |
| product-elegant-minimal-mobile | 100 | 100 | [HTML](/tmp/lynksell-redesign/quality/product-elegant-minimal-mobile.report.html) |
| product-elegant-minimal-desktop | 100 | 100 | [HTML](/tmp/lynksell-redesign/quality/product-elegant-minimal-desktop.report.html) |
| product-bold-full-mobile | 100 | 100 | [HTML](/tmp/lynksell-redesign/quality/product-bold-full-mobile.report.html) |
| product-bold-full-desktop | 100 | 100 | [HTML](/tmp/lynksell-redesign/quality/product-bold-full-desktop.report.html) |
| product-bold-minimal-mobile | 100 | 100 | [HTML](/tmp/lynksell-redesign/quality/product-bold-minimal-mobile.report.html) |
| product-bold-minimal-desktop | 100 | 100 | [HTML](/tmp/lynksell-redesign/quality/product-bold-minimal-desktop.report.html) |
| product-fresh-full-mobile | 100 | 100 | [HTML](/tmp/lynksell-redesign/quality/product-fresh-full-mobile.report.html) |
| product-fresh-full-desktop | 100 | 100 | [HTML](/tmp/lynksell-redesign/quality/product-fresh-full-desktop.report.html) |
| product-fresh-minimal-mobile | 100 | 100 | [HTML](/tmp/lynksell-redesign/quality/product-fresh-minimal-mobile.report.html) |
| product-fresh-minimal-desktop | 100 | 100 | [HTML](/tmp/lynksell-redesign/quality/product-fresh-minimal-desktop.report.html) |
| product-luxury-full-mobile | 100 | 100 | [HTML](/tmp/lynksell-redesign/quality/product-luxury-full-mobile.report.html) |
| product-luxury-full-desktop | 100 | 100 | [HTML](/tmp/lynksell-redesign/quality/product-luxury-full-desktop.report.html) |
| product-luxury-minimal-mobile | 100 | 100 | [HTML](/tmp/lynksell-redesign/quality/product-luxury-minimal-mobile.report.html) |
| product-luxury-minimal-desktop | 100 | 100 | [HTML](/tmp/lynksell-redesign/quality/product-luxury-minimal-desktop.report.html) |
| product-hex-eaff00-full-mobile | 100 | 100 | [HTML](/tmp/lynksell-redesign/quality/product-hex-eaff00-full-mobile.report.html) |
| product-hex-eaff00-full-desktop | 100 | 100 | [HTML](/tmp/lynksell-redesign/quality/product-hex-eaff00-full-desktop.report.html) |
| product-hex-eaff00-minimal-mobile | 100 | 100 | [HTML](/tmp/lynksell-redesign/quality/product-hex-eaff00-minimal-mobile.report.html) |
| product-hex-eaff00-minimal-desktop | 100 | 100 | [HTML](/tmp/lynksell-redesign/quality/product-hex-eaff00-minimal-desktop.report.html) |
| wizard-mobile | 100 | 100 | [HTML](/tmp/lynksell-redesign/quality/wizard-mobile.report.html) |
| wizard-desktop | 100 | 100 | [HTML](/tmp/lynksell-redesign/quality/wizard-desktop.report.html) |
| details-mobile | 100 | 100 | [HTML](/tmp/lynksell-redesign/quality/details-mobile.report.html) |
| details-desktop | 100 | 100 | [HTML](/tmp/lynksell-redesign/quality/details-desktop.report.html) |
| editor-mobile | 100 | 100 | [HTML](/tmp/lynksell-redesign/quality/editor-mobile.report.html) |
| editor-desktop | 100 | 100 | [HTML](/tmp/lynksell-redesign/quality/editor-desktop.report.html) |
| dashboard-mobile | 100 | 100 | [HTML](/tmp/lynksell-redesign/quality/dashboard-mobile.report.html) |
| dashboard-desktop | 100 | 100 | [HTML](/tmp/lynksell-redesign/quality/dashboard-desktop.report.html) |
| dashboard-empty-mobile | 100 | 100 | [HTML](/tmp/lynksell-redesign/quality/dashboard-empty-mobile.report.html) |
| dashboard-empty-desktop | 100 | 100 | [HTML](/tmp/lynksell-redesign/quality/dashboard-empty-desktop.report.html) |

## Perbaikan berdasarkan temuan

| File | Perubahan |
| --- | --- |
| `app/layout.tsx`, `public/favicon.svg` | Mengganti referensi favicon dan touch icon yang hilang dengan aset LynkSell SVG, sehingga tidak ada 404 favicon pada audit final. |
| `components/presentation/ThemePicker.tsx` | Menjaga warna kustom awal ketika pengguna memilih preset lalu kembali ke Kustom. |
| `components/landing/LandingPageRenderer.tsx` | Rating bintang memakai `role="img"` bersama label, sehingga atribut ARIA valid. |
| `components/wizard/Step1Upload.tsx` | Kontras pesan fallback diperkuat. |
| `components/wizard/Step2Details.tsx` | Teks konfirmasi WhatsApp digelapkan; memperbaiki rasio 3,29:1 yang ditemukan audit. |
| `components/wizard/WizardShell.tsx` | Memasang penampil notifikasi yang sudah tersedia di project. Pesan gagal upload kini terlihat. |
| `components/dashboard/DashboardHeader.tsx` | Nama aksesibel untuk logo mobile, label tombol yang mencakup teks terlihat, dan penampil notifikasi aplikasi. |
| `components/dashboard/PageCard.tsx` | Nama tautan thumbnail dan tombol salin mengikuti konten terlihat; kontras placeholder foto diperbaiki. |
| `scripts/verify-ui-interactions.cjs` | Tes integrasi DOM dengan fixture API/actions, tanpa dependensi runtime baru. |

## Interaksi yang diperiksa

- Preset, warna kustom awal/baru, dan kembali ke warna terakhir.
- File invalid, drag-and-drop valid, analisis, dan pratinjau foto. Pesan file invalid diperiksa benar-benar muncul di DOM.
- Wizard tiga langkah, kembali/lanjut mempertahankan data, payload dan redirect, serta satu kali pemanggilan generasi.
- Tab editor mobile, CSS dan konten iframe, anchor tetap dalam iframe, skip link memindahkan fokus keyboard, dan tombol desktop.
- Pembaruan teks/tema setelah debounce tanpa penyimpanan otomatis.
- Perubahan prefers-reduced-motion membuat konten reveal tetap terlihat.

Tes interaksi memakai jsdom: memeriksa state, event, dan pemanggilan handler, bukan geometri browser. Alur backend, auth, API AI, dan publikasi nyata tidak dijalankan. File implementasinya tidak berubah.

## Bukti dan cara menjalankan ulang

[Log interaksi](/tmp/lynksell-redesign/quality/interactions.log) · [SSR](/tmp/lynksell-redesign/quality/ssr.log) · [Build](/tmp/lynksell-redesign/quality/build.log) · [Lint](/tmp/lynksell-redesign/quality/lint.log)

[Marketing mobile](/tmp/lynksell-redesign/quality/marketing-mobile-final.jpg) · [Marketing desktop](/tmp/lynksell-redesign/quality/marketing-desktop-final.jpg) · [Editor desktop](/tmp/lynksell-redesign/quality/editor-desktop.jpg) · [Detail wizard mobile](/tmp/lynksell-redesign/quality/details-mobile.jpg) · [Dashboard mobile](/tmp/lynksell-redesign/quality/dashboard-mobile.jpg) · [Empty state](/tmp/lynksell-redesign/quality/dashboard-empty-mobile.jpg)

Screenshot Lighthouse digunakan sebagai bukti visual; screenshot penuh produk dengan unit `svh` dapat memanjang ketika alat mengubah tinggi viewport untuk capture. Skor aksesibilitas bukan pengganti pemeriksaan screen reader manual.

```sh
npm run lint
npm run build
node scripts/verify-ui.cjs
npm install --prefix /tmp/lynksell-ui-tools --no-save jsdom@26
NODE_PATH=/tmp/lynksell-ui-tools/node_modules node scripts/verify-ui-interactions.cjs
```

Lighthouse CLI dan jsdom/esbuild QA dipasang sementara di luar project. `package.json` dan lockfile tetap. Build Next dapat memperbarui tsconfig secara otomatis; konfigurasi TypeScript asli dikembalikan untuk menjaga cakupan diff.
