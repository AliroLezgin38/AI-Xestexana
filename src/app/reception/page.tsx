"use client";

export default function ReceptionPage() {
  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Resepşn Paneli</h1>
      <p className="mb-4">Resepşn paneli vasitəsilə yeni xəstələri qeydiyyata ala və onların analiz məlumatlarını sistemə daxil edə bilərsiniz.</p>
      
      <div className="bg-white p-6 shadow rounded mb-8">
        <h2 className="text-lg font-bold mb-4">Xəstə üçün məlumat daxil et</h2>
        <div className="space-y-4">
          <input type="text" placeholder="Pasiyentin adı" className="w-full border p-2 rounded" />
          <textarea placeholder="Şikayətləri və ya ilkin məlumatlar" className="w-full border p-2 rounded h-20"></textarea>
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => alert("Məlumat sistemə əlavə edildi, AI analizə başladı və həkimə bildiriş göndərildi!")}>Sistemə Əlavə Et və Analizə Göndər</button>
        </div>
      </div>

      <h2 className="text-lg font-bold mb-4">Son Müraciətlər və Alarmlar</h2>
      <div className="p-4 border rounded bg-red-50 border-red-500 shadow-sm mb-4">
        <p><strong>⚠️ ALARM:</strong> Jane Smith (Otaq 2) - Təcili qan analizi nəticələri gəlib. (AI: Dəmir çatışmazlığı)</p>
        <button className="mt-2 text-sm bg-red-600 text-white px-3 py-1 rounded">Həkimə Zəng Et</button>
      </div>
    </div>
  );
}
