"use server";
import { db } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";

export async function sendFeedbackToPatient(recordId: string, patientId: string, feedback: string) {
  try {
    // 1. Rekordu yeniləyirik
    await db.collection("records").doc(recordId).update({
      doctorFeedback: feedback,
      status: "CAVABLANDI",
      updatedAt: new Date().toISOString()
    });

    // 2. Pasiyentə bildiriş göndəririk
    await db.collection("notifications").add({
      recordId,
      patientId,
      message: `Həkim sizin müraciətinizə rəy yazdı: "${feedback.substring(0, 30)}..."`,
      forRole: ["PATIENT"],
      isRead: false,
      createdAt: new Date().toISOString()
    });

    // UI-ı dərhal yeniləmək üçün:
    revalidatePath("/doctor");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function markNotificationAsRead(notificationId: string) {
  await db.collection("notifications").doc(notificationId).update({ isRead: true });
  revalidatePath("/");
}
