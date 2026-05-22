import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { callGeminiText } from '@/lib/gemini';
import { parseGeminiJSONArray } from '@/lib/parse-gemini';
import { FALLBACK_TESTIMONIALS } from '@/lib/fallbacks';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const ip = getClientIP(req);
    // Auth check + rate limit (10 req/menit)
    if (!checkRateLimit(`testimonials_${ip}`, 10, 60000)) {
      return NextResponse.json({ success: false, error: 'Terlalu banyak permintaan. Coba lagi nanti.' }, { status: 429 });
    }

    const body = await req.json();
    const { productName, kategori, targetPembeli, harga, keunggulan } = body;

    const prompt = `Generate 3 testimoni pembeli untuk produk "${productName}" (Kategori: ${kategori}, Harga: ${harga}, Untuk: ${targetPembeli}).
Informasi keunggulan produk: ${keunggulan || "Tidak ada detail spesifik"}

Saya butuh testimoni yang terdengar SANGAT NATURAL, MANUSIAWI, dan BENAR-BENAR me-review keunggulan/informasi produk tersebut.

ATURAN WAJIB dalam prompt:
- Testimoni HARUS nyambung dengan "keunggulan produk" dan "nama produk". Ceritakan pengalaman mereka yang merasa terbantu oleh fitur/keunggulan produk.
- BOLEH pakai singkatan: 'bgt', 'sih', 'ga', 'udah', 'tp', 'krn', 'emg'
- 3 angle berbeda: Misalnya 1 tentang kualitas produk / fungsi produk, 1 tentang service & pengiriman, 1 tentang harga & kenyamanan.
- Nama Indonesia realistis: campuran gender, bisa pakai inisial ("Rina S.", "Mas Fajar")
- Kota bervariasi: Jakarta, Surabaya, Medan, Makassar, Semarang, Bandung, Palembang, Yogyakarta
- HINDARI: "luar biasa", "sangat puas", "produk terbaik", "kualitas terbaik" — terlalu kaku. Gunakan bahasa kasual sehari-hari (contoh: "mantap", "ternyata beneran enak", "pas banget di aku").

Return JSON array secara MURNI (tanpa backticks): 
[
  { 
    "name": "string", 
    "location": "string", 
    "rating": 5, 
    "text": "string (komentar panjang 2-3 kalimat yang spesifik menjelaskan pengalaman terkait fitur produk)", 
    "source": "ai" 
  }
]`;

    const rawText = await callGeminiText(prompt);

    if (!rawText) {
      return NextResponse.json({ success: true, data: FALLBACK_TESTIMONIALS });
    }

    const parsed = parseGeminiJSONArray(rawText, []);
    
    // Validasi setiap item, set id dan createdAt
    const data = (parsed.length > 0 ? parsed : FALLBACK_TESTIMONIALS).map((t: any, i: number) => ({
      id: crypto.randomUUID(),
      name: t?.name ?? `Pembeli ${i + 1}`,
      location: t?.location ?? 'Indonesia',
      rating: typeof t?.rating === 'number' ? Math.min(5, Math.max(1, t.rating)) : 5,
      text: t?.text ?? 'Produknya mantap banget, nggak nyesel!',
      avatarUrl: null,
      source: 'ai' as const,
      createdAt: Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 3) // random dalam 3 hari terakhir
    }));

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('[LynkSell] /api/ai/testimonials error:', err);
    // Jika error → return fallback data
    return NextResponse.json({ success: true, data: FALLBACK_TESTIMONIALS });
  }
}
