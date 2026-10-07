"use client";
import { useState } from "react";

export default function PatientPage() {
  const [activeTab, setActiveTab] = useState("TEXT");
  const [text, setText] = useState("");
  const [form, setForm] = useState({ age: "", temp: "", pain: "" });
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
      if (activeTab === "FILE") symptomsText = `Fayl yüklənib: ${file?.name} (Məzmun oxuna bilmir, amma analizlər yoxlanılmalıdır)`;

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: symptomsText })
      });

      const data = await res.json();
      setResult(data.analysis);
      
      // Push notification
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
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pasiyent Paneli (Yeni Müraciət)</h1>
        <button onClick={requestNotification} className="text-sm bg-gray-200 px-3 py-1 rounded">Bildirişləri Aç</button>
      </div>

      <div className="flex gap-4 border-b mb-6">
        <button className={`pb-2 ${activeTab === 'TEXT' ? 'border-b-2 border-blue-600 font-bold' : ''}`} onClick={() => setActiveTab("TEXT")}>Mətn ilə</button>
        <button className={`pb-2 ${activeTab === 'FORM' ? 'border-b-2 border-blue-600 font-bold' : ''}`} onClick={() => setActiveTab("FORM")}>Form ilə</button>
        <button className={`pb-2 ${activeTab === 'FILE' ? 'border-b-2 border-blue-600 font-bold' : ''}`} onClick={() => setActiveTab("FILE")}>Fayl ilə</button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded">
        {activeTab === "TEXT" && (
          <div className="mb-4">
            <label className="block mb-2 font-medium">Şikayətlərinizi ətraflı yazın:</label>
            <textarea required value={text} onChange={e => setText(e.target.value)} className="w-full border p-2 rounded h-32" placeholder="Məsələn: 2 gündür başım ağrıyır, hərarətim 38 dərəcədir..."></textarea>
          </div>
        )}

        {activeTab === "FORM" && (
          <div className="mb-4 space-y-4">
            <div>
              <label className="block mb-1">Yaşınız:</label>
              <input type="number" required value={form.age} onChange={e => setForm({...form, age: e.target.value})} className="border p-2 w-full rounded" />
            </div>
            <div>
              <label className="block mb-1">Hərarətiniz (C):</label>
              <input type="text" required value={form.temp} onChange={e => setForm({...form, temp: e.target.value})} className="border p-2 w-full rounded" />
            </div>
            <div>
              <label className="block mb-1">Ağrı bölgəsi:</label>
              <select value={form.pain} onChange={e => setForm({...form, pain: e.target.value})} className="border p-2 w-full rounded">
                <option>Baş</option>
                <option>Qarın</option>
                <option>Boğaz</option>
                <option>Digər</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === "FILE" && (
          <div className="mb-4">
            <label className="block mb-2 font-medium">Analiz nəticələrinizi (və ya rentgen/şəkil) yükləyin:</label>
            <input type="file" required onChange={e => setFile(e.target.files?.[0] || null)} className="w-full border p-2 rounded" />
          </div>
        )}

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded font-medium disabled:opacity-50">
          {loading ? "AI Analiz edir..." : "Göndər və Analiz et"}
        </button>
      </form>

      {result && (
        <div className="mt-8 p-4 bg-green-50 border-l-4 border-green-500 rounded">
          <h3 className="font-bold text-green-800">Ekspert Sistem Nəticəsi:</h3>
          <p className="mt-2">{result}</p>
          <p className="text-xs text-gray-500 mt-2">Qeyd: Bu məlumat qərar dəstək məqsədlidir, yekun diaqnozu həkim qoyur. Həkim/Resepşn bu barədə xəbərdar edildi.</p>
        </div>
      )}
    </div>
  );
}
