import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/constants";

const protectedPaths = ["/dashboard", "/dan-koto-shitsumon", "/news-feed"];

export default function proxy(request: NextRequest) {
  const isAuthenticated = request.cookies.has(AUTH_COOKIE);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/login") && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/dan-koto-shitsumon/:path*",
    "/news-feed/:path*",
    "/login",
  ],
};
