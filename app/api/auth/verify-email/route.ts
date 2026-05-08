import { NextResponse } from "next/server";

import {
  buildAuthRuntimeErrorPayload,
  checkEmailAuthRuntimeEnv,
  logAuthRuntimeEnvMissing,
} from "@/src/auth/env";
import { verifyEmailBodySchema } from "@/src/lib/auth/email-auth-schema";
import { createAuthenticatedJsonResponse, readJsonBody } from "@/src/lib/auth/email-auth-route";
import { prisma } from "@/src/lib/auth/prisma";
import { consumeVerificationCodeIfValid, normalizeEmail } from "@/src/lib/auth/email-verification";

export async function POST(request: Request) {
  const envCheck = checkEmailAuthRuntimeEnv();
  if (!envCheck.ok) {
    logAuthRuntimeEnvMissing("api/auth/verify-email:POST", envCheck);
    return NextResponse.json(
      buildAuthRuntimeErrorPayload(envCheck, { devErrorCode: "email_auth_env_missing" }),
      { status: envCheck.status },
    );
  }

  const body = await readJsonBody(request);
  if (!body) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const parsed = verifyEmailBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const normalizedEmail = normalizeEmail(parsed.data.email);
  const verificationResult = await consumeVerificationCodeIfValid(normalizedEmail, parsed.data.code);

  if (!verificationResult.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: verificationResult.error,
      },
      { status: verificationResult.error === "too_many_attempts" ? 429 : 400 },
    );
  }

  const verifiedAt = new Date();
  const user = await prisma.user.upsert({
    where: { email: normalizedEmail },
    update: {
      emailVerifiedAt: verifiedAt,
      emailVerified: verifiedAt,
      ...(verificationResult.verification.pendingPasswordHash
        ? { passwordHash: verificationResult.verification.pendingPasswordHash }
        : {}),
    },
    create: {
      email: normalizedEmail,
      emailVerifiedAt: verifiedAt,
      emailVerified: verifiedAt,
      ...(verificationResult.verification.pendingPasswordHash
        ? { passwordHash: verificationResult.verification.pendingPasswordHash }
        : {}),
    },
    select: {
      id: true,
    },
  });

  return await createAuthenticatedJsonResponse(user.id, {
    ok: true,
    redirectTo: "/dashboard",
  });
}
