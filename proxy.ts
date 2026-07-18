import createMiddleware from "next-intl/middleware";
import {
  NextResponse,
  type NextFetchEvent,
  type NextMiddleware,
  type NextRequest,
} from "next/server";

import { auth } from "./src/auth";
import { detectLocale, localeFromPathname } from "./src/i18n/detect-locale";
import { routing } from "./src/i18n/routing";
import { getSafeRedirectTarget } from "./src/lib/security/safe-redirect";

const LOCALE_COOKIE = "NEXT_LOCALE";
const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

// next-intl's own middleware handles ALREADY-prefixed requests: it passes them through, sets the
// x-next-intl-locale header that src/i18n/request.ts reads, and pins the NEXT_LOCALE cookie to the
// visited prefix (this is what makes a plain <a href="/en/…"> language switcher stick — §2.5).
// Detection (localeDetection) is disabled in routing.ts, so this NEVER geo-redirects a prefixed URL;
// crawlers get exactly the /en or /zh-TW URL they asked for (§1.2).
const intlMiddleware = createMiddleware(routing);

// Logical path = pathname with its /{locale} prefix stripped, so auth rules are written once and are
// locale-agnostic. "/en/dashboard/keys" → "/dashboard/keys"; "/zh-TW" → "/".
function stripLocale(pathname: string, locale: string): string {
  const rest = pathname.slice(locale.length + 1);
  return rest === "" ? "/" : rest;
}

function isProtectedLogicalPath(path: string): boolean {
  return (
    path === "/dashboard" ||
    path.startsWith("/dashboard/") ||
    path === "/billing" ||
    path.startsWith("/billing/") ||
    path === "/usage" ||
    path.startsWith("/usage/") ||
    path === "/settings" ||
    path.startsWith("/settings/") ||
    path === "/account" ||
    path.startsWith("/account/")
  );
}

const AUTH_PAGE_PATHS = new Set([
  "/login",
  "/register",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
]);

function isAuthPageLogicalPath(path: string): boolean {
  return AUTH_PAGE_PATHS.has(path);
}

// Only these paths need the (DB-backed) session, so only these pay for the auth() lookup. Every other
// page — home, pricing, docs, blog — takes the pure locale path below with zero session cost (§1.6:
// merging locale+auth must NOT add a session round-trip to public pages).
function needsSession(logicalPath: string): boolean {
  return isProtectedLogicalPath(logicalPath) || isAuthPageLogicalPath(logicalPath);
}

// Session-aware branch: reuse NextAuth's middleware wrapper. request.auth is the resolved session.
// After the auth gate we hand off to next-intl so the locale header/cookie are still applied.
// NextAuth's auth() return type is overloaded (middleware AND route-handler shapes); pin it to the
// middleware signature so it composes as (request, event) below.
const authHandler = auth((request) => {
  const { pathname, search } = request.nextUrl;
  const locale = localeFromPathname(pathname) ?? routing.defaultLocale;
  const logicalPath = stripLocale(pathname, locale);
  const session = request.auth;

  if (isProtectedLogicalPath(logicalPath) && !session) {
    const requestedPath = `${pathname}${search}`;
    const safeNext = getSafeRedirectTarget(requestedPath, `/${locale}/dashboard`);
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set("next", safeNext);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPageLogicalPath(logicalPath) && session) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  return intlMiddleware(request);
}) as unknown as NextMiddleware;

export function proxy(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = request.nextUrl;
  const pathLocale = localeFromPathname(pathname);

  // 1) No locale prefix (incl. "/") → four-layer detect, then 307 to the prefixed URL and pin the
  //    cookie once (§1.1 / §2.9). Pure + session-free.
  if (!pathLocale) {
    const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
    const locale = detectLocale({
      cookieLocale,
      geoCountry: request.headers.get("x-vercel-ip-country"),
      acceptLanguage: request.headers.get("accept-language"),
    });
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    const response = NextResponse.redirect(url, 307);
    if (cookieLocale !== locale) {
      response.cookies.set(LOCALE_COOKIE, locale, {
        maxAge: LOCALE_COOKIE_MAX_AGE,
        path: "/",
        sameSite: "lax",
      });
    }
    return response;
  }

  // 2) Prefixed + needs the session → NextAuth wrapper (which ends in intlMiddleware).
  const logicalPath = stripLocale(pathname, pathLocale);
  if (needsSession(logicalPath)) {
    return authHandler(request, event);
  }

  // 3) Prefixed public page → pure locale routing, no session lookup.
  return intlMiddleware(request);
}

export const config = {
  // Every route except API, the v2 gateway route handler, Next internals, and files with an
  // extension (static assets, robots.txt, sitemap.xml, …). api + v2 are machine endpoints and stay
  // out of locale routing entirely (§1.6).
  matcher: ["/((?!api|v2|_next|_vercel|.*\\..*).*)"],
};
