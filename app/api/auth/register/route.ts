import { Prisma } from "@prisma/client";
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

const GENERIC_RESPONSE = { ok: true } as const;

type RegisterSuccess =
  | { ok: true }
  | { ok: true; next: "login_or_reset" };

type RegisterErrorCode =
  | "email_service_not_configured"
  | "email_delivery_failed"
  | "invalid_registration_input"
  | "registration_unavailable";

function errorResponse(status: number, code: RegisterErrorCode) {
  return NextResponse.json({ ok: false, code }, { status });
}

function successResponse(payload: RegisterSuccess = GENERIC_RESPONSE) {
  return NextResponse.json(payload);
}

export async function POST(request: Request) {
  const envCheck = checkEmailAuthRuntimeEnv();
  if (!envCheck.ok) {
    console.error("[auth/register] runtime env missing");
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

  const normalizedEmail = normalizeEmail(parsed.data.email);
  const pendingPasswordHash = await hashPassword(parsed.data.password);

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        emailVerifiedAt: true,
        emailVerified: true,
        passwordHash: true,
      },
    });

    const isVerified = Boolean(existingUser?.emailVerifiedAt || existingUser?.emailVerified);

    if (!existingUser) {
      await prisma.user.create({
        data: {
          email: normalizedEmail,
        },
      });
    } else if (isVerified && existingUser.passwordHash) {
      return successResponse({ ok: true, next: "login_or_reset" });
    }

    const canSend = await canSendAnotherVerificationCode(normalizedEmail);
    if (!canSend.ok) {
      return successResponse();
    }

    const codeResult = await createEmailVerificationCode(normalizedEmail, {
      pendingPasswordHash,
    });

    const sendResult = await sendVerificationCodeEmail({
      email: normalizedEmail,
      code: codeResult.code,
    });

    if (!sendResult.ok) {
      const failureType = sendResult.code;
      console.error(`[auth/register] email delivery failure type=${failureType}`);
      return errorResponse(sendResult.status, failureType);
    }

    return successResponse();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return successResponse();
    }

    const errorName = error instanceof Error ? error.name : "unknown";
    console.error(`[auth/register] registration unavailable type=${errorName}`);
    return errorResponse(500, "registration_unavailable");
  }
}
