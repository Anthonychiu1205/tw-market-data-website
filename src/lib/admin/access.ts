// Owner-only admin access. Kept in a plain module (no "use server"/"use client") so
// both the page (server) and the form (client) can import the shared constants, and
// the server action can reuse the gate.

export const OWNER_EMAIL = "anthonyiaaan@gmail.com";

export const GRANTABLE_PLANS = ["free", "starter", "pro", "max", "developer"] as const;
export type GrantablePlan = (typeof GRANTABLE_PLANS)[number];

export function isGrantablePlan(value: string): value is GrantablePlan {
  return (GRANTABLE_PLANS as readonly string[]).includes(value);
}

export type GrantPlanResult =
  | { ok: true; plan: string; subscriptionId: string | null; apiKeyId: string | null }
  | { ok: false; detail: string };

/**
 * Admin gate: a next-auth `role === "admin"`, or the owner email. Accepts a minimal
 * session-like shape so both AppSession and raw session.user can be passed.
 */
export function isAdmin(session: { role?: string | null; email?: string | null } | null | undefined): boolean {
  if (!session) return false;
  if (session.role === "admin") return true;
  return (session.email ?? "").trim().toLowerCase() === OWNER_EMAIL;
}
