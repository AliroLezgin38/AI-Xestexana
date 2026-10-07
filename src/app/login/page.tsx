"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      router.refresh();
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
    if (!result?.error) { router.push("/"); router.refresh(); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-2">
          🏥 Klinika Sistemi
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          Tibbi Ekspert və Qərar Dəstək Sistemi
        </p>

        <form onSubmit={handleLogin} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Şifrə</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg disabled:opacity-50 transition"
          >
            {loading ? "Giriş edilir..." : "Sistemə Daxil Ol"}
          </button>
        </form>

        <div className="border-t pt-4">
          <p className="text-xs text-gray-400 text-center mb-3">Sürətli test girişi:</p>
          <div className="grid grid-cols-2 gap-2">
            {["PATIENT", "DOCTOR", "RECEPTION", "ADMIN"].map((role) => (
              <button
                key={role}
                onClick={() => quickLogin(role)}
                disabled={loading}
                className="text-xs border border-gray-300 rounded-lg py-2 hover:bg-gray-50 disabled:opacity-50 transition"
              >
                {role === "PATIENT"   && "🤒 Pasiyent"}
                {role === "DOCTOR"    && "👨‍⚕️ Həkim"}
                {role === "RECEPTION" && "🖥️ Resepşn"}
                {role === "ADMIN"     && "⚙️ Admin"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
