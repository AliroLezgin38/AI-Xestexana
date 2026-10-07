import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const role = (session.user as { role?: string })?.role;

  if (role === "PATIENT")   redirect("/patient");
  if (role === "DOCTOR")    redirect("/doctor");
  if (role === "RECEPTION") redirect("/reception");
  if (role === "ADMIN")     redirect("/admin");

  return (
    <div className="flex flex-col items-center justify-center mt-20 text-center">
      <p className="text-gray-500">Rol tapılmadı: <strong>{role}</strong></p>
    </div>
  );
}
