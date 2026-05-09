import { NextResponse } from "next/server";

import {
  buildAuthRuntimeErrorPayload,
  checkEmailAuthRuntimeEnv,
  logAuthRuntimeEnvMissing,
} from "@/src/auth/env";
import { trackEventServer } from "@/src/lib/analytics/server";
import { passwordLoginBodySchema } from "@/src/lib/auth/email-auth-schema";
import { badRequest, createAuthenticatedJsonResponse, readJsonBody } from "@/src/lib/auth/email-auth-route";
import { verifyPasswordHash } from "@/src/lib/auth/email-password";
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

  if (!user?.passwordHash) {
    return NextResponse.json({ ok: false, error: "invalid_credentials" }, { status: 401 });
  }

  const isValidPassword = await verifyPasswordHash(parsed.data.password, user.passwordHash);
  if (!isValidPassword) {
    return NextResponse.json({ ok: false, error: "invalid_credentials" }, { status: 401 });
  }

  const isVerified = Boolean(user.emailVerifiedAt || user.emailVerified);
  if (!isVerified) {
    return NextResponse.json(
      {
        ok: false,
        error: "requires_verification",
        requiresVerification: true,
      },
      { status: 403 },
    );
  }

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
