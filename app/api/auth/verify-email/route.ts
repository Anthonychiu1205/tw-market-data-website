import { NextResponse } from "next/server";

import { checkEmailAuthRuntimeEnv } from "@/src/auth/env";
import { verifyEmailBodySchema } from "@/src/lib/auth/email-auth-schema";
import { badRequest, createAuthenticatedJsonResponse, readJsonBody } from "@/src/lib/auth/email-auth-route";
import { prisma } from "@/src/lib/auth/prisma";
import { consumeVerificationCodeIfValid, normalizeEmail } from "@/src/lib/auth/email-verification";

export async function POST(request: Request) {
  const envCheck = checkEmailAuthRuntimeEnv();
  if (!envCheck.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "email_auth_env_missing",
        message: envCheck.message,
        missing: envCheck.missing,
      },
      { status: envCheck.status },
    );
  }

  const body = await readJsonBody(request);
  if (!body) {
    return badRequest("invalid_json");
  }

  const parsed = verifyEmailBodySchema.safeParse(body);
  if (!parsed.success) {
    return badRequest("invalid_payload");
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
    },
    create: {
      email: normalizedEmail,
      emailVerifiedAt: verifiedAt,
      emailVerified: verifiedAt,
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
