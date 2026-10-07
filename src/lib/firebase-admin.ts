import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

// Yalnız bir dəfə inisializasiya etmək üçün
if (!getApps().length) {
  if (serviceAccount.projectId && serviceAccount.privateKey) {
    initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    console.warn("Firebase Admin mühit dəyişənləri (.env) tapılmadı!");
  }
}

export const db = getFirestore();
