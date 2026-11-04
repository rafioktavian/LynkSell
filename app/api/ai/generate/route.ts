import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { callGeminiText } from '@/lib/gemini';
import { parseGeminiJSON } from '@/lib/parse-gemini';
import { FALLBACK_COPY } from '@/lib/fallbacks';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const ip = getClientIP(req);
    // Auth check + rate limit (10 req/menit)
    if (!checkRateLimit(`generate_${ip}`, 10, 60000)) {
      return NextResponse.json({ success: false, error: 'Terlalu banyak permintaan. Coba lagi nanti.' }, { status: 429 });
    }

    const body = await req.json();
    const { nama_produk, kategori, harga, target_pembeli, keunggulan, hasil_analisis, whatsapp } = body;

    const prompt = `Buat copy sales/landing page produk berdasarkan data berikut:
- Nama Produk: ${nama_produk}
- Kategori: ${kategori}
- Harga: ${harga}
- Target Pembeli: ${target_pembeli}
- Keunggulan: ${Array.isArray(keunggulan) ? keunggulan.join(', ') : keunggulan}
- Hasil Analisis Tambahan: ${JSON.stringify(hasil_analisis || {})}
- WhatsApp Contact: ${whatsapp}

Return HANYA JSON:
{ 
  "headline": "string", 
  "subheadline": "string", 
  "pain_points": ["string"], 
  "solution_intro": "string", 
  "benefits": [{"icon": "nama_icon_lucide", "title": "string", "desc": "string"}], 
  "urgency_text": "string", 
  "cta_button": "string", 
  "whatsapp_message": "string" 
}

ATURAN DAN REFERENSI KUALITAS: 
- Gunakan bahasa Indonesia natural.
- Formula Headline (pilih yang paling cocok):
  * Hasil + Waktu + Jaminan (contoh: "Kulit Glowing dalam 7 Hari — Dijamin atau Uang Kembali")
  * Empati + Solusi (contoh: "Akhirnya Serum yang Nggak Bikin Breakout — Cocok Buat Kulit Sensitif")
  * Spesifisitas yang mengejutkan (contoh: "Turun 3 Kg dalam Sebulan — Dengan Rutinitas 12 Menit Sehari")
- pain_points harus spesifik ke kategori produk ini, spesifik dan relatable seperti "Udah nyoba 5 serum vitamin C berbeda, harga mulai 50 ribu sampai 400 ribu, tapi kulit masih kusam dan belang-belang?".
- Benefits (deskripsi): Spesifik dan nyata. Hindari "Dibuat dari bahan-bahan alami pilihan", gunakan "Formula bebas paraben, SLS, dan alkohol. Dermatologically tested — aman dipakai daily tanpa cuti."
- urgency_text tidak boleh spammy. Hindari "BELI SEKARANG SEBELUM TERLAMBAT!!!!", gunakan yang lebih natural seperti "Batch bulan ini tinggal 31 botol. Biasanya habis sebelum Jumat."
- cta_button harus call-to-action yang menarik seperti "Klaim Harga Promo — Chat WhatsApp" atau "Pesan Sekarang, Dikirim Hari Ini".
- whatsapp_message harus terasa natural seperti obrolan orang asli, misal: "Halo kak 👋 Saya liat produknya di lynksell.vercel.app dan tertarik bgt sama [NAMA_PRODUK]. Boleh tanya dulu: Masih ada stok nggak? Kalau oke langsung order ya! 😊"
- Jangan terlalu formal, buat berkesan akrab dan membujuk.
- HANYA output JSON tanpa teks lain.`;

    const rawText = await callGeminiText(prompt);

    if (!rawText) {
      return NextResponse.json({ success: true, data: FALLBACK_COPY });
    }

    const data = parseGeminiJSON(rawText, FALLBACK_COPY);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('[LynkSell] /api/ai/generate error:', err);
    // Jika error → return fallback data
    return NextResponse.json({ success: true, data: FALLBACK_COPY });
  }
}
