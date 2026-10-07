import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Bütün xanaları doldurun" }, { status: 400 });
    }

    // İstifadəçinin artıq mövcud olub-olmadığını yoxla
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();

    if (!snapshot.empty) {
      return NextResponse.json({ error: "Bu email ilə artıq qeydiyyatdan keçilib" }, { status: 400 });
    }

    // Şifrəni hash-lə
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni istifadəçini yarat
    const newUser = {
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date().toISOString(),
    };

    const docRef = await usersRef.add(newUser);

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
