import { NextResponse } from "next/server";

import { auth } from "./src/auth";
import { getSafeRedirectTarget } from "./src/lib/security/safe-redirect";

export const proxy = auth((request) => {
  const { pathname } = request.nextUrl;
  const session = request.auth;
  const isProtectedPath =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/billing") ||
    pathname.startsWith("/usage") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/account");

  if (isProtectedPath && !session) {
    const requestedPath = `${pathname}${request.nextUrl.search}`;
    const safeNext = getSafeRedirectTarget(requestedPath, "/dashboard");
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", safeNext);
    return NextResponse.redirect(loginUrl);
  }

  if (
    (pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/verify-email" ||
      pathname === "/forgot-password" ||
      pathname === "/reset-password") &&
    session
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/billing/:path*",
    "/usage/:path*",
    "/settings/:path*",
    "/account/:path*",
    "/login",
    "/register",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
  ],
};
