import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // Əgər istifadəçi giriş edibsə, onu uyğun panelə yönləndiririk
  if (session?.user) {
    const role = (session.user as { role?: string })?.role;
    if (role === "PATIENT")   redirect("/patient");
    if (role === "DOCTOR")    redirect("/doctor");
    if (role === "RECEPTION") redirect("/reception");
    if (role === "ADMIN")     redirect("/admin");
  }

  // Giriş edilməyibsə, Gözəl Landing Page göstəririk
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-teal-500 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Süni İntellekt Dəstəkli <br className="hidden md:block"/> Tibbi Klinika Sistemi
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Pasiyentlərin şikayətlərini qabaqcıl AI modelləri (Gemma, Llama, Nemotron) ilə saniyələr içində analiz edir, ağır halları müəyyən edib həkimlərə dərhal xəbərdarlıq göndərir.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-white text-blue-700 hover:bg-slate-50 font-bold px-8 py-4 rounded-xl shadow-lg transition transform hover:-translate-y-0.5">
              Pasiyent Kimi Qeydiyyat
            </Link>
            <Link href="/login" className="bg-blue-700/50 hover:bg-blue-700/70 border border-blue-400 text-white font-bold px-8 py-4 rounded-xl backdrop-blur-sm transition">
              Sistemə Giriş
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto py-20 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
          <div className="bg-blue-100 text-blue-600 w-12 h-12 flex items-center justify-center rounded-xl mb-6">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Ağıllı Diaqnostika</h3>
          <p className="text-slate-600">Pasiyent şikayətini mətni və ya fayl ilə daxil edir, AI ehtimal olunan diaqnozu dərhal formalaşdırır.</p>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
          <div className="bg-red-100 text-red-600 w-12 h-12 flex items-center justify-center rounded-xl mb-6">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Avtomatik Trij (Təcili)</h3>
          <p className="text-slate-600">Sistem ağır simptomları analiz edərək riskli xəstələri dərhal Qırmızı Alarm ilə həkimin panelinə atır.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
          <div className="bg-teal-100 text-teal-600 w-12 h-12 flex items-center justify-center rounded-xl mb-6">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Sürətli Əlaqə</h3>
          <p className="text-slate-600">Həkimin yazdığı rəylər və yekun nəticələr eyni saniyədə pasiyentin xüsusi panelinə bildiriş olaraq düşür.</p>
        </div>
      </div>
    </div>
  );
}
