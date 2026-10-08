import { db } from "@/lib/firebase-admin";
import { sendFeedbackToPatient } from "../actions";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function DoctorPage({ searchParams }: { searchParams: { filter?: string } }) {
  // Bütün müraciətləri çəkirik
  const snapshot = await db.collection("records").orderBy("createdAt", "desc").get();
  let records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];

  // Statistikaları hesablayırıq
  const total = records.length;
  const alarms = records.filter(r => r.status === "ALARM").length;
  const news = records.filter(r => r.status === "YENİ").length;
  const answered = records.filter(r => r.status === "CAVABLANDI").length;

  // Filterləmə tətbiq edirik
  const currentFilter = searchParams.filter || "ALL";
  if (currentFilter !== "ALL") {
    records = records.filter(r => r.status === currentFilter);
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 mb-20 px-4">
      {/* Header və Statistikalar */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">Həkim Paneli</h1>
        <p className="text-slate-500 mt-1 mb-6">Müraciətlərin statistikası və idarəetmə lövhəsi</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="?filter=ALL" className={`p-4 rounded-2xl border transition shadow-sm ${currentFilter === 'ALL' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'}`}>
            <p className="text-sm font-semibold opacity-80">Ümumi</p>
            <p className="text-3xl font-extrabold">{total}</p>
          </Link>
          <Link href="?filter=ALARM" className={`p-4 rounded-2xl border transition shadow-sm ${currentFilter === 'ALARM' ? 'bg-red-500 border-red-500 text-white' : 'bg-white border-slate-200 hover:bg-red-50 text-slate-700'}`}>
            <p className="text-sm font-semibold opacity-80">Ağır (Alarm)</p>
            <p className={`text-3xl font-extrabold ${currentFilter !== 'ALARM' && 'text-red-600'}`}>{alarms}</p>
          </Link>
          <Link href="?filter=YENİ" className={`p-4 rounded-2xl border transition shadow-sm ${currentFilter === 'YENİ' ? 'bg-yellow-500 border-yellow-500 text-white' : 'bg-white border-slate-200 hover:bg-yellow-50 text-slate-700'}`}>
            <p className="text-sm font-semibold opacity-80">Yeni Gözləyən</p>
            <p className={`text-3xl font-extrabold ${currentFilter !== 'YENİ' && 'text-yellow-600'}`}>{news}</p>
          </Link>
          <Link href="?filter=CAVABLANDI" className={`p-4 rounded-2xl border transition shadow-sm ${currentFilter === 'CAVABLANDI' ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-slate-200 hover:bg-green-50 text-slate-700'}`}>
            <p className="text-sm font-semibold opacity-80">Cavablanan</p>
            <p className={`text-3xl font-extrabold ${currentFilter !== 'CAVABLANDI' && 'text-green-600'}`}>{answered}</p>
          </Link>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">
          {currentFilter === "ALL" ? "Bütün Müraciətlər" : currentFilter === "ALARM" ? "Təcili Müraciətlər (Alarm)" : currentFilter === "YENİ" ? "Gözləyən Müraciətlər" : "Cavablanmış Müraciətlər"}
        </h2>
      </div>

      {records.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow-sm text-center border border-slate-200">
          <p className="text-slate-500 text-lg">Bu filterə uyğun müraciət tapılmadı.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {records.map(r => (
            <div key={r.id} className={`p-6 border rounded-2xl shadow-sm transition-all ${r.status === 'ALARM' ? 'border-red-400 bg-red-50 shadow-red-100' : 'bg-white border-slate-200'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{r.patientName}</h3>
                  <p className="text-xs text-slate-400 mt-1">{new Date(r.createdAt).toLocaleString('az-AZ')}</p>
                </div>
                <span className={`px-3 py-1.5 text-xs font-bold rounded-full ${
                  r.status === 'ALARM' ? 'bg-red-500 text-white animate-pulse shadow-sm' : 
                  r.status === 'CAVABLANDI' ? 'bg-green-100 text-green-700' : 
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {r.status}
                </span>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl mb-4 border border-slate-100">
                <p className="text-sm font-semibold text-slate-500 mb-1">Şikayətlər:</p>
                <p className="text-slate-800 text-sm">{r.symptoms}</p>
              </div>

              <div className="bg-blue-50/50 p-4 rounded-xl mb-5 border border-blue-100 relative">
                <div className="absolute -top-3 -right-3 bg-blue-500 text-white p-1.5 rounded-full shadow-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <p className="text-sm font-semibold text-blue-800 mb-1">🤖 AI Ekspert Analizi:</p>
                <p className="text-blue-900 text-sm leading-relaxed">{r.aiAnalysis}</p>
              </div>
              
              {r.status !== 'CAVABLANDI' ? (
                <form action={async (formData) => {
                  "use server";
                  const feedback = formData.get("feedback") as string;
                  await sendFeedbackToPatient(r.id, r.patientId, feedback);
                }}>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Həkim rəyi (və ya diaqnoz):</label>
                  <textarea name="feedback" required className="w-full border border-slate-300 rounded-xl p-3 text-sm h-24 mb-3 focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Pasiyentə göndəriləcək nəticəni bura yazın..."></textarea>
                  <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white px-4 py-3 rounded-xl text-sm font-bold transition shadow-md flex justify-center items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                    Təsdiqlə və Pasiyentə Göndər
                  </button>
                </form>
              ) : (
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <p className="text-sm font-semibold text-green-800 mb-1">Sizin Rəyiniz:</p>
                  <p className="text-green-900 text-sm">{r.doctorFeedback}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
