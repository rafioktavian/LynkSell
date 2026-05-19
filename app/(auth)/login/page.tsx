import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 border-b-2 border-indigo-100 pb-2">LynkSell</h1>
          <p className="text-slate-500 text-sm mt-2">Selamat datang kembali!</p>
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
