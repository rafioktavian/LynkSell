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

    if (!fileElement) {
      return NextResponse.json({ success: false, error: 'No fileElement in formData' }, { status: 400 });
    }
    
    if (typeof fileElement === 'string') {
      return NextResponse.json({ success: false, error: 'fileElement is a string, not a file' }, { status: 400 });
    }

    const file = fileElement as unknown as File;

    if (!file.type || !file.type.startsWith('image/')) {
      return NextResponse.json({ success: false, error: `Invalid file type: ${file.type}` }, { status: 400 });
    }

    // size max 5MB
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ success: false, error: 'File size exceeds 5MB' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    // Path: products/{userId}/{Date.now()}-{sanitized_filename}
    const sanitizedName = file.name ? file.name.replace(/[^a-zA-Z0-9.\-_]/g, '') : 'uploaded_image.png';
    const filePath = `products/${session.user.id}/${Date.now()}-${sanitizedName}`;

    const adminStorage = getAdminStorage();
    // Use the bucket provisioned for this Firebase project. Constructing a
    // guessed bucket name can target a different project resource (or trigger
    // bucket creation, which requires billing to be enabled).
    const bucketName =
      process.env.FIREBASE_STORAGE_BUCKET ||
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
      adminStorage.app.options.storageBucket;
    
    if (!bucketName) {
      throw new Error("No storageBucket configured");
    }

    const bucket = adminStorage.bucket(bucketName);
    
    const bucketFile = bucket.file(filePath);

    // Set public: true dan contentType
    await bucketFile.save(buffer, {
      metadata: { contentType: file.type },
      public: true,
    });

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
    
    // Return { success: true, data: { url: publicUrl } }
    return NextResponse.json({ success: true, data: { url: publicUrl } });
  } catch (err: any) {
    console.error('[LynkSell] /api/upload error:', err);
    const message = String(err?.message || 'Internal Server Error');
    const billingDisabled = /billing account.*disabled|accountdisabled/i.test(message);

    return NextResponse.json(
      {
        success: false,
        error: billingDisabled
          ? 'Google Cloud Billing untuk project Firebase belum aktif. Aktifkan billing pada project yang memiliki bucket Storage, lalu coba upload kembali.'
          : message,
      },
      { status: billingDisabled ? 503 : 500 },
    );
  }
}
