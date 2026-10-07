"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const { status } = useSession();
  
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "PATIENT" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      // Avtomatik giriş
      await signIn("credentials", {
        email: form.email,
        password: form.password,
        callbackUrl: "/"
      });
    } else {
      setError(data.error || "Xəta baş verdi");
    }
  };

  if (status === "authenticated") return <div className="min-h-screen bg-slate-50"></div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-100 p-4">
      <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md border border-white">
        <div className="text-center mb-8">
          <div className="bg-teal-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800">Yeni Hesab</h1>
          <p className="text-slate-500 text-sm mt-1">Sistemdə qeydiyyatdan keçin</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Ad, Soyad</label>
            <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition bg-white/50" placeholder="Con Doe" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
            <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition bg-white/50" placeholder="email@example.com" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Şifrə</label>
            <input required type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition bg-white/50" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Rolunuz</label>
            <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition bg-white/50 text-slate-700">
              <option value="PATIENT">Pasiyent</option>
              <option value="DOCTOR">Həkim</option>
              <option value="RECEPTION">Resepşn</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg border border-red-100 flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-xl transition shadow-md hover:shadow-lg disabled:opacity-50 mt-2">
            {loading ? "Yaradılır..." : "Qeydiyyatdan Keç"}
          </button>
        </form>

        <p className="text-sm text-center mt-8 text-slate-600">
          Artıq hesabınız var? <Link href="/login" className="text-teal-600 font-semibold hover:underline">Giriş edin</Link>
        </p>
      </div>
    </div>
  );
}
