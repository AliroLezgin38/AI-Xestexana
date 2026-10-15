import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const secret = process.env.NEXTAUTH_SECRET || "klinika-super-secret-key-2024";

  // Tokeni oxuyuruq (NextAuth JWT)
  const token = await getToken({
    req,
    secret,
  });

  const role = (token?.role as string | undefined)?.toUpperCase();

  // Əgər istifadəçi artıq daxil olubsa və /login və ya /register səhifəsinə girirsə, birbaşa öz panelinə yönləndir
  if (token && (path === "/login" || path === "/register")) {
    return getRedirectForRole(role, req.url);
  }

  const isProtected =
    path.startsWith("/admin") ||
    path.startsWith("/doctor") ||
    path.startsWith("/patient") ||
    path.startsWith("/reception");

  // Əgər qorunan səhifəyə daxil olmaq istəyir və giriş etməyibsə, /login-ə yönləndir
  if (isProtected && !token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  // Rol yoxlanışı: Başqa rola aid səhifəyə girsə, '/' əvəzinə birbaşa ÖZ panelinə yönləndir (loop yaranmaması üçün)
  if (path.startsWith("/admin") && role !== "ADMIN") {
    return getRedirectForRole(role, req.url);
  }
  if (path.startsWith("/doctor") && role !== "DOCTOR") {
    return getRedirectForRole(role, req.url);
  }
  if (path.startsWith("/patient") && role !== "PATIENT") {
    return getRedirectForRole(role, req.url);
  }
  if (path.startsWith("/reception") && role !== "RECEPTION") {
    return getRedirectForRole(role, req.url);
  }

  return NextResponse.next();
}

function getRedirectForRole(role: string | undefined, reqUrl: string) {
  if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", reqUrl));
  if (role === "DOCTOR") return NextResponse.redirect(new URL("/doctor", reqUrl));
  if (role === "PATIENT") return NextResponse.redirect(new URL("/patient", reqUrl));
  if (role === "RECEPTION") return NextResponse.redirect(new URL("/reception", reqUrl));
  return NextResponse.redirect(new URL("/login", reqUrl));
}

export default proxy;

export const config = {
  matcher: [
    "/admin/:path*",
    "/doctor/:path*",
    "/patient/:path*",
    "/reception/:path*",
    "/login",
    "/register",
  ],
};
