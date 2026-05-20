import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex flex-col items-center hover:opacity-90 transition-opacity">
            <Logo className="w-16 h-16 text-indigo-600 drop-shadow-md mb-2" />
            <h1 className="text-2xl font-bold text-slate-900 pb-2">LynkSell</h1>
          </Link>
          <p className="text-slate-500 text-sm mt-1">Selamat datang kembali!</p>
        </div>

        <LoginForm />

        <p className="mt-6 text-center text-sm text-slate-600">
          Belum punya akun?{' '}
          <Link href="/register" className="text-indigo-600 font-bold hover:underline">
            Daftar Gratis
          </Link>
        </p>
      </div>
    </div>
  );
}
