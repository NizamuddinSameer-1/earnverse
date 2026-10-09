import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySession } from "@/lib/session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySession(token) : null;

  // 1. Protect Admin Endpoints & Admin Console (/admin/* and /api/admin/*)
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (!session) {
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json(
          { success: false, error: "Authentication required: Please sign in." },
          { status: 401 }
        );
      }
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      loginUrl.searchParams.set("reason", "admin_required");
      return NextResponse.redirect(loginUrl);
    }

    if (session.role !== "ADMIN") {
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json(
          { success: false, error: "Access Denied: Administrator role required." },
          { status: 403 }
        );
      }
      const homeUrl = new URL("/home", req.url);
      homeUrl.searchParams.set("error", "unauthorized_admin_access");
      return NextResponse.redirect(homeUrl);
    }
  }

  // 2. Protect Authenticated Earner Pages
  const protectedEarnerRoutes = ["/wallet", "/proof", "/referrals", "/rewards"];
  if (protectedEarnerRoutes.some((route) => pathname.startsWith(route))) {
    if (!session) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Redirect authenticated users away from /login and /register
  if (pathname === "/login" || pathname === "/register") {
    if (session) {
      if (session.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return NextResponse.redirect(new URL("/home", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/wallet",
    "/proof",
    "/referrals",
    "/rewards",
    "/login",
    "/register",
  ],
};
