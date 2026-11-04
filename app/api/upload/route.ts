import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { cloudinaryUserFolder } from '@/lib/cloudinary';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (!checkRateLimit(`upload_${getClientIP(req)}`, 30, 60000)) {
      return NextResponse.json({ success: false, error: 'Terlalu banyak permintaan' }, { status: 429 });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !/^[a-z0-9-]+$/i.test(cloudName) || !apiKey || !apiSecret) {
      return NextResponse.json({ success: false, error: 'Cloudinary belum dikonfigurasi di server.' }, { status: 503 });
    }

    const formData = await req.formData();
    const file = formData.get('file');
    if (!(file instanceof File) || !file.type.startsWith('image/')) {
      return NextResponse.json({ success: false, error: 'Pilih file gambar yang valid.' }, { status: 400 });
    }
    if (!file.size || file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'Ukuran gambar harus lebih dari 0 dan maksimal 5MB.' }, { status: 400 });
    }

    const upload = new FormData();
    upload.set('file', file);
    upload.set('public_id', `products/${cloudinaryUserFolder(session.user.id)}/${randomUUID()}`);
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      headers: { Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}` },
      body: upload,
      signal: AbortSignal.timeout(30000),
    });
    const result = await response.json();
    if (!response.ok || typeof result.secure_url !== 'string') {
      console.error('[LynkSell] Cloudinary upload failed:', response.status, result?.error?.message);
      return NextResponse.json({ success: false, error: 'Gagal mengunggah foto ke Cloudinary. Silakan coba lagi.' }, { status: 502 });
    }
    return NextResponse.json({ success: true, data: { url: result.secure_url } });
  } catch (error) {
    console.error('[LynkSell] /api/upload error:', error);
    return NextResponse.json({ success: false, error: 'Upload foto gagal. Periksa koneksi server dan coba lagi.' }, { status: 503 });
  }
}
