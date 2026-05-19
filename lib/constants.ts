interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
}

export const COLOR_SCHEMES: Record<string, ColorScheme> = {
  elegant: {
    primary: "bg-slate-900",
    secondary: "bg-slate-100",
    accent: "bg-amber-600",
    text: "text-slate-900",
    background: "bg-white",
  },
  bold: {
    primary: "bg-red-600",
    secondary: "bg-red-50",
    accent: "bg-neutral-900",
    text: "text-neutral-900",
    background: "bg-white",
  },
  fresh: {
    primary: "bg-teal-600",
    secondary: "bg-teal-50",
    accent: "bg-emerald-500",
    text: "text-slate-800",
    background: "bg-white",
  },
  luxury: {
    primary: "bg-zinc-900",
    secondary: "bg-zinc-100",
    accent: "bg-yellow-600",
    text: "text-zinc-900",
    background: "bg-zinc-50",
  },
};

export const APP_NAME = "LynkSell";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
export const APP_TAGLINE = "Bikin Landing Page Jualan dalam 30 Detik.";

export const IMAGE_CONFIG = {
  MAX_DIMENSION: 800,
  QUALITY_PRIMARY: 0.75,
  QUALITY_FALLBACK: 0.5,
  MAX_SIZE_BYTES: 200 * 1024,
};

export const DEMO_PAGES = [
  {
    pageId: "demo-1",
    brandSlug: "fashion-store",
    pageSlug: "baju-lebaran",
    productName: "Baju Lebaran Pria Koko Premium",
  },
  {
    pageId: "demo-2",
    brandSlug: "gadget-hub",
    pageSlug: "tws-pro-5",
    productName: "Earphone TWS Pro 5",
  },
  {
    pageId: "demo-3",
    brandSlug: "snack-time",
    pageSlug: "keripik-pedas",
    productName: "Keripik Kaca Pedas Daun Jeruk",
  },
];
