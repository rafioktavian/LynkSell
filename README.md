# LynkSell - AI-Powered Landing Page Generator

LynkSell adalah generator landing page bertenaga AI untuk UMKM Indonesia. Cukup unggah foto produk, isi detail secara singkat, dan biarkan AI menulis headline, copywriting, serta testimoni otomatis untuk Anda. 

## Tech Stack
- **Framework:** Next.js 16 (App Router) + React 19
- **Database / Auth:** Firebase Firestore & Firebase Auth (lewat NextAuth.js / Auth.js v5)
- **AI:** Google Gemini (gemini-2.0-flash)
- **Styling:** Tailwind CSS v4 & shadcn/ui

## Setup Instructions

1. Clone repositori ini:
   ```bash
   git clone <repo-url>
   cd lynksell
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Setup Firebase
   - Buat project Firebase baru
   - Aktifkan Firestore (Database) dan Firebase Storage
   - Aktifkan Firebase Authentication (Google provider, dan/atau Email/Password)
   - Setup API Key dan Service Account dari "Project Settings -> Service Accounts" menjadi JSON.

4. Setup Google OAuth di Cloud Console
   - Buat kredensial OAuth 2.0 Client ID di Google Cloud Console
   - Masukkan ID dan Secret ke `.env.local`

5. Copy `.env.local.example` ke `.env.local` dan isi seluruh nilai yang dibutuhkan
   ```env
   # API Keys
   GEMINI_API_KEY=xxx

   # Auth
   AUTH_SECRET=xxx
   AUTH_GOOGLE_ID=xxx
   AUTH_GOOGLE_SECRET=xxx

   # Firebase Admin SDK (Untuk Server Actions / Route Handlers)
   FIREBASE_PROJECT_ID=xxx
   FIREBASE_CLIENT_EMAIL=xxx
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

   # Firebase Client SDK (Untuk Browser & Authentication)
   NEXT_PUBLIC_FIREBASE_API_KEY=xxx
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
   NEXT_PUBLIC_FIREBASE_APP_ID=xxx

   # Mode Demo
   NEXT_PUBLIC_DEMO_MODE=false
   ```

6. Jalankan mode development
   ```bash
   pnpm dev
   ```

7. **Deploy to Firebase App Hosting** (Opsional)
   - Anda bisa setup repository dengan GitHub
   - Buka portal Firebase App Hosting, pilih repo ini, lalu konfigurasi Secret Manager untuk Environment Variables Anda.

## Arsitektur Fitur AI & Cloud
- **Server Actions:** Seluruh mutasi data Firestore (pembuatan landing page, update, testimoni, dll) dilakukan murni server-side, dengan error handling robust dan rate-limiting.
- **AI SDK:** Seluruh request ke Gemini API tidak akan pernah diekspos ke publik (selalu di Route Handler `/api/ai/*`). File di-handle terpisah. Format output Gemini diproses aman dan akan _fallback_ secara halus (graceful downgrade) jika API limit.
- **Upload Image:** Menggunakan fungsi `compressImage` lokal sebelum multipart/form-data POST upload ke Storage Firebase menggunakan Admin SDK untuk bypass rules kompleks di client. URL referensi gambar yang disimpan adalah url Cloud Storage HTTPS bukan Base64.
