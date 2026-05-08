import { NextResponse } from "next/server";

import {
  buildAuthRuntimeErrorPayload,
  checkAuthRuntimeEnv,
  logAuthRuntimeEnvMissing,
} from "@/src/auth/env";
import { getSafeRedirectTarget } from "@/src/lib/security/safe-redirect";

export async function POST(request: Request) {
  const check = checkAuthRuntimeEnv();
  if (!check.ok) {
    logAuthRuntimeEnvMissing("api/auth/login:POST", check);
    return NextResponse.json(buildAuthRuntimeErrorPayload(check), { status: check.status });
  }

  const requestUrl = new URL(request.url);
  const safePath = getSafeRedirectTarget(requestUrl.searchParams.get("next"), "/dashboard");
  const callbackUrl = new URL(safePath, request.url).toString();
  const signInUrl = new URL("/api/auth/signin/google", request.url);
  signInUrl.searchParams.set("callbackUrl", callbackUrl);
  return NextResponse.redirect(signInUrl);
}
