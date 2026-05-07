import { NextResponse } from "next/server";

import { checkEmailAuthRuntimeEnv } from "@/src/auth/env";
import { sendPasswordResetEmail } from "@/src/lib/auth/email-delivery";
import { forgotPasswordBodySchema } from "@/src/lib/auth/email-auth-schema";
import { readJsonBody } from "@/src/lib/auth/email-auth-route";
import { prisma } from "@/src/lib/auth/prisma";
import { normalizeEmail } from "@/src/lib/auth/email-verification";
import { canSendAnotherResetEmail, createPasswordResetToken } from "@/src/lib/auth/password-reset";

const GENERIC_RESPONSE = { ok: true };

export async function POST(request: Request) {
  const envCheck = checkEmailAuthRuntimeEnv();
  if (!envCheck.ok) {
    return NextResponse.json(GENERIC_RESPONSE);
  }

  const body = await readJsonBody(request);
  if (!body) {
    return NextResponse.json(GENERIC_RESPONSE);
  }

  const parsed = forgotPasswordBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(GENERIC_RESPONSE);
  }

  const normalizedEmail = normalizeEmail(parsed.data.email);

  try {
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(GENERIC_RESPONSE);
    }

    const canSend = await canSendAnotherResetEmail(normalizedEmail);
    if (!canSend.ok) {
      return NextResponse.json(GENERIC_RESPONSE);
    }

    const tokenResult = await createPasswordResetToken(normalizedEmail);
    const emailResult = await sendPasswordResetEmail({
      email: normalizedEmail,
      token: tokenResult.token,
    });

    if (!emailResult.ok) {
      const failureType = emailResult.code;
      console.error(`[auth/forgot] reset email delivery failure type=${failureType}`);
    }

    return NextResponse.json(GENERIC_RESPONSE);
  } catch (error) {
    const errorName = error instanceof Error ? error.name : "unknown";
    console.error(`[auth/forgot] unavailable type=${errorName}`);
    return NextResponse.json(GENERIC_RESPONSE);
  }
}
