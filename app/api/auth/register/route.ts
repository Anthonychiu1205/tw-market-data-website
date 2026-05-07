import { NextResponse } from "next/server";

import { checkEmailAuthRuntimeEnv } from "@/src/auth/env";
import { prisma } from "@/src/lib/auth/prisma";
import { sendVerificationCodeEmail } from "@/src/lib/auth/email-delivery";
import { registerBodySchema } from "@/src/lib/auth/email-auth-schema";
import { badRequest, readJsonBody } from "@/src/lib/auth/email-auth-route";
import {
  canSendAnotherVerificationCode,
  createEmailVerificationCode,
  normalizeEmail,
} from "@/src/lib/auth/email-verification";
import { hashPassword } from "@/src/lib/auth/email-password";

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

  const parsed = registerBodySchema.safeParse(body);
  if (!parsed.success) {
    return badRequest("invalid_payload");
  }

  const normalizedEmail = normalizeEmail(parsed.data.email);
  const passwordHash = await hashPassword(parsed.data.password);

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      id: true,
      emailVerifiedAt: true,
      emailVerified: true,
    },
  });

  const isVerified = Boolean(existingUser?.emailVerifiedAt || existingUser?.emailVerified);

  if (!existingUser) {
    await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
      },
    });
  } else if (!isVerified) {
    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        passwordHash,
      },
    });
  }

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
