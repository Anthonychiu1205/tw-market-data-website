import { NextResponse } from "next/server";

import { checkAuthRuntimeEnv } from "@/src/auth/env";

export async function POST(request: Request) {
  const check = checkAuthRuntimeEnv();
  if (!check.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "auth_runtime_env_missing",
        message: check.message,
        missing: check.missing,
      },
      { status: check.status },
    );
  }

  const callbackUrl = new URL("/dashboard", request.url).toString();
  const signInUrl = new URL("/api/auth/signin/google", request.url);
  signInUrl.searchParams.set("callbackUrl", callbackUrl);
  return NextResponse.redirect(signInUrl);
}
