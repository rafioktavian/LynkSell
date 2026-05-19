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

    const prompt = `Analisis foto produk e-commerce. Return JSON:
{ 
  "nama_produk": "string",
  "kategori": "string", 
  "target_pembeli": "string", 
  "keunggulan_visual": ["string"], 
  "tone_warna": "string", 
  "page_slug_suggestion": "string" 
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
