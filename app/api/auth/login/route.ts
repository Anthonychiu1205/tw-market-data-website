import { NextResponse } from "next/server";

import { createSession, getDemoCredentials } from "@/src/auth/session";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const demo = getDemoCredentials();

  if (email !== demo.email || password !== demo.password) {
    return NextResponse.redirect(new URL("/login?error=credentials", request.url));
  }

  await createSession(email);

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
