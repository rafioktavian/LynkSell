# LynkSell — catatan redesign UI

Perubahan dikerjakan pada lapisan presentasi di checkout ini. Pola yang diambil dari referensi adalah hierarki judul, ruang antarseksi, navigasi sticky, dan ritme scroll. Tidak ada aset, logo, font, atau copy Apple yang digunakan.

Repository memakai Next.js 16, React 19, dan **Tailwind 3.4**. Versi Tailwind dipertahankan; tidak ada perubahan `package.json` atau lockfile dan tidak ada dependensi runtime baru.

## Perubahan per file

### 1. Design tokens

| File | Perubahan |
| --- | --- |
| `app/globals.css` | Token tipografi, spacing, radius, bayangan, focus ring, reduced motion, serta palet produk yang terisolasi dari UI aplikasi. CSS section produk, marketing, dan swatch ditambahkan pada tahap terkait. |
| `tailwind.config.ts` | Memetakan surface, ink, brand, spacing section, radius, dan easing ke token. |
| `app/layout.tsx` | Geist melalui `next/font`, satu keluarga sans; menghapus landmark `main` bersarang. |

### 2. Halaman produk dan preview

| File | Perubahan |
| --- | --- |
| `components/landing/LandingPageRenderer.tsx` | Sub-nav kaca; hero terpusat; statement pain points; bento benefits; showcase crop dari foto yang sama; ulasan scroll-snap; label sumber AI; penutup dan CTA bawah mobile. Section kosong dihilangkan. Struktur heading menyesuaikan data parsial. Tujuan dan pesan `waLink` dipertahankan. |
| `components/editor/PreviewFrame.tsx` | Portal React ke iframe dengan CSS/font aplikasi, viewport HP/desktop yang terpisah, desktop diskalakan agar muat, sticky CTA tetap di dalam preview, dan navigasi anchor ditangani dalam dokumen preview. |
| `components/presentation/MotionSurface.tsx` | Satu IntersectionObserver per permukaan; enhancement setelah SSR, konten tetap terlihat tanpa JavaScript; observer memakai dokumen pemilik untuk mendukung iframe dan reduced motion. |
| `components/presentation/ProductImage.tsx` | `next/image`, ukuran eksplisit dari container, priority hero, `sizes`, dan fallback ketika gambar gagal. URL di luar daftar optimizer yang sudah ada memakai `unoptimized` agar sumber foto lama tetap dapat ditampilkan. |
| `lib/presentation.ts` | Definisi palet dan swatch bersama, validasi hex, perhitungan foreground tombol berdasarkan luminans, serta pembersihan emoji saat render. Tidak memutasi data tersimpan. |
| `scripts/verify-ui.cjs` | Matriks SSR lengkap/minimal/parsial, invariant link WhatsApp, satu sumber gambar, ikon fallback aman, label AI, urutan heading data parsial, dan kontras palet. Opsi `--review` menghasilkan artefak HTML mandiri dari CSS produksi. |

### 3. Marketing

| File | Perubahan |
| --- | --- |
| `components/landing/LynksellLandingClient.tsx` | Mengganti implementasi monolitik dengan komposisi komponen marketing aktif. Render konten di server, interaksi nav dan reveal di batas client kecil. |
| `components/landing/Navbar.tsx` | Nav kaca sticky, tautan aktif ke section dan halaman, menu mobile dengan label dan status aksesibel. |
| `components/landing/HeroSection.tsx` | Judul besar, narasi satu foto ke halaman dalam 30 detik, CTA daftar dan anchor demo. |
| `components/landing/DemoVisual.tsx` | Komposisi foto → halaman, memakai sumber foto yang sama dan diberi label ilustrasi. |
| `components/landing/HowItWorks.tsx` | Tiga langkah zig-zag dengan ilustrasi upload, detail, dan publikasi. |
| `components/landing/FeaturesSection.tsx` | Bento fitur: tanpa komisi, tema, mobile, WhatsApp, dan kunjungan. |
| `components/landing/Testimonials.tsx` | Contoh penggunaan menurut jenis usaha; mengganti kutipan dan statistik lama yang tidak memiliki sumber terverifikasi. |
| `components/landing/CTABanner.tsx` | CTA akhir dengan satu tindakan yang jelas. |
| `components/landing/Footer.tsx` | Footer ringkas dengan tautan produk, privasi, syarat, dan kontak. |
| `public/demo-product.jpg` | Salinan lokal foto ilustrasi yang sudah dirujuk project sebelumnya. Sumber: `https://images.unsplash.com/photo-1620916566398-39f1143ab7be`. Bukan aset Apple. |

### 4. Dashboard, wizard, editor

| File | Perubahan |
| --- | --- |
| `components/dashboard/DashboardHeader.tsx` | Header kaca, identitas toko, salin URL, dan logout dengan fungsi yang sama. |
| `components/dashboard/DashboardList.tsx` | Grid `PageCard` dan empty state dengan ajakan membuat halaman pertama. |
| `components/dashboard/PageCard.tsx` | Thumbnail produk, status, kunjungan, tanggal terbit berzona Jakarta, link edit/lihat/salin, dan dialog hapus. Tetap memakai action hapus lama. |
| `components/dashboard/StatsBar.tsx` | Empat metrik dalam kartu netral; perhitungan tetap. |
| `components/wizard/WizardShell.tsx` | Progress tipis, label tiga langkah, transisi opacity/transform; state dan urutan langkah tetap. |
| `components/wizard/Step1Upload.tsx` | Drag-and-drop dan pemilih file memakai proses kompresi/analisis yang sama; pratinjau dan status aksesibel. |
| `components/wizard/Step2Details.tsx` | Hierarki form, keyboard telepon/numerik, swatch preset bersama, dan URL responsif. |
| `components/wizard/Step3Generating.tsx` | Presentasi proses generasi, status live, progress transform, serta state error. Proses upload, AI, create, dan redirect tetap. |
| `components/editor/EditorShell.tsx` | Panel kiri dan preview kanan dengan tinggi viewport, tab mobile, callback pembaruan lokal yang stabil. |
| `components/editor/EditorPanel.tsx` | Accordion, label form, swatch, pilihan ikon berbahasa Indonesia, foto produk, serta bar simpan/publish. Action dan payload lama tetap. |
| `components/editor/TestimonialManager.tsx` | Inisial menggantikan avatar eksternal, label ulasan contoh, kontrol urutan/edit/hapus berukuran sentuh dan memiliki nama aksesibel. Action lama tetap. |
| `components/editor/CelebrationModal.tsx` | Ikon Lucide, QR melalui `next/image`, dan menghormati reduced motion. |
| `components/presentation/ThemePicker.tsx` | Swatch memakai palet yang sama dengan renderer; empat preset dan aksen hex kustom. |
| `components/ui/button.tsx` | Tombol pill dan tinggi sentuh minimal 44px. |
| `components/ui/input.tsx` | Input lebih lega, tinggi minimal 44px, radius, dan focus ring yang didukung Tailwind terpasang. |
| `components/ui/textarea.tsx` | Padding, radius, tinggi, dan focus ring konsisten. |
| `components/ui/dialog.tsx` | Dialog, overlay, tombol tutup, serta transisi sesuai token dan sintaks Tailwind terpasang. |
| `app/(dashboard)/dashboard/page.tsx` | Hanya JSX/class tampilan dashboard. Query, auth, data, dan perhitungan tidak berubah. |
| `app/(dashboard)/dashboard/new/page.tsx` | Hanya layout pembungkus wizard. |
| `app/(dashboard)/dashboard/[pageId]/edit/page.tsx` | Hanya warna permukaan pembungkus editor. |

Warna kustom dipilih di editor setelah halaman dibuat. Wizard tetap menerima empat preset karena validasi yang sudah ada hanya menerima empat nama tersebut. Validasi dan skema tidak diubah; wizard menampilkan penjelasan singkat bahwa kustom tersedia di editor.

## Verifikasi dan batasnya

- Build dan lint dijalankan sesudah setiap tahap. Lint awal memiliki empat warning gambar lama; hasil akhir bersih tanpa error maupun warning.
- `node scripts/verify-ui.cjs`: 27 kombinasi SSR dari tema elegant, bold, fresh, luxury, beberapa hex terang/gelap/pendek, dan nilai tema tidak valid, masing-masing dengan data lengkap, minimal, dan parsial. Ada pemeriksaan tambahan untuk heading dan navigasi pada data yang sangat sedikit.
- Penghitungan kontras teks utama, muted, dan tombol preset mencapai WCAG AA. Foreground tombol hex dipilih dari hitam/putih berdasarkan rasio kontras. Ini bukan pengganti audit aksesibilitas visual menyeluruh.
- Smoke test server produksi lokal: `/`, `/templates`, dan `/login` mengembalikan HTTP 200; `/dashboard` tanpa sesi tetap mengarah ke login (HTTP 307). Optimizer `next/image` untuk foto lokal mengembalikan WebP HTTP 200, sekitar 10,5 KB pada lebar 640px.
- File API AI, Server Actions, auth, Firestore, `lib/validations.ts`, konfigurasi TypeScript asli, serta dependensi tidak berubah.
- Verifikasi lanjutan tersedia di [ui-quality.md](ui-quality.md): Lighthouse marketing produksi mobile 96, desktop 100; 30 fixture Chrome mendapat aksesibilitas 100. Tes interaksi DOM juga lolos. Performa halaman produk dengan backend nyata dan interaksi end-to-end menggunakan akun asli belum diukur.
- Animasi scroll merupakan enhancement CSS: browser tanpa dukungan scroll timeline menampilkan gambar statis. Reduced motion mematikan animasi dan reveal.

Jalankan ulang:

```sh
npm run lint
npm run build
node scripts/verify-ui.cjs
node scripts/verify-ui.cjs --review /tmp/lynksell-ui-review.html
```

Artefak review berisi contoh statis, lima tema, data lengkap/minimal, lebar 360/390/768/1280px, dan pemilih aksen kustom. Link eksternal dimatikan pada artefak tersebut. Interaksi aplikasi tetap perlu diverifikasi di server lokal.

Verifikasi yang masih memerlukan lingkungan/akun nyata: penyimpanan dan publikasi dengan akun uji, pengukuran Lighthouse halaman produk yang terpublikasi dengan backend, serta pemeriksaan keyboard dan screen reader manual. Hasil screenshot dan audit otomatis, serta cakupan fixture, tercatat di [ui-quality.md](ui-quality.md).
