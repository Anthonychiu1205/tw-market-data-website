import { createHash, randomInt, randomUUID, timingSafeEqual } from "node:crypto";

import { prisma } from "@/src/lib/auth/prisma";

const VERIFICATION_CODE_TTL_MS = 10 * 60 * 1000;
const VERIFICATION_COOLDOWN_MS = 60 * 1000;
const MAX_VERIFY_ATTEMPTS = 5;
const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

function getVerificationHashSecret() {
  return process.env.AUTH_SECRET?.trim() || "dev-email-verification-secret-change-in-production";
}

function normalizeSixDigits(input: string) {
  return input.replace(/\D/g, "").slice(0, 6);
}

export function normalizeEmail(rawEmail: string) {
  return rawEmail.trim().toLowerCase();
}

export function generateVerificationCode() {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

export function hashVerificationCode(email: string, code: string) {
  const normalizedCode = normalizeSixDigits(code);
  const normalizedEmail = normalizeEmail(email);
  return createHash("sha256")
    .update(`${getVerificationHashSecret()}:${normalizedEmail}:${normalizedCode}`)
    .digest("hex");
}

export function isValidVerificationCodeFormat(input: string) {
  return /^\d{6}$/.test(input);
}

function safeEqualHexHash(leftHex: string, rightHex: string) {
  const left = Buffer.from(leftHex, "hex");
  const right = Buffer.from(rightHex, "hex");

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

export function resolveSessionCookieName() {
  return process.env.NODE_ENV === "production" ? "__Secure-authjs.session-token" : "authjs.session-token";
}

export function sessionExpiryDate() {
  return new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);
}

export async function createSessionTokenForUser(userId: string) {
  const sessionToken = `${randomUUID()}${randomUUID()}`;
  const expires = sessionExpiryDate();

  await prisma.session.create({
    data: {
      sessionToken,
      userId,
      expires,
    },
  });

  return {
    sessionToken,
    expires,
    maxAgeSeconds: SESSION_MAX_AGE_SECONDS,
  };
}

export async function getLatestVerificationCodeRecord(email: string) {
  return await prisma.emailVerificationCode.findFirst({
    where: {
      email: normalizeEmail(email),
      consumedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createEmailVerificationCode(
  email: string,
  options?: { pendingPasswordHash?: string | null },
) {
  const normalizedEmail = normalizeEmail(email);
  const latest = await getLatestVerificationCodeRecord(normalizedEmail);
  const code = generateVerificationCode();
  const codeHash = hashVerificationCode(normalizedEmail, code);
  const expiresAt = new Date(Date.now() + VERIFICATION_CODE_TTL_MS);
  const pendingPasswordHash =
    options?.pendingPasswordHash === undefined
      ? (latest?.pendingPasswordHash ?? null)
      : options.pendingPasswordHash;

  await prisma.emailVerificationCode.updateMany({
    where: {
      email: normalizedEmail,
      consumedAt: null,
    },
    data: {
      consumedAt: new Date(),
    },
  });

  await prisma.emailVerificationCode.create({
    data: {
      email: normalizedEmail,
      codeHash,
      pendingPasswordHash: pendingPasswordHash ?? null,
      expiresAt,
    },
  });

  return {
    code,
    expiresAt,
  };
}

export async function canSendAnotherVerificationCode(email: string) {
  const latest = await getLatestVerificationCodeRecord(email);
  if (!latest) {
    return { ok: true as const };
  }

  const elapsed = Date.now() - latest.createdAt.getTime();
  if (elapsed < VERIFICATION_COOLDOWN_MS) {
    return {
      ok: false as const,
      retryAfterSeconds: Math.ceil((VERIFICATION_COOLDOWN_MS - elapsed) / 1000),
    };
  }

  return { ok: true as const };
}

export async function consumeVerificationCodeIfValid(email: string, code: string) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedCode = normalizeSixDigits(code);

  if (!isValidVerificationCodeFormat(normalizedCode)) {
    return {
      ok: false as const,
      error: "invalid_code_format" as const,
    };
  }

  const record = await getLatestVerificationCodeRecord(normalizedEmail);
  if (!record) {
    return {
      ok: false as const,
      error: "verification_not_found" as const,
    };
  }

  if (record.consumedAt) {
    return {
      ok: false as const,
      error: "code_already_used" as const,
    };
  }

  if (record.expiresAt.getTime() <= Date.now()) {
    await prisma.emailVerificationCode.update({
      where: { id: record.id },
      data: { consumedAt: new Date() },
    });

    return {
      ok: false as const,
      error: "code_expired" as const,
    };
  }

  if (record.attempts >= MAX_VERIFY_ATTEMPTS) {
    return {
      ok: false as const,
      error: "too_many_attempts" as const,
    };
  }

  const expectedHash = hashVerificationCode(normalizedEmail, normalizedCode);
  const isMatch = safeEqualHexHash(record.codeHash, expectedHash);

  if (!isMatch) {
    const nextAttempts = record.attempts + 1;
    await prisma.emailVerificationCode.update({
      where: { id: record.id },
      data: {
        attempts: nextAttempts,
        consumedAt: nextAttempts >= MAX_VERIFY_ATTEMPTS ? new Date() : null,
      },
    });

    return {
      ok: false as const,
      error: nextAttempts >= MAX_VERIFY_ATTEMPTS ? ("too_many_attempts" as const) : ("invalid_code" as const),
    };
  }

  await prisma.emailVerificationCode.update({
    where: { id: record.id },
    data: {
      consumedAt: new Date(),
    },
  });

  return {
    ok: true as const,
    verification: {
      email: record.email,
      pendingPasswordHash: record.pendingPasswordHash ?? null,
    },
  };
}
