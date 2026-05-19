export const FALLBACK_COPY = {
  headline: "Kulit Glowing dalam 7 Hari — Dijamin atau Uang Kembali",
  subheadline: "Akhirnya ada serum yang nggak bikin breakout. Cocok banget buat kamu yang punya kulit super sensitif.",
  pain_points: [
    "Udah nyoba berbagai produk mahal tapi kulit masih kusam dan belang-belang?",
    "Takut nyoba skincare baru karena sering banget malah bikin kulit merah dan bruntusan?",
    "Pengen hasil cepet tapi nggak mau pake bahan kimia keras yang ngerusak skin barrier?"
  ],
  solution_intro: "Kamu nggak sendirian. Ribuan orang udah beralih dan rasain sendiri perbedaannya.",
  benefits: [
    {
      icon: "leaf",
      title: "Aman Tiap Hari",
      desc: "Formula bebas paraben, SLS, dan alkohol. Aman dipakai daily tanpa cuti."
    },
    {
      icon: "shield-check",
      title: "Garansi 100% Cocok",
      desc: "Coba 7 hari. Kalau nggak ngerasa bedanya, 100% uang kembali tanpa ditanya."
    },
    {
      icon: "truck",
      title: "Pesan Sekarang, Dikirim Hari Ini",
      desc: "Nggak perlu nunggu lama. Order sebelum jam 3 sore, langsung kami proses."
    }
  ],
  urgency_text: "Batch bulan ini tinggal 31 botol. Biasanya habis sebelum Jumat.",
  cta_button: "Klaim Harga Promo — Chat WhatsApp",
  whatsapp_message: "Halo kak 👋 Saya liat produknya di lynksell.id dan tertarik bgt. Boleh tanya dulu: Masih ada stok nggak? Kalau oke langsung order ya! 😊"
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
