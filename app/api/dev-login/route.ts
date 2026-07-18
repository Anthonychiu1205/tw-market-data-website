import { NextResponse, type NextRequest } from "next/server";

import { prisma } from "@/src/lib/auth/prisma";

export const runtime = "nodejs";

// SBX-63 dev-only login bypass — LOCAL SANDBOX ACCEPTANCE ONLY.
// Double-gated: NODE_ENV !== "production" AND ALLOW_DEV_LOGIN === "1". ALLOW_DEV_LOGIN must live
// ONLY in .env.local (never .env.production / Vercel). Depends on NO prod credentials.
//
// Why a route and not a NextAuth Credentials provider: Credentials is incompatible with this app's
// database session strategy (+ PrismaAdapter) and threw `error=Configuration`. This route instead
// creates a real DB Session row + sets the same session cookie the app already uses — so it works
// with the unchanged database strategy. It upserts the user by the GIVEN id, so session.user.id is
// exactly that id (= the Polar sandbox subscription's externalCustomerId), solving the mapping.
function devLoginAllowed(): boolean {
  return process.env.NODE_ENV !== "production" && process.env.ALLOW_DEV_LOGIN === "1";
}

export async function POST(request: NextRequest) {
  if (!devLoginAllowed()) {
    return new NextResponse("Not found", { status: 404 });
  }

  const form = await request.formData();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const userId = String(form.get("userId") ?? "").trim();
  const nextRaw = String(form.get("next") ?? "/billing/subscriptions");
  const next = nextRaw.startsWith("/") ? nextRaw : "/billing/subscriptions";

  if (!email || !userId) {
    return NextResponse.redirect(new URL("/login?error=dev_login_invalid", request.url));
  }

  // Upsert by id so the session's user.id is exactly the given id (never clobber an existing email).
  await prisma.user.upsert({ where: { id: userId }, create: { id: userId, email }, update: {} });

  const sessionToken = `${crypto.randomUUID()}${crypto.randomUUID()}`;
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await prisma.session.create({ data: { sessionToken, userId, expires } });

  // Match src/auth/index.ts cookie config for non-production (host-only, non-secure).
  const response = NextResponse.redirect(new URL(next, request.url));
  response.cookies.set("authjs.session-token", sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: false,
    expires,
  });
  return response;
}
