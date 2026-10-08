import { db } from "@/lib/firebase-admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import { markNotificationAsRead } from "@/app/actions";

export const dynamic = 'force-dynamic';

export default async function PatientAnswersPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return <div className="p-4">Zəhmət olmasa giriş edin.</div>;
  }

  const userId = (session.user as any).id;

  // İstifadəçiyə aid bildirişləri çəkirik
  const snapshot = await db.collection("notifications").where("patientId", "==", userId).get();
  const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
  
  // Tarixə görə sıralayırıq
  notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (notifications.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl shadow-sm text-center border border-slate-200">
        <div className="text-4xl mb-4">📭</div>
        <p className="text-slate-600 text-lg font-medium">Hələ heç bir həkim rəyi (bildirişi) almamısınız.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map(n => (
        <div key={n.id} className={`p-5 rounded-2xl border transition-all ${n.isRead ? 'bg-white border-slate-200' : 'bg-emerald-50 border-emerald-200 shadow-sm'}`}>
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${n.isRead ? 'bg-slate-100 text-slate-500' : 'bg-emerald-500 text-white shadow-md'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-400 mb-1">{new Date(n.createdAt).toLocaleString('az-AZ')}</p>
              <p className={`text-sm ${n.isRead ? 'text-slate-700' : 'text-emerald-900 font-semibold'}`}>{n.message}</p>
              
              {!n.isRead && (
                <form action={async () => {
                  "use server";
                  await markNotificationAsRead(n.id);
                }}>
                  <button type="submit" className="mt-3 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline">
                    Oxundu olaraq işarələ
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
