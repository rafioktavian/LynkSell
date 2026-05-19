'use client';

export interface CompressOptions {
  maxDimension?: number;
  qualityPrimary?: number;
  qualityFallback?: number;
  maxSizeBytes?: number;
  onProgress?: (msg: string) => void;
}

export async function compressImage(file: File, options?: CompressOptions): Promise<string> {
  const maxDimension = options?.maxDimension ?? 800;
  const qualityPrimary = options?.qualityPrimary ?? 0.75;
  const qualityFallback = options?.qualityFallback ?? 0.50;
  const maxSizeBytes = options?.maxSizeBytes ?? 200_000;
  const onProgress = options?.onProgress;

  if (!file.type.startsWith('image/')) {
    throw new Error('File harus berupa gambar (image/*)');
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Ukuran gambar maksimal 10MB');
  }

  onProgress?.("📸 Membaca...");

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        onProgress?.("⚙️ Mengompresi...");
        
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height / width) * maxDimension);
            width = maxDimension;
          } else {
            width = Math.round((width / height) * maxDimension);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Gagal inisialisasi modul kompresi (Canvas)'));
        }

        ctx.drawImage(img, 0, 0, width, height);

        let dataUrl = canvas.toDataURL('image/jpeg', qualityPrimary);
        
        // Perkiraan base64 ke bytes (dikurangi padding metadata "data:image/jpeg;base64,")
        let approxBytes = Math.round((dataUrl.length - 23) * 0.75);

        if (approxBytes > maxSizeBytes) {
          dataUrl = canvas.toDataURL('image/jpeg', qualityFallback);
          approxBytes = Math.round((dataUrl.length - 23) * 0.75);
        }

        const finalKb = Math.round(approxBytes / 1024);
        onProgress?.(`✅ Siap ~${finalKb}kb`);
        
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Gagal memuat gambar untuk proses kompresi'));
    };
    reader.onerror = () => reject(new Error('Gagal membaca file tersebut'));
  });
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}
