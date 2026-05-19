import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/RegisterForm";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <Logo className="w-16 h-16 text-indigo-600 drop-shadow-md mb-2" />
          <h1 className="text-2xl font-bold text-slate-900 pb-2">Daftar LynkSell</h1>
          <p className="text-slate-500 text-sm mt-1">Buat halaman jualanmu cuma 30 detik.</p>
        </div>

        <RegisterForm />

        <p className="mt-6 text-center text-sm text-slate-600">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-indigo-600 font-bold hover:underline">
            Masuk Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
