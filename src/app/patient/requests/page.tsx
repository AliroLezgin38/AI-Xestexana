import { db } from "@/lib/firebase-admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function PatientRequestsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return <div className="p-4">Zəhmət olmasa giriş edin.</div>;
  }

  const userId = (session.user as any).id;

  // İstifadəçinin bütün müraciətlərini çəkirik
  const snapshot = await db.collection("records").where("patientId", "==", userId).get();
  const records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
  
  // Tarixə görə sıralayırıq (ən yeni üstdə)
  records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (records.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl shadow-sm text-center border border-slate-200">
        <div className="text-4xl mb-4">📝</div>
        <p className="text-slate-600 text-lg font-medium">Hələ heç bir müraciətiniz yoxdur.</p>
        <Link href="/patient" className="mt-4 inline-block text-blue-600 font-bold hover:underline">
          Yeni Müraciət Yarat
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {records.map(r => (
        <div key={r.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                {new Date(r.createdAt).toLocaleString('az-AZ')}
              </p>
              <h3 className="font-semibold text-slate-800 line-clamp-1">{r.symptoms}</h3>
            </div>
            <span className={`px-3 py-1 text-xs font-bold rounded-full ${
              r.status === 'ALARM' ? 'bg-red-100 text-red-700' : 
              r.status === 'CAVABLANDI' ? 'bg-green-100 text-green-700' : 
              'bg-blue-100 text-blue-700'
            }`}>
              {r.status === 'ALARM' ? 'TƏCİLİ (ALARM)' : r.status}
            </span>
          </div>

          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mt-4">
            <p className="text-xs font-bold text-blue-800 mb-1">🤖 AI Ekspert Analizi</p>
            <p className="text-sm text-blue-900 leading-relaxed">{r.aiAnalysis}</p>
          </div>

          {r.status === "CAVABLANDI" && (
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 mt-4">
              <p className="text-xs font-bold text-emerald-800 mb-1">👨‍⚕️ Həkim Rəyi / Diaqnoz</p>
              <p className="text-sm text-emerald-900 font-medium">{r.doctorFeedback}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
