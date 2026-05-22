import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { callGeminiVision } from '@/lib/gemini';
import { parseGeminiJSON } from '@/lib/parse-gemini';
import { FALLBACK_ANALYSIS } from '@/lib/fallbacks';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const ip = getClientIP(req);
    // Rate limit: 20 req/menit per IP
    if (!checkRateLimit(`analyze_${ip}`, 20, 60000)) {
      return NextResponse.json({ success: false, error: 'Terlalu banyak permintaan. Coba lagi nanti.' }, { status: 429 });
    }

    const body = await req.json();
    const { base64Image, mimeType = 'image/jpeg' } = body;

    if (!base64Image) {
      return NextResponse.json({ success: false, error: 'Image data missing' }, { status: 400 });
    }

    // Hapus data URI prefix jika ada
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

    const prompt = `Analisis foto produk e-commerce untuk pasar UMKM Indonesia secara mendalam. 
Anda harus bertindak sebagai copywriter dan product analyst expert. Evaluasi teks atau merek yang ada di dalam gambar dengan cermat.

Tugas Anda:
1. Identifikasi APA produk ini secara spesifik (jangan generik). Jika ada merek atau nama di kemasan, jadikan ini sebagai "productName".
2. Identifikasi "category" produk yang tepat (contoh: Kosmetik, Makanan, Minuman, Fashion, Elektronik).
3. Tentukan "targetPembeli" yang paling logis dan spesifik untuk produk ini (contoh: "Anak muda penyuka pedas", "Ibu rumah tangga").
4. Identifikasi 3-5 "keunggulan" produk yang terlihat dari gambar atau bisa disimpulkan dengan kuat dari jenis produknya.
5. Perkirakan "harga" standar di pasar jika memungkinkan, namun Anda dapat mengosongkannya jika ragu.

Return HANYA JSON MURNI dengan format berikut (jangan bungkus dengan backticks):
{ 
  "productName": "string spesifik dari info gambar",
  "category": "string kategori", 
  "targetPembeli": "string target audiens spesifik", 
  "keunggulan": ["string", "string", "string"], 
  "harga": "string (opsional)"
}`;

    const rawText = await callGeminiVision(base64Data, mimeType, prompt);

    if (!rawText) {
      return NextResponse.json({ success: true, data: FALLBACK_ANALYSIS });
    }

    const data = parseGeminiJSON(rawText, FALLBACK_ANALYSIS);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('[LynkSell] /api/ai/analyze error:', err);
    // Jika error apapun → return fallback data (app tidak boleh crash)
    return NextResponse.json({ success: true, data: FALLBACK_ANALYSIS }); 
  }
}
