import { NextResponse } from "next/server";

import { checkEmailAuthRuntimeEnv } from "@/src/auth/env";
import { resetPasswordBodySchema } from "@/src/lib/auth/email-auth-schema";
import { readJsonBody } from "@/src/lib/auth/email-auth-route";
import { hashPassword } from "@/src/lib/auth/email-password";
import { prisma } from "@/src/lib/auth/prisma";
import { consumePasswordResetToken } from "@/src/lib/auth/password-reset";

function errorResponse(status: number, code: "invalid_or_expired_token" | "invalid_password" | "reset_unavailable") {
  return NextResponse.json({ ok: false, code }, { status });
}

export async function POST(request: Request) {
  const envCheck = checkEmailAuthRuntimeEnv();
  if (!envCheck.ok) {
    return errorResponse(503, "reset_unavailable");
  }

  const body = await readJsonBody(request);
  if (!body) {
    return errorResponse(400, "invalid_password");
  }

  const parsed = resetPasswordBodySchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(400, "invalid_password");
  }

  try {
    const tokenResult = await consumePasswordResetToken(parsed.data.token);
    if (!tokenResult.ok) {
      return errorResponse(400, "invalid_or_expired_token");
    }

    const passwordHash = await hashPassword(parsed.data.password);
    const verifiedAt = new Date();

    await prisma.user.updateMany({
      where: {
        email: tokenResult.email,
      },
      data: {
        passwordHash,
        emailVerifiedAt: verifiedAt,
        emailVerified: verifiedAt,
      },
    });

    return NextResponse.json({ ok: true, redirectTo: "/login?reset=1" });
  } catch (error) {
    const errorName = error instanceof Error ? error.name : "unknown";
    console.error(`[auth/reset] unavailable type=${errorName}`);
    return errorResponse(500, "reset_unavailable");
  }
}
