export function isDemoMode() {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
}

export function getDemoPage(fullSlug: string) {
  // Extract info from fullSlug (e.g. "fashion-store/baju-lebaran")
  const [brandSlug, pageSlug] = fullSlug.split('/');
  
  return {
    id: `demo-${brandSlug}-${pageSlug}`,
    userId: 'demo-user-id',
    brandSlug,
    pageSlug,
    fullSlug,
    productName: brandSlug === 'fashion-store' ? 'Baju Lebaran Pria Koko Premium' : 'Produk Demo',
    productImageUrl: null,
    copyData: {
      headline: "Headline Demo Terlihat Keren di Sini",
      subheadline: "Subheadline demo untuk produk abal-abal yang sangat menarik perhatian.",
      pain_points: [
        "Sering merasa kurang percaya diri?",
        "Susah mencari ukuran yang pas?",
        "Bahan cepat luntur?"
      ],
      solution_intro: "Kami hadir membawa solusi terbaik untuk Anda.",
      benefits: [
        { icon: "star", title: "Kualitas Premium", desc: "Dibuat dari bahan terbaik." },
        { icon: "truck", title: "Gratis Ongkir", desc: "Nikmati gratis pengiriman ke seluruh Indonesia." }
      ],
      urgency_text: "Promo terbatas! Diskon 50% hanya untuk hari ini.",
      cta_button: "Beli Sekarang",
      whatsapp_message: "Halo, saya tertarik dengan produk ini."
    },
    testimonials: [],
    colorScheme: "elegant",
    whatsappNumber: "6281234567890",
    harga: "Rp 150.000",
    targetPembeli: "Pria dewasa",
    status: "published",
    viewCount: 123,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export const MOCK_USER_SESSION = {
  user: {
    id: 'demo-user-id',
    name: 'Demo User',
    email: 'demo@lynksell.com',
    image: null,
    brandSlug: 'demo-brand'
  },
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
};
