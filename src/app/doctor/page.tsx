import { db } from "@/lib/firebase-admin";
import { sendFeedbackToPatient } from "../actions";

export const dynamic = 'force-dynamic'; // Hər dəfə ən son məlumatı çəkmək üçün

export default async function DoctorPage() {
  // Bütün müraciətləri çəkirik
  const snapshot = await db.collection("records")
                           .orderBy("createdAt", "desc")
                           .get();
  
  const records = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as any[];

  return (
    <div className="max-w-6xl mx-auto mt-10 mb-20 px-4">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-extrabold text-slate-800">Həkim Paneli</h1>
        <p className="text-slate-500 mt-1">Gözləyən Pasiyentlər və Süni İntellekt Analizləri</p>
      </div>

      {records.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow-sm text-center border border-slate-200">
          <p className="text-slate-500 text-lg">Hazırda heç bir müraciət yoxdur.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {records.map(r => (
            <div key={r.id} className={`p-6 border rounded-2xl shadow-sm transition-all ${r.status === 'ALARM' ? 'border-red-400 bg-red-50 shadow-red-100' : 'bg-white border-slate-200'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{r.patientName}</h2>
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
