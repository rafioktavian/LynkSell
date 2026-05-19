import { z } from "zod";

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
