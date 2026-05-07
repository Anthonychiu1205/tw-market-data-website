import { NextResponse } from "next/server";

import { checkEmailAuthRuntimeEnv } from "@/src/auth/env";
import { sendVerificationCodeEmail } from "@/src/lib/auth/email-delivery";
import { registerBodySchema } from "@/src/lib/auth/email-auth-schema";
import { readJsonBody } from "@/src/lib/auth/email-auth-route";
import { hashPassword } from "@/src/lib/auth/email-password";
import { prisma } from "@/src/lib/auth/prisma";
import {
  canSendAnotherVerificationCode,
  createEmailVerificationCode,
  normalizeEmail,
} from "@/src/lib/auth/email-verification";

const GENERIC_RESPONSE = { ok: true };

type RegisterErrorCode =
  | "email_service_not_configured"
  | "email_delivery_failed"
  | "invalid_registration_input"
  | "registration_unavailable";

function errorResponse(status: number, code: RegisterErrorCode) {
  return NextResponse.json({ ok: false, code }, { status });
}

export async function POST(request: Request) {
  const envCheck = checkEmailAuthRuntimeEnv();
  if (!envCheck.ok) {
    console.error("[auth/register] email auth env missing");
    return errorResponse(503, "registration_unavailable");
  }

  const body = await readJsonBody(request);
  if (!body) {
    return errorResponse(400, "invalid_registration_input");
  }

  const parsed = registerBodySchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(400, "invalid_registration_input");
  }

  try {
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
      const failureType = sendResult.code;
      console.error(`[auth/register] email delivery failure type=${failureType}`);
      return errorResponse(sendResult.status, failureType);
    }

    return NextResponse.json(GENERIC_RESPONSE);
  } catch (error) {
    const errorName = error instanceof Error ? error.name : "unknown";
    console.error(`[auth/register] registration_unavailable error=${errorName}`);
    return errorResponse(500, "registration_unavailable");
  }
}
