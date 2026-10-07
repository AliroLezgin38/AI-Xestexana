"use client";
import { signIn, signOut, useSession } from "next-auth/react";
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
    <nav className="bg-blue-700 text-white px-6 py-3 shadow-md">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold tracking-wide">
          🏥 Klinika Sistemi
        </Link>
        <div className="flex gap-3 items-center text-sm">
          {session ? (
            <>
              <span className="bg-blue-800 px-3 py-1 rounded-full">
                {user?.name} · {roleLabel[user?.role ?? ""] ?? user?.role}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg transition"
              >
                Çıxış
              </button>
            </>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="bg-green-500 hover:bg-green-600 px-4 py-1 rounded-lg transition font-medium"
            >
              Giriş
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
