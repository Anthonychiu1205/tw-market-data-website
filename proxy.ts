import { NextResponse } from "next/server";

import { auth } from "./src/auth";

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
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/login" && session) {
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
  ],
};
