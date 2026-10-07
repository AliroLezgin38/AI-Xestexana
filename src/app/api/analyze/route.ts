import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { symptoms } = await req.json();

    const baseUrl = process.env.BASE_URL;
    const apiKey = process.env.API_KEY;
    const aiModel = process.env.AI_MODEL;

    if (!baseUrl || !apiKey || !aiModel) {
      return NextResponse.json({ 
        analysis: "AI konfiqurasiyaları (.env) tapılmadı. Zəhmət olmasa BASE_URL, API_KEY və AI_MODEL dəyərlərini əlavə edin." 
      });
    }

    // Əgər user BASE_URL-in sonuna onsuz da /chat/completions yazıbsa, bir daha əlavə etmə
    const endpoint = baseUrl.endsWith("/chat/completions") 
      ? baseUrl 
      : `${baseUrl}/chat/completions`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: aiModel,
        messages: [
          { role: "system", content: "Sən tibbi qərar dəstək sisteminin (Ekspert sistem) köməkçi AI'san. Xəstənin şikayətlərinə və analiz nəticələrinə əsasən ehtimal olunan diaqnozu qısa şəkildə yaz və qeyd et ki, bu sadəcə ehtimaldır və həkim müayinəsi mütləqdir." },
          { role: "user", content: `Pasiyentin şikayətləri: ${symptoms}` }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ analysis: `API xətası: ${errText}` });
    }

    const data = await response.json();
    return NextResponse.json({ analysis: data.choices?.[0]?.message?.content || "Analiz nəticəsi tapılmadı." });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Bilinməyən xəta";
    return NextResponse.json({ analysis: `Gözlənilməz xəta: ${msg}` });
  }
}
