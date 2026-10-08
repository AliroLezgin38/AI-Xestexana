"use client";
import { useState } from "react";

export default function PatientPage() {
  const [activeTab, setActiveTab] = useState("TEXT");
  const [text, setText] = useState("");
  const [form, setForm] = useState({ age: "", temp: "", pain: "Baş" });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      let symptomsText = "";
      if (activeTab === "TEXT") symptomsText = text;
      if (activeTab === "FORM") symptomsText = `Yaş: ${form.age}, Hərarət: ${form.temp}, Ağrı bölgəsi: ${form.pain}`;
      if (activeTab === "FILE" && file) {
        if (file.type === "text/plain" || file.name.endsWith('.txt')) {
          const fileContent = await file.text();
          symptomsText = `Fayl yüklənib: ${file.name}\n\nMəzmun:\n${fileContent}`;
        } else {
          symptomsText = `Fayl yüklənib: ${file.name} (Gələcəkdə PDF/Şəkil oxuma xüsusiyyəti əlavə ediləcək, hələlik ad qeyd edilir).`;
        }
      }

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: symptomsText })
      });

      const data = await res.json();
      setResult(data.analysis);
      
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Yeni Nəticə", { body: "Ekspert sistem analizi bitirdi." });
      }
    } catch (err) {
      setResult("Sistem xətası baş verdi.");
    } finally {
      setLoading(false);
    }
  };

  const requestNotification = () => {
    if ("Notification" in window) Notification.requestPermission();
  };

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex bg-slate-50 border-b border-slate-200 p-2 gap-2">
          {["TEXT", "FORM", "FILE"].map((tab) => (
            <button 
              key={tab}
              className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-xl transition ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "TEXT" ? "📝 Mətn İlə" : tab === "FORM" ? "📋 Forma İlə" : "📎 Fayl İlə"}
            </button>
          ))}
        </div>

        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            {activeTab === "TEXT" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <label className="block mb-2 font-semibold text-slate-700">Şikayətlərinizi ətraflı yazın</label>
                <textarea required value={text} onChange={e => setText(e.target.value)} className="w-full border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl p-4 h-40 transition outline-none resize-none text-slate-700 bg-slate-50 focus:bg-white" placeholder="Məsələn: 2 gündür başım ağrıyır, hərarətim 38 dərəcədir, özümü halsız hiss edirəm..."></textarea>
              </div>
            )}

            {activeTab === "FORM" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-semibold text-slate-700">Yaşınız</label>
                  <input type="number" required value={form.age} onChange={e => setForm({...form, age: e.target.value})} className="border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl p-3 w-full transition outline-none bg-slate-50 focus:bg-white" placeholder="Məsələn: 34" />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-slate-700">Hərarətiniz (°C)</label>
                  <input type="text" required value={form.temp} onChange={e => setForm({...form, temp: e.target.value})} className="border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl p-3 w-full transition outline-none bg-slate-50 focus:bg-white" placeholder="Məsələn: 37.5" />
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-2 font-semibold text-slate-700">Əsas Ağrı Bölgəsi</label>
                  <select value={form.pain} onChange={e => setForm({...form, pain: e.target.value})} className="border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl p-3 w-full transition outline-none bg-slate-50 focus:bg-white text-slate-700">
                    <option>Baş</option>
                    <option>Qarın</option>
                    <option>Boğaz</option>
                    <option>Kürək</option>
                    <option>Digər</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === "FILE" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <label className="block mb-2 font-semibold text-slate-700">Analiz nəticələrinizi (və ya rentgen/şəkil) yükləyin</label>
                <div className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:bg-slate-100 transition cursor-pointer relative">
                  <input type="file" required onChange={e => setFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <svg className="w-12 h-12 text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                  <p className="text-slate-600 font-medium">{file ? file.name : "Faylı bura sürükləyin və ya klikləyib seçin"}</p>
                  <p className="text-slate-400 text-sm mt-1">PDF, JPG, PNG (Max: 5MB)</p>
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition disabled:opacity-50 mt-8 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
              {loading ? (
                <><svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> AI Analiz edir...</>
              ) : (
                "Göndər və Analiz et"
              )}
            </button>
          </form>
        </div>
      </div>

      {result && (
        <div className="mt-8 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl shadow-sm animate-in zoom-in-95 duration-300">
          <div className="flex items-start gap-4">
            <div className="bg-emerald-500 text-white p-2 rounded-full shadow-sm shrink-0 mt-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
              <h3 className="font-extrabold text-emerald-900 text-lg">Ekspert Sistem Nəticəsi:</h3>
              <p className="mt-2 text-emerald-800 leading-relaxed whitespace-pre-wrap font-medium">{result}</p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-emerald-200/50 flex items-start gap-2 text-xs text-emerald-700">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <p><strong>Qeyd:</strong> Bu məlumat yalnız qərar dəstək məqsədlidir, yekun diaqnozu həkim qoyur. Məlumat dərhal həkimə ötürüldü.</p>
          </div>
        </div>
      )}
    </div>
  );
}
