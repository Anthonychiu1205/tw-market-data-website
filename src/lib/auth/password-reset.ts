import { createHash, randomBytes } from "node:crypto";

import { prisma } from "@/src/lib/auth/prisma";
import { normalizeEmail } from "@/src/lib/auth/email-verification";

const RESET_TOKEN_TTL_MS = 30 * 60 * 1000;
const RESET_COOLDOWN_MS = 60 * 1000;

function getResetTokenSecret() {
  return process.env.AUTH_SECRET?.trim() || "dev-password-reset-secret-change-in-production";
}

export function hashPasswordResetToken(token: string) {
  return createHash("sha256")
    .update(`${getResetTokenSecret()}:${token}`)
    .digest("hex");
}

export function generatePasswordResetToken() {
  return randomBytes(32).toString("hex");
}

export async function canSendAnotherResetEmail(email: string) {
  const normalized = normalizeEmail(email);
  const latest = await prisma.passwordResetToken.findFirst({
    where: {
      email: normalized,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!latest) {
    return { ok: true as const };
  }

  const elapsed = Date.now() - latest.createdAt.getTime();
  if (elapsed < RESET_COOLDOWN_MS) {
    return {
      ok: false as const,
      retryAfterSeconds: Math.ceil((RESET_COOLDOWN_MS - elapsed) / 1000),
    };
  }

  return { ok: true as const };
}

export async function createPasswordResetToken(email: string) {
  const normalized = normalizeEmail(email);
  const token = generatePasswordResetToken();
  const tokenHash = hashPasswordResetToken(token);
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  await prisma.passwordResetToken.updateMany({
    where: {
      email: normalized,
      consumedAt: null,
    },
    data: {
      consumedAt: new Date(),
    },
  });

  await prisma.passwordResetToken.create({
    data: {
      email: normalized,
      tokenHash,
      expiresAt,
    },
  });

  return {
    token,
    expiresAt,
  };
}

export async function consumePasswordResetToken(token: string) {
  const tokenHash = hashPasswordResetToken(token);
  const now = Date.now();

  const record = await prisma.passwordResetToken.findFirst({
    where: {
      tokenHash,
      consumedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!record) {
    return { ok: false as const, error: "invalid_or_expired_token" as const };
  }

  if (record.expiresAt.getTime() <= now) {
    await prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { consumedAt: new Date() },
    });
    return { ok: false as const, error: "invalid_or_expired_token" as const };
  }

  await prisma.passwordResetToken.update({
    where: { id: record.id },
    data: { consumedAt: new Date() },
  });

  return {
    ok: true as const,
    email: record.email,
  };
}
