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

ATURAN KERAS ANGGARAN TEKS:
- Gunakan bahasa Indonesia natural, kalimat pendek, kata kerja aktif, tanpa jargon atau tanda seru berderet.
- headline: maksimal 6 kata dan 40 karakter. Satu pernyataan manfaat, bukan pertanyaan panjang. Arah contoh: "Ngopi Jadi Lebih Istimewa."
- subheadline: satu kalimat, maksimal 90 karakter.
- pain_points: tepat 2 item, masing-masing maksimal 70 karakter. Tulis sebagai pertanyaan atau pernyataan singkat.
- solution_intro: maksimal 45 karakter. Arah contoh: "Kenalan sama ${nama_produk}."
- benefits: tepat 3 atau 4 item. title maksimal 22 karakter; desc maksimal 60 karakter dalam satu kalimat. Pakai hanya fakta dari data produk. Jangan menambah manfaat atau jaminan yang tidak disebutkan.
- urgency_text: maksimal 60 karakter. Isi hanya jika data memberi alasan nyata; selain itu gunakan string kosong.
- cta_button: maksimal 28 karakter. Arah contoh: "Pesan via WhatsApp".
- whatsapp_message: maksimal 2 kalimat pendek, tanpa emoji atau klaim tambahan.
- Jangan mengarang harga, hasil, jaminan, stok, waktu, atau angka. Jika fakta tidak tersedia, hilangkan klaimnya.
- HANYA output JSON dengan kunci yang ditentukan, tanpa teks lain.`;

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
