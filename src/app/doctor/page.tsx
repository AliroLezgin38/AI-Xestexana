"use client";
import { useState } from "react";

const mockCases = [
  { id: 1, patient: "John Doe", type: "Mətn", symptoms: "Baş ağrısı, 38 hərarət", aiAnalysis: "Yüngül soyuqdəymə ehtimalı", status: "YENİ", time: "10 dəqiqə əvvəl" },
  { id: 2, patient: "Jane Smith", type: "Fayl (Qan analizi)", symptoms: "Fayl yüklənib", aiAnalysis: "Dəmir çatışmazlığı şübhəsi", status: "ALARM", time: "1 saat əvvəl" }
];

export default function DoctorPage() {
  const [feedback, setFeedback] = useState("");

  const handleSendFeedback = (patientName: string) => {
    alert(`Rəy göndərildi və ${patientName} adlı pasiyentə bildiriş getdi!`);
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Sistem Mesajı", { body: "Pasiyentə bildiriş uğurla göndərildi." });
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Həkim Paneli - Gözləyən Pasiyentlər</h1>

      <div className="space-y-6">
        {mockCases.map(c => (
          <div key={c.id} className={`p-4 border rounded shadow-sm ${c.status === 'ALARM' ? 'border-red-500 bg-red-50' : 'bg-white'}`}>
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-lg font-bold">{c.patient}</h2>
              <span className={`px-2 py-1 text-xs font-bold rounded ${c.status === 'ALARM' ? 'bg-red-500 text-white animate-pulse' : 'bg-yellow-500 text-white'}`}>{c.status}</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Müraciət vaxtı: {c.time} | Növ: {c.type}</p>
            <p className="mb-2"><strong>Şikayətlər:</strong> {c.symptoms}</p>
            <div className="bg-blue-50 p-3 rounded mb-4 text-sm">
              <strong>🤖 AI Ekspert Analizi:</strong> {c.aiAnalysis}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Həkim rəyi (və ya diaqnoz):</label>
              <textarea onChange={e => setFeedback(e.target.value)} className="w-full border rounded p-2 text-sm h-20 mb-2" placeholder="Nəticəni daxil edin..."></textarea>
              <button onClick={() => handleSendFeedback(c.patient)} className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium">Təsdiqlə və Pasiyentə Bildir (Push Notification)</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
