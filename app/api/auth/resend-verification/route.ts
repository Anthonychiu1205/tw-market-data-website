import { NextResponse } from "next/server";

import { checkEmailAuthRuntimeEnv } from "@/src/auth/env";
import { resendVerificationBodySchema } from "@/src/lib/auth/email-auth-schema";
import { badRequest, readJsonBody } from "@/src/lib/auth/email-auth-route";
import { sendVerificationCodeEmail } from "@/src/lib/auth/email-delivery";
import { prisma } from "@/src/lib/auth/prisma";
import {
  canSendAnotherVerificationCode,
  createEmailVerificationCode,
  normalizeEmail,
} from "@/src/lib/auth/email-verification";

const GENERIC_RESPONSE = { ok: true };

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

  const parsed = resendVerificationBodySchema.safeParse(body);
  if (!parsed.success) {
    return badRequest("invalid_payload");
  }

  const normalizedEmail = normalizeEmail(parsed.data.email);

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      id: true,
      emailVerifiedAt: true,
      emailVerified: true,
    },
  });

  if (!user) {
    return NextResponse.json(GENERIC_RESPONSE);
  }

  const isVerified = Boolean(user.emailVerifiedAt || user.emailVerified);
  if (isVerified) {
    return NextResponse.json(GENERIC_RESPONSE);
  }

  const canSend = await canSendAnotherVerificationCode(normalizedEmail);
  if (!canSend.ok) {
    return NextResponse.json(GENERIC_RESPONSE);
  }

  const codeResult = await createEmailVerificationCode(normalizedEmail);
  const sendResult = await sendVerificationCodeEmail({
    email: normalizedEmail,
    code: codeResult.code,
  });

  if (!sendResult.ok) {
    return NextResponse.json({ ok: false, error: sendResult.error }, { status: sendResult.status });
  }

  return NextResponse.json(GENERIC_RESPONSE);
}
