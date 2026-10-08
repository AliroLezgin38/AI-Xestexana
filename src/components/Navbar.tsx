"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type UserWithRole = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
  id?: string;
};

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user as UserWithRole | undefined;

  const roleLabel: Record<string, string> = {
    ADMIN:     "⚙️ Admin",
    DOCTOR:    "👨‍⚕️ Həkim",
    PATIENT:   "🤒 Pasiyent",
    RECEPTION: "🖥️ Resepşn",
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3 shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold text-blue-700 tracking-tight hover:opacity-80 transition">
          <span className="bg-blue-600 text-white rounded-lg p-1.5 shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          </span>
          Klinika Sistemi
        </Link>
        <div className="flex gap-4 items-center text-sm font-medium">
          {session ? (
            <>
              <div className="hidden sm:flex items-center bg-slate-100 rounded-full py-1.5 px-4 shadow-inner border border-slate-200">
                <span className="text-slate-700 font-semibold mr-2">{user?.name}</span>
                <span className="bg-white text-blue-600 text-xs px-2 py-0.5 rounded-full border border-slate-200 shadow-sm">
                  {roleLabel[user?.role ?? ""] ?? user?.role}
                </span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded-xl transition shadow-sm font-semibold"
              >
                Çıxış
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/login")}
                className="text-slate-600 hover:text-blue-600 px-4 py-2 font-bold transition"
              >
                Giriş Et
              </button>
              <button
                onClick={() => router.push("/register")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition shadow-md font-bold"
              >
                Qeydiyyat
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
