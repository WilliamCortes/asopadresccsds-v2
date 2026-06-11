import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// French-speaking countries (potential donors via FSSP European connections)
const FR_COUNTRIES = new Set(["FR", "BE", "CH", "LU", "MC", "SN", "CI", "CM", "BF", "CD", "MG"]);
const CO = "CO";

// Admin routes require auth — handled by Supabase session check in layout
const isAdminRoute = (pathname: string) =>
  pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // static files
  ) {
    return NextResponse.next();
  }

  // Admin routes: pass through (auth handled in layout)
  if (pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Geo-redirect: if at root without locale, redirect based on country
  if (pathname === "/") {
    const country = (request as any).geo?.country ?? "";
    if (country === CO) {
      return NextResponse.redirect(new URL("/es", request.url));
    }
    if (FR_COUNTRIES.has(country)) {
      return NextResponse.redirect(new URL("/fr", request.url));
    }
    if (country && country !== "") {
      return NextResponse.redirect(new URL("/en", request.url));
    }
    // No geo info: default to Spanish
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!_next|_vercel|api|.*\\..*).*)",
  ],
};
