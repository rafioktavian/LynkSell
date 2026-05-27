import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export const metadata = {
  title: 'Syarat & Ketentuan | LynkSell',
  description: 'Syarat dan Ketentuan layanan LynkSell.',
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-12">
            <h1 className="text-4xl font-heading font-bold text-slate-900 mb-4">Syarat & Ketentuan</h1>
            <p className="text-slate-500">Terakhir diperbarui: 20 Mei 2026</p>
          </div>

          <div className="max-w-none text-slate-600 leading-relaxed space-y-6">
            <p>Selamat datang di LynkSell. Harap membaca Syarat & Ketentuan ini dengan saksama sebelum menggunakan layanan kami.</p>

            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. Penerimaan Syarat</h3>
            <p>Dengan membuat akun atau menggunakan layanan LynkSell, Anda setuju untuk terikat oleh Syarat & Ketentuan ini. Jika Anda tidak setuju dengan ketentuan mana pun, Anda tidak diizinkan menggunakan layanan kami.</p>

            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. Deskripsi Layanan</h3>
            <p>LynkSell adalah platform pembuat landing page bertenaga AI yang memungkinkan pengguna UMKM / Seller untuk menghasilkan halaman penjualan produk khusus hanya dari unggahan foto produk. LynkSell tidak membebankan biaya komisi atas transaksi yang terjadi antara penjual dan pembeli.</p>

            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. Akun Pengguna</h3>
            <p>Anda bertanggung jawab untuk menjaga kerahasiaan kredensial akun Anda (email, kata sandi, atau autentikasi OAuth). Segala aktivitas yang terjadi di bawah akun Anda adalah tanggung jawab Anda sepenuhnya. LynkSell berhak menangguhkan atau menghapus akun yang melanggar ketentuan atau menggunakan platform untuk aktivitas ilegal.</p>

            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. Konten Pengguna</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Anda tetap memiliki hak kekayaan intelektual atas foto dan informasi informasi produk yang Anda unggah.</li>
              <li>Dengan menggunakan LynkSell, Anda memberikan hak kepada LynkSell untuk menyimpan, memproses, dan menampilkan konten tersebut pada layanan kami.</li>
              <li>Anda dilarang mengunggah konten yang melanggar hukum, mengandung unsur penipuan, pelanggaran hak cipta, asusila, atau materi berbahaya lainnya. Pihak LynkSell berhak menghapus halaman publik secara sepihak jika melanggar ketentuan ini.</li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">5. Ketersediaan Layanan & AI</h3>
            <p>Pembuatan teks (copywriting) dilakukan otomatis oleh Kecerdasan Buatan (AI) Google Gemini. Kami tidak menjamin keakuratan teks dan menyarankan Anda untuk meninjau hasil salinan (copy) yang dibuat sebelum disebarluaskan. LynkSell disediakan &quot;apa adanya&quot; (as is) dan kami dapat menghentikan atau mengubah fitur sewaktu-waktu.</p>

            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">6. Batasan Tanggung Jawab</h3>
            <p>Semua transaksi yang terjadi melalui tautan atau halaman buatan LynkSell murni melibatkan penjual dan pembeli. LynkSell hanya berperan sebagai penyedia layanan perangkat lunak pembuat halaman (software as a service) dan tidak bertanggung jawab atas perselisihan, pengiriman barang, atau pembayaran produk.</p>

            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">7. Perubahan Syarat dan Ketentuan</h3>
            <p>Kami mungkin akan memperbarui halaman Syarat & Ketentuan ini sesekali. Kami akan menginformasikan perubahan melalui pemberitahuan di dalam platform. Penggunaan layanan secara berkelanjutan berarti Anda menyetujui perubahan tersebut.</p>

            <hr className="my-10 border-slate-200" />
            <p>Apabila Anda memiliki pertanyaan mengenai Syarat & Ketentuan ini, silakan hubungi kami di <strong className="text-slate-900">lynksellid@gmail.com</strong>.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
