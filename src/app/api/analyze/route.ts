import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ analysis: "Sistemə giriş edilməyib." }, { status: 401 });
    }

    const { symptoms } = await req.json();
    const baseUrl = process.env.BASE_URL;
    const apiKey = process.env.API_KEY;
    const aiModel = process.env.AI_MODEL;

    if (!baseUrl || !apiKey || !aiModel) {
      return NextResponse.json({ analysis: "AI konfiqurasiyaları (.env) tapılmadı." });
    }

    const endpoint = baseUrl.endsWith("/chat/completions") ? baseUrl : `${baseUrl}/chat/completions`;

    // AI-dən həm analizi, həm də risk dərəcəsini istəyirik
    const systemPrompt = `
    Sən tibbi qərar dəstək sisteminin AI köməkçisisən.
    Pasiyentin şikayətlərini analiz et. Mütləq JSON formatında cavab ver. 
    JSON strukturu belə olmalıdır:
    {
      "analysis": "Burada qısa və anlaşıqlı ilkin ehtimalını və məsləhətini yaz.",
      "severity": "Eğer vəziyyət təcili və ya ağırdırsa 'SEVERE', yoxsa 'NORMAL' yaz."
    }
    Əlavə mətn yazma, YALNIZ JSON qaytar.
    `;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: aiModel,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Pasiyentin şikayətləri: ${symptoms}` }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ analysis: `API xətası: ${errText}` });
    }

    const data = await response.json();
    const resultText = data.choices?.[0]?.message?.content || "{}";
    
    let analysisResult = "";
    let severityStatus = "NORMAL";

    try {
      const parsed = JSON.parse(resultText);
      analysisResult = parsed.analysis || "Analiz tapılmadı.";
      severityStatus = parsed.severity || "NORMAL";
    } catch (e) {
      // JSON qaytara bilməsə plain text kimi qəbul edirik
      analysisResult = resultText;
    }

    // Bazaya yazmaq (Firestore)
    const newRecord = {
      patientId: (session.user as any).id,
      patientName: session.user.name,
      symptoms: symptoms,
      aiAnalysis: analysisResult,
      severity: severityStatus,
      status: severityStatus === "SEVERE" ? "ALARM" : "YENİ",
      doctorFeedback: "",
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("records").add(newRecord);

    // Əgər vəziyyət ağırdırsa, həkimlər/resepşn üçün təcili bildiriş yaradaq
    if (severityStatus === "SEVERE") {
      await db.collection("notifications").add({
        recordId: docRef.id,
        patientName: session.user.name,
        message: `TƏCİLİ: ${session.user.name} ağır vəziyyətdə müraciət edib!`,
        forRole: ["DOCTOR", "RECEPTION"],
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ 
      analysis: analysisResult,
      severity: severityStatus,
      recordId: docRef.id
    });
  } catch (error: any) {
    return NextResponse.json({ analysis: `Xəta: ${error.message}` }, { status: 500 });
  }
}
