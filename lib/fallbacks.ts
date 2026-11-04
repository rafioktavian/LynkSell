export const FALLBACK_COPY = {
  headline: "Rawat Kulit dengan Lembut",
  subheadline: "Perawatan sederhana untuk rutinitas kulitmu.",
  pain_points: [
    "Kulit terasa kusam setelah beraktivitas?",
    "Sulit menemukan perawatan yang cocok?"
  ],
  solution_intro: "Pilihan untuk perawatan kulit.",
  benefits: [
    {
      icon: "heart",
      title: "Rutinitas Kulit",
      desc: "Pilih sesuai rutinitas perawatan kulitmu."
    },
    {
      icon: "check",
      title: "Kenali Kebutuhan",
      desc: "Pertimbangkan kebutuhan kulit sebelum memilih."
    },
    {
      icon: "package",
      title: "Kenali Produknya",
      desc: "Baca informasi produk sebelum memesan."
    }
  ],
  urgency_text: "",
  cta_button: "Pesan via WhatsApp",
  whatsapp_message: "Halo, saya tertarik dengan produk ini. Bisa minta info?"
};

export const FALLBACK_ANALYSIS = {
  productName: "Produk Premium",
  category: "General",
  targetPembeli: "Semua orang yang membutuhkan kemudahan.",
  keunggulan: ["Kualitas Tinggi", "Desain Menarik", "Tahan Lama"],
  harga: "Rp 99.000"
};

export const FALLBACK_TESTIMONIALS = [
  {
    id: "fb-1",
    name: "Rina S.",
    location: "Jakarta Selatan",
    rating: 5,
    text: "Udah 2 minggu pake dan emg beda banget! Kulit aku yang biasanya kusam sekarang keliatan lebih cerah. Nggak nyangka secepet ini hasilnya 😭",
    avatarUrl: null,
    source: "ai" as const,
    createdAt: Date.now() - 86_400_000 * 4
  },
  {
    id: "fb-2",
    name: "Mas Fajar",
    location: "Surabaya",
    rating: 5,
    text: "Awalnya skeptis sih, tapi nyobain karena ada garansinya. Ternyata beneran kerasa bedanya. Seller juga fast respon dan packing rapiiii!",
    avatarUrl: null,
    source: "ai" as const,
    createdAt: Date.now() - 86_400_000 * 6
  },
  {
    id: 'fb-3',
    name: 'Dewi K.',
    location: 'Bandung',
    rating: 5,
    text: 'Harga segini untuk kualitas kayak gini? Ga nyesel sama sekali. Udah rekomendasiin ke temen-temen kantor, dua orang langsung order juga 😄',
    avatarUrl: null,
    source: 'ai' as const,
    createdAt: Date.now() - 86_400_000 * 8,
  }
];
