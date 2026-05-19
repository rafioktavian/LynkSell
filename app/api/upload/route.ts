import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getAdminStorage } from '@/lib/firebase-admin';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const ip = getClientIP(req);
    // Auth check + rate limit (30 req/menit)
    if (!checkRateLimit(`upload_${ip}`, 30, 60000)) {
      return NextResponse.json({ success: false, error: 'Terlalu banyak permintaan' }, { status: 429 });
    }

    const formData = await req.formData();
    const fileElement = formData.get('file');

    if (!fileElement || !(fileElement instanceof Blob)) {
      return NextResponse.json({ success: false, error: 'Gagal upload. Coba lagi.' }, { status: 400 });
    }

    const file = fileElement as File;

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ success: false, error: 'Gagal upload. Coba lagi.' }, { status: 400 });
    }

    // size max 5MB
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ success: false, error: 'Gagal upload. Coba lagi.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    // Path: products/{userId}/{Date.now()}-{sanitized_filename}
    const sanitizedName = file.name ? file.name.replace(/[^a-zA-Z0-9.\-_]/g, '') : 'uploaded_image.png';
    const filePath = `products/${session.user.id}/${Date.now()}-${sanitizedName}`;

    const adminStorage = getAdminStorage();
    const bucket = adminStorage.bucket();
    const bucketFile = bucket.file(filePath);

    // Set public: true dan contentType
    await bucketFile.save(buffer, {
      metadata: { contentType: file.type },
      public: true,
    });

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
    
    // Return { success: true, data: { url: publicUrl } }
    return NextResponse.json({ success: true, data: { url: publicUrl } });
  } catch (err) {
    console.error('[LynkSell] /api/upload error:', err);
    // Jika error → return { success: false, error: 'Gagal upload. Coba lagi.' }
    return NextResponse.json({ success: false, error: 'Gagal upload. Coba lagi.' }, { status: 500 });
  }
}
