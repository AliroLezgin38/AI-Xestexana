"use client";
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Email və ya şifrə yanlışdır.");
    } else {
      router.push("/");
    }
  };

  const quickLogin = async (role: string) => {
    const accounts: Record<string, { email: string; password: string }> = {
      ADMIN:     { email: "admin@test.com",     password: "123" },
      DOCTOR:    { email: "doctor@test.com",    password: "123" },
      PATIENT:   { email: "patient@test.com",   password: "123" },
      RECEPTION: { email: "reception@test.com", password: "123" },
    };
    const acc = accounts[role];
    setLoading(true);
    const result = await signIn("credentials", { ...acc, redirect: false });
    setLoading(false);
    if (!result?.error) router.push("/");
  };

  if (status === "authenticated") return <div className="min-h-screen bg-slate-50"></div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-100 p-4">
      <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md border border-white">
        <div className="text-center mb-8">
          <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800">Klinika Sistemi</h1>
          <p className="text-slate-500 text-sm mt-1">Sistemə daxil olun</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white/50"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Şifrə</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white/50"
            />
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg border border-red-100 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl disabled:opacity-50 transition shadow-md hover:shadow-lg"
          >
            {loading ? "Giriş edilir..." : "Daxil Ol"}
          </button>
        </form>

        <div className="mt-8 border-t border-slate-200 pt-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center mb-4">Sürətli test girişi</p>
          <div className="grid grid-cols-2 gap-3">
            {["PATIENT", "DOCTOR", "RECEPTION", "ADMIN"].map((role) => (
              <button
                key={role}
                onClick={() => quickLogin(role)}
                disabled={loading}
                className="text-sm font-medium border border-slate-200 bg-white rounded-lg py-2.5 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 transition shadow-sm text-slate-600 flex items-center justify-center gap-2"
              >
                {role === "PATIENT"   && "🤒 Pasiyent"}
                {role === "DOCTOR"    && "👨‍⚕️ Həkim"}
                {role === "RECEPTION" && "🖥️ Resepşn"}
                {role === "ADMIN"     && "⚙️ Admin"}
              </button>
            ))}
          </div>
        </div>
        
        <p className="text-sm text-center mt-8 text-slate-600">
          Hesabınız yoxdur? <Link href="/register" className="text-blue-600 font-semibold hover:underline">Qeydiyyatdan Keç</Link>
        </p>
      </div>
    </div>
  );
}
