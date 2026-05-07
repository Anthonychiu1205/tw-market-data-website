import { NextResponse } from "next/server";

import { prisma } from "@/src/lib/auth/prisma";
import {
  createSessionTokenForUser,
  normalizeEmail,
  resolveSessionCookieName,
} from "@/src/lib/auth/email-verification";

export function badRequest(error: string) {
  return NextResponse.json({ ok: false, error }, { status: 400 });
}

export async function readJsonBody(request: Request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function setAuthSessionCookie(response: NextResponse, input: { sessionToken: string; expires: Date; maxAgeSeconds: number }) {
  response.cookies.set(resolveSessionCookieName(), input.sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: input.expires,
    maxAge: input.maxAgeSeconds,
  });
}

export async function createAuthenticatedJsonResponse(userId: string, body: Record<string, unknown>) {
  const session = await createSessionTokenForUser(userId);
  const response = NextResponse.json(body);
  setAuthSessionCookie(response, session);
  return response;
}

export async function findUserByNormalizedEmail(email: string) {
  return await prisma.user.findUnique({
    where: {
      email: normalizeEmail(email),
    },
  });
}
