import { z } from "zod";
import { cloudinaryUserFolder } from './cloudinary';

export const productPhotosSchema = (userId: string) => {
  const url = z.string().url().refine(value => {
    try {
      const parsed = new URL(value);
      const segments = decodeURIComponent(parsed.pathname).split('/');
      if (parsed.protocol !== 'https:' || parsed.port || parsed.username || parsed.password || parsed.search || parsed.hash) return false;
      const validSegments = (start: number) => segments.slice(start).every(part => part && part !== '.' && part !== '..');
      if (parsed.hostname === 'storage.googleapis.com') {
        return segments[2] === 'products' && segments[3] === userId && segments.length >= 5 && validSegments(4);
      }
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      return !!cloudName && parsed.hostname === 'res.cloudinary.com' && segments[1] === cloudName && segments[2] === 'image' && segments[3] === 'upload' && /^v\d+$/.test(segments[4] || '') && segments[5] === 'products' && segments[6] === cloudinaryUserFolder(userId) && segments.length === 8 && validSegments(7);
    } catch { return false; }
  }, 'URL foto harus berasal dari penyimpanan produk Anda');
  return z.object({
    productImageUrl: url.optional(),
    backgrounds: z.object({ hero: url.optional(), benefits: url.optional(), showcase: url.optional(), closing: url.optional() }).strict().optional(),
    gallery: z.array(url).max(6, 'Maksimal 6 foto galeri').optional(),
  }).strict();
};

export const RegisterSchema = z.object({
  name: z.string().min(2, "Nama terlalu pendek"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const LoginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const BrandSetupSchema = z.object({
  brandName: z.string().min(2, "Nama brand terlalu pendek"),
});

export const PageDetailsSchema = z.object({
  productName: z.string().min(2, "Nama produk minimal 2 karakter"),
  targetPembeli: z.string().min(5, "Deskripsikan target pembeli lebih detail"),
  harga: z.string().min(1, "Harga tidak boleh kosong"),
  whatsappNumber: z.string().min(9, "Nomor WhatsApp terlalu pendek").regex(/^[0-9]+$/, "Hanya boleh angka"),
  colorScheme: z.enum(["elegant", "bold", "fresh", "luxury"]),
});

export const UpdateCopySchema = z.object({
  headline: z.string().min(1, "Headline wajib diisi"),
  subheadline: z.string().min(1, "Subheadline wajib diisi"),
  pain_points: z.array(z.string()).min(1, "Minimal 1 pain point"),
  solution_intro: z.string().min(1, "Intro wajib diisi"),
  benefits: z.array(z.object({
    icon: z.string(),
    title: z.string(),
    desc: z.string(),
  })).min(1, "Minimal 1 benefit"),
  urgency_text: z.string(),
  cta_button: z.string().min(1, "Tombol CTA wajib diisi"),
  whatsapp_message: z.string().min(1, "Pesan WA wajib diisi"),
});

export const ManualTestimonialSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  location: z.string().min(2, "Kota/Lokasi minimal 2 karakter"),
  rating: z.number().min(1).max(5),
  text: z.string().min(5, "Testimoni terlalu pendek"),
});

export const UpdateSlugSchema = z.object({
  pageSlug: z.string().min(2, "URL/Slug minimal 2 karakter").regex(/^[a-z0-9-]+$/, "Hanya huruf kecil, angka, dan strip"),
});

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  avatarUrl: string | null;
  source: "manual" | "ai";
  createdAt: number;
}
