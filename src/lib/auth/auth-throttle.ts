import { createHash } from "node:crypto";

import { prisma } from "@/src/lib/auth/prisma";

// Per-scope window / threshold. Deliberately conservative — legitimate users never hit
// these. All DB operations are fail-open: a DB hiccup must never lock users out.
const POLICIES = {
  // a single email: at most 10 failed logins per 15 minutes
  login_email: { windowMs: 15 * 60 * 1000, max: 10 },
  // a single IP: at most 30 failed logins per 15 minutes (blocks sweeps)
  login_ip: { windowMs: 15 * 60 * 1000, max: 30 },
  // a single user: at most 20 "reveal full secret" calls per minute
  secret_reveal: { windowMs: 60 * 1000, max: 20 },
} as const;

export type ThrottleScope = keyof typeof POLICIES;

function bucket(scope: ThrottleScope, identifier: string) {
  // Hash the identifier (email / userId / ip) so it never lands in plaintext.
  const h = createHash("sha256").update(`${scope}:${identifier}`).digest("hex");
  return `${scope}:${h}`;
}

/**
 * Check whether the threshold is already exceeded. **fail-open**: any DB error returns
 * { blocked: false } so a database hiccup can never lock legitimate users out.
 */
export async function isThrottled(
  scope: ThrottleScope,
  identifier: string,
): Promise<{ blocked: boolean; retryAfterSeconds: number }> {
  const policy = POLICIES[scope];
  const b = bucket(scope, identifier);
  const since = new Date(Date.now() - policy.windowMs);
  try {
    const count = await prisma.authAttempt.count({
      where: { bucket: b, outcome: "fail", createdAt: { gte: since } },
    });
    if (count >= policy.max) {
      return { blocked: true, retryAfterSeconds: Math.ceil(policy.windowMs / 1000) };
    }
    return { blocked: false, retryAfterSeconds: 0 };
  } catch {
    // A DB wobble must not lock the user out.
    return { blocked: false, retryAfterSeconds: 0 };
  }
}

/** Record one failure (fail-open; a write failure is swallowed). */
export async function recordFailure(scope: ThrottleScope, identifier: string): Promise<void> {
  try {
    await prisma.authAttempt.create({
      data: { bucket: bucket(scope, identifier), outcome: "fail" },
    });
  } catch {
    /* ignore */
  }
}

/** On successful login: clear this email's failures so it can't be locked by prior fails. */
export async function clearFailures(scope: ThrottleScope, identifier: string): Promise<void> {
  try {
    await prisma.authAttempt.deleteMany({
      where: { bucket: bucket(scope, identifier), outcome: "fail" },
    });
  } catch {
    /* ignore */
  }
}

/** Best-effort client IP (Vercel uses x-forwarded-for); "unknown" if absent. */
export function getClientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
