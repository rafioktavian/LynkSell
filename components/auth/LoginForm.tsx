"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";
import { loginUserAction, googleSignInAction } from "@/app/actions/user.actions";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

const registerSchema = z
  .object({
    name: z.string().min(2, "Nama minimal 2 karakter"),
    email: z.string().email("Email tidak valid"),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .regex(/[0-9]/, "Password harus mengandung angka"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

export function LoginForm() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onLogin = async (data: LoginValues) => {
    setIsLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      
      const res = await loginUserAction(formData);

      if (!res.success) {
        setError(res.error || "Gagal masuk");
      } else {
        window.location.href = "/dashboard";
      }
    } catch {
      setError("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  };

  const onRegister = async (data: RegisterValues) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }),
      });

      const result = await res.json();
      if (!result.success) {
        setError(result.error || "Gagal mendaftar");
      } else {
        const formData = new FormData();
        formData.append("email", data.email);
        formData.append("password", data.password);
        await loginUserAction(formData);
        
        window.location.href = "/dashboard";
      }
    } catch {
      setError("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  };

  const onGoogleSignIn = async () => {
    setIsLoading(true);
    await googleSignInAction();
  };

  const onDemoSignIn = () => {
    setIsLoading(true);
    localStorage.setItem("lynksell_demo", "true");
    window.location.href = "/dashboard";
  };

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
        <button
          onClick={() => {
            setActiveTab("login");
            setError("");
          }}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === "login"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Masuk
        </button>
        <button
          onClick={() => {
            setActiveTab("register");
            setError("");
          }}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === "register"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Daftar
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* LOGIN TAB */}
      {activeTab === "login" && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
          <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="nama@email.com"
                {...loginForm.register("email")}
                disabled={isLoading}
              />
              {loginForm.formState.errors.email && (
                <p className="text-xs text-destructive">
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <Label htmlFor="login-password">Password</Label>
                <a href="#" className="font-medium inline-block text-sm text-primary hover:underline">
                  Lupa password?
                </a>
              </div>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                {...loginForm.register("password")}
                disabled={isLoading}
              />
              {loginForm.formState.errors.password && (
                <p className="text-xs text-destructive">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full font-medium" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Masuk
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Atau lanjutkan dengan</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full relative"
            onClick={onGoogleSignIn}
            disabled={isLoading}
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              <path d="M1 1h22v22H1z" fill="none"/>
            </svg>
            Google
          </Button>
        </div>
      )}

      {/* REGISTER TAB */}
      {activeTab === "register" && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
          <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="reg-name">Nama Lengkap</Label>
              <Input
                id="reg-name"
                placeholder="Budi Santoso"
                {...registerForm.register("name")}
                disabled={isLoading}
              />
              {registerForm.formState.errors.name && (
                <p className="text-xs text-destructive">
                  {registerForm.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="reg-email">Email</Label>
              <Input
                id="reg-email"
                type="email"
                placeholder="nama@email.com"
                {...registerForm.register("email")}
                disabled={isLoading}
              />
              {registerForm.formState.errors.email && (
                <p className="text-xs text-destructive">
                  {registerForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="reg-password">Password</Label>
              <Input
                id="reg-password"
                type="password"
                placeholder="Min 8 karakter, ada angka"
                {...registerForm.register("password")}
                disabled={isLoading}
              />
              {registerForm.formState.errors.password && (
                <p className="text-xs text-destructive">
                  {registerForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="reg-confirm">Konfirmasi Password</Label>
              <Input
                id="reg-confirm"
                type="password"
                placeholder="Ulangi password"
                {...registerForm.register("confirmPassword")}
                disabled={isLoading}
              />
              {registerForm.formState.errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {registerForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full font-medium" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Daftar Sekarang
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Atau lanjutkan dengan</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full relative"
            onClick={onGoogleSignIn}
            disabled={isLoading}
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              <path d="M1 1h22v22H1z" fill="none"/>
            </svg>
            Google
          </Button>

          {process.env.NEXT_PUBLIC_DEMO_MODE === 'true' && (
            <Button
              type="button"
              variant="secondary"
              className="w-full relative mt-2"
              onClick={onDemoSignIn}
              disabled={isLoading}
            >
              Demo — Masuk Tanpa Akun
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
