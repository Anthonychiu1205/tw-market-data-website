import { cookies } from "next/headers";

import { SESSION_COOKIE_NAME } from "./constants";
import { createSessionToken, verifySessionToken } from "./token";

const EIGHT_HOURS = 60 * 60 * 8;

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;
  return await verifySessionToken(token);
}

export async function createSession(email: string) {
  const token = await createSessionToken(email);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: EIGHT_HOURS,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export function getDemoCredentials() {
  return {
    email: process.env.DEMO_USER_EMAIL ?? "demo@twmd.local",
    password: process.env.DEMO_USER_PASSWORD ?? "demo-password",
  };
}
