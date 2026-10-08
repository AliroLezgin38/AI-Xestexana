import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Rol yoxlanışı və avtomatik yönləndirmə
    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (path.startsWith("/doctor") && token?.role !== "DOCTOR") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (path.startsWith("/patient") && token?.role !== "PATIENT") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (path.startsWith("/reception") && token?.role !== "RECEPTION") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      // Yalnız tokeni olanlar bu səhifələrə girə bilər
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  // Bu səhifələr qorunur
  matcher: ["/admin/:path*", "/doctor/:path*", "/patient/:path*", "/reception/:path*"],
};
