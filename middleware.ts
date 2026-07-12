import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const host = req.headers.get("host") || "";
  const pathname = req.nextUrl.pathname;

  // Protect dashboard
  const isProtectedRoute =
    pathname.startsWith("/dashboard");

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // News subdomain
  if (host === "news.theprobability.site") {

    // Homepage
    if (pathname === "/") {
      return NextResponse.rewrite(
        new URL("/news/blog", req.url)
      );
    }

    // Article pages
    if (
      !pathname.startsWith("/news/blog") &&
      !pathname.startsWith("/_next") &&
      pathname !== "/favicon.ico"
    ) {
      return NextResponse.rewrite(
        new URL(`/news/blog${pathname}`, req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
