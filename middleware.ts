import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isAuthorizedAdmin } from "./lib/auth/admin";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// French-speaking countries (potential donors via FSSP European connections)
const FR_COUNTRIES = new Set(["FR", "BE", "CH", "LU", "MC", "SN", "CI", "CM", "BF", "CD", "MG"]);
const CO = "CO";

const isAdminRoute = (pathname: string) =>
  (pathname === "/admin" || pathname.startsWith("/admin/")) &&
  pathname !== "/admin/login" &&
  !pathname.startsWith("/admin/login/");

async function guardAdmin(request: NextRequest): Promise<NextResponse> {
  const { pathname, search } = request.nextUrl;
  const deny = () => {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url, 303);
  };

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) return deny();

  let response = NextResponse.next({ request });
  const supabase = createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!isAuthorizedAdmin(user)) return deny();
  } catch {
    return deny();
  }

  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // static files
  ) {
    return NextResponse.next();
  }

  if (isAdminRoute(pathname)) {
    return guardAdmin(request);
  }

  // /admin/login: sin i18n ni geo-redirect
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
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
