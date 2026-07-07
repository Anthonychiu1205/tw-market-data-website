import { NextResponse } from "next/server";

import {
  buildAuthRuntimeErrorPayload,
  checkEmailAuthRuntimeEnv,
  logAuthRuntimeEnvMissing,
} from "@/src/auth/env";
import { trackEventServer } from "@/src/lib/analytics/server";
import { passwordLoginBodySchema } from "@/src/lib/auth/email-auth-schema";
import { badRequest, createAuthenticatedJsonResponse, readJsonBody } from "@/src/lib/auth/email-auth-route";
import { INVALID_PLACEHOLDER_HASH, verifyPasswordHash } from "@/src/lib/auth/email-password";
import { clearFailures, getClientIp, isThrottled, recordFailure } from "@/src/lib/auth/auth-throttle";
import { prisma } from "@/src/lib/auth/prisma";
import { normalizeEmail } from "@/src/lib/auth/email-verification";
import { getSafeRedirectTarget } from "@/src/lib/security/safe-redirect";

export async function POST(request: Request) {
  const envCheck = checkEmailAuthRuntimeEnv();
  if (!envCheck.ok) {
    logAuthRuntimeEnvMissing("api/auth/password-login:POST", envCheck);
    return NextResponse.json(
      buildAuthRuntimeErrorPayload(envCheck, { devErrorCode: "email_auth_env_missing" }),
      { status: envCheck.status },
    );
  }

  const body = await readJsonBody(request);
  if (!body) {
    return badRequest("invalid_json");
  }

  const parsed = passwordLoginBodySchema.safeParse(body);
  if (!parsed.success) {
    return badRequest("invalid_payload");
  }

  const normalizedEmail = normalizeEmail(parsed.data.email);
  const clientIp = getClientIp(request);

  // Brute-force throttle across two dimensions (email + IP). fail-open: a DB wobble
  // never blocks a legitimate login.
  const [emailGate, ipGate] = await Promise.all([
    isThrottled("login_email", normalizedEmail),
    isThrottled("login_ip", clientIp),
  ]);
  const gate = emailGate.blocked ? emailGate : ipGate;
  if (gate.blocked) {
    return NextResponse.json(
      { ok: false, error: "too_many_attempts" },
      { status: 429, headers: { "Retry-After": String(gate.retryAfterSeconds) } },
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      id: true,
      email: true,
      passwordHash: true,
      emailVerifiedAt: true,
      emailVerified: true,
    },
  });

  // Constant time: always run exactly one bcrypt compare, whether or not the user
  // exists, so the response time cannot be used to enumerate accounts.
  const hashToCheck = user?.passwordHash || INVALID_PLACEHOLDER_HASH;
  const isValidPassword = await verifyPasswordHash(parsed.data.password, hashToCheck);

  if (!user?.passwordHash || !isValidPassword) {
    await recordFailure("login_email", normalizedEmail);
    await recordFailure("login_ip", clientIp);
    return NextResponse.json({ ok: false, error: "invalid_credentials" }, { status: 401 });
  }

  const isVerified = Boolean(user.emailVerifiedAt || user.emailVerified);
  if (!isVerified) {
    // The password was correct, so clear the failure counters before returning.
    await clearFailures("login_email", normalizedEmail);
    await clearFailures("login_ip", clientIp);
    return NextResponse.json(
      {
        ok: false,
        error: "requires_verification",
        requiresVerification: true,
      },
      { status: 403 },
    );
  }

  // Successful credential check — clear failures so prior fails don't accumulate.
  await clearFailures("login_email", normalizedEmail);
  await clearFailures("login_ip", clientIp);

  const requestUrl = new URL(request.url);
  const redirectTo = getSafeRedirectTarget(requestUrl.searchParams.get("next"), "/dashboard");

  void trackEventServer({
    event: "auth_login_success",
    context: {
      source: "server",
      userId: user.id,
      page: "/login",
    },
    properties: {
      method: "email_password",
      redirectTo,
    },
  });

  return await createAuthenticatedJsonResponse(user.id, {
    ok: true,
    redirectTo,
  });
}
