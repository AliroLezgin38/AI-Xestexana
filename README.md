# 🏥 Süni İntellekt Dəstəkli Klinika Sistemi

Bu layihə xəstələrin şikayətlərini qəbul edərək Süni İntellekt (OpenRouter API - Llama, Gemma, Nemotron və s.) vasitəsilə ilkin analiz edən və nəticəyə uyğun olaraq xəstəni "Ağır" (Alarm) və ya "Normal" statusla həkimin panelinə yönləndirən müasir bir Next.js tətbiqidir.

## 🚀 Texnologiyalar
- **Next.js 14+** (App Router, Server Components, Server Actions)
- **Tailwind CSS v3** (Glassmorphism, Gradient UI)
- **Firebase Firestore & Admin SDK** (Real-time Məlumat Bazası)
- **NextAuth.js** (Təhlükəsiz Giriş və Qeydiyyat Sistemi + Middleware)
- **OpenRouter API** (Süni İntellekt Analizi)

## 🛠 Qurulum və Çalışdırma

### 1. Reponu Yükləyin və Paketləri Quraşdırın
```bash
npm install
```

### 2. Mühit Dəyişənlərini (.env) Ayarlayın
Layihənin ana qovluğunda olan `.env.example` faylının adını `.env` olaraq dəyişin və ya yeni `.env` faylı yaradıb içini doldurun:

```env
FIREBASE_PROJECT_ID="layihe-idi"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxx@..."
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"

BASE_URL="https://openrouter.ai/api/v1"
API_KEY="sk-or-v1-sizin-openrouter-acarınız"
AI_MODEL="openrouter/auto"

NEXTAUTH_SECRET="istədiyiniz-gizli-kod"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Firebase Bağlantısını Necə Qurmalı?
1. [Firebase Console](https://console.firebase.google.com) ünvanına daxil olun.
2. Yeni layihə yaradın.
3. Sol menudan **Firestore Database** yaradın (Test Mode seçin).
4. **Project Settings (Layihə Ayarları) -> Service Accounts** bölməsinə keçin.
5. **"Generate new private key"** düyməsini sıxın və JSON faylını yükləyin.
6. Həmin JSON faylının içindəki `project_id`, `client_email` və `private_key` məlumatlarını kopyalayaraq `.env` faylınızdakı müvafiq yerlərə (dırnaq işarələri daxilində və `\n` işarələrini silmədən) yapışdırın.

### 4. Layihəni İşə Salın
```bash
npm run dev
```
Sayt `http://localhost:3000` ünvanında açılacaq.

## 👥 İstifadəçi Rolları
Sistemdə Qeydiyyatdan keçərkən Rol seçə bilərsiniz:
- **PATIENT (Pasiyent)**: Şikayət göndərir, AI tərəfindən diaqnoz qoyulur, həkim rəylərini (bildirişlərini) oxuyur.
- **DOCTOR (Həkim)**: Müraciətləri izləyir (Ağır xəstələr Qırmızı Alarm ilə yuxarıda görünür), rəy/diaqnoz yazır.
- **ADMIN / RECEPTION**: Ümumi bazanı və statistikaları izləyir.
