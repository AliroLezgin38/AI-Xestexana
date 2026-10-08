"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navLinks = [
    { href: "/patient", label: "Yeni Müraciət", icon: "➕" },
    { href: "/patient/requests", label: "Müraciətlərim", icon: "📋" },
    { href: "/patient/answers", label: "Həkim Cavabları", icon: "🩺" },
  ];

  return (
    <div className="max-w-5xl mx-auto mt-10 mb-20 px-4">
      {/* Patient Header & Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-slate-200 pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">Pasiyent Paneli</h1>
          <p className="text-slate-500 mt-1">Sağlamlığınızı idarə edin</p>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-xl">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  isActive 
                    ? "bg-white text-blue-600 shadow-sm border border-slate-200" 
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                }`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Səhifələrin Məzmunu */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {children}
      </div>
    </div>
  );
}
