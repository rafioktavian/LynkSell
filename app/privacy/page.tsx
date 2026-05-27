import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export const metadata = {
  title: 'Kebijakan Privasi | LynkSell',
  description: 'Kebijakan Privasi layanan LynkSell.',
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-12">
            <h1 className="text-4xl font-heading font-bold text-slate-900 mb-4">Kebijakan Privasi</h1>
            <p className="text-slate-500">Terakhir diperbarui: 20 Mei 2026</p>
          </div>

          <div className="max-w-none text-slate-600 leading-relaxed space-y-6">
            <p>Privasi Anda sangat penting bagi kami. Kebijakan Privasi ini menjelaskan bagaimana LynkSell mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat menggunakan platform kami.</p>

            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. Informasi yang Kami Kumpulkan</h3>
            <p>Kami dapat mengumpulkan jenis informasi berikut:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-slate-900">Informasi Pendaftaran:</strong> Nama, alamat email, dan informasi login ketika Anda mendaftar menggunakan Google OAuth atau kredensial biasa.</li>
              <li><strong className="text-slate-900">Konten yang Diunggah:</strong> Foto produk, nama produk, nomor WhatsApp, harga, dan target pembeli yang Anda masukkan saat membuat halaman landing.</li>
              <li><strong className="text-slate-900">Data Penggunaan:</strong> Analitik terkait waktu pembuatan halaman, jumlah tayangan (views) pada URL publik Anda, dan log aktivitas standar (IP, jenis perangkat).</li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. Bagaimana Kami Menggunakan Informasi Anda</h3>
            <p>Informasi yang kami kumpulkan hanya digunakan untuk mendukung operasional layanan, di antaranya:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Membangun dan menampilkan halaman penjualan produk Anda yang dapat diakses oleh publik.</li>
              <li>Menganalisis foto dan teks melalui API Google Gemini untuk menghasilkan konten copywriting yang relevan untuk Anda.</li>
              <li>Menghubungi Anda tentang pembaruan layanan, fitur baru, atau menanggapi permintaan kontak.</li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. Hak Pihak Ketiga & Pemrosesan AI</h3>
            <p>Untuk mewujudkan pembuatan halaman instan, kami menggunakan teknologi AI dari <strong className="text-slate-900">Google Gemini</strong>. Data foto dan deskripsi yang Anda berikan akan dikirimkan secara aman ke API pihak ketiga ini murni untuk evaluasi dan pembuatan respon konten. Kami juga menggunakan <strong className="text-slate-900">Firebase</strong> untuk penyimpanan basis data dan foto secara aman.</p>

            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. Berbagi dan Pengungkapan</h3>
            <p>Kami <strong className="text-slate-900">TIDAK AKAN</strong> menjual, menyewakan, atau mendistribusikan data personal Anda kepada pihak ketiga untuk tujuan pemasaran. Data yang Anda buat secara eksplisit untuk &quot;publik&quot; (halaman landing URL Anda) secara bawaan memang dirancang agar bisa diakses siapapun melalui link. Pastikan memilah mana informasi yang patut ditampilkan dalam halaman publik Anda.</p>

            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">5. Keamanan Data</h3>
            <p>Kami berkomitmen melindungi data base yang ada. Komunikasi menggunakan enkripsi (HTTPS/SSL), dan semua data sensitif dijaga aksesibilitasnya menggunakan Security Rules. Kendati demikian, tidak ada metode transmisi internet yang 100% aman.</p>

            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">6. Hak Akun Anda</h3>
            <p>Anda berhak untuk mengakses, mengubah nama pengguna, atau meminta penghapusan akun beserta seluruh data halaman mendarat (landing pages) jika Anda tidak lagi ingin menggunakan layanan ini. Permintaan penghapusan dapat diajukan ke kami.</p>

            <hr className="my-10 border-slate-200" />
            <p>Apabila Anda memiliki kekhawatiran tentang kebijakan ini, Anda dapat berbicara dengan tim pengembangan melalui kontak <strong className="text-slate-900">lynksellid@gmail.com</strong>.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
