"use server";

import { getSession } from "@/src/auth/session";
import { isAdmin, isGrantablePlan, type GrantPlanResult } from "@/src/lib/admin/access";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Owner-only: grant (free-upgrade) a plan to an account by calling the read API admin
 * endpoint. The admin grant token is read from the server environment and sent only in
 * the backend request header — it is never returned to the client and never logged.
 */
export async function grantPlan(input: { email: string; plan: string }): Promise<GrantPlanResult> {
  // Re-check authorization on the server; never trust the page/client alone.
  const session = await getSession();
  if (!isAdmin(session)) {
    return { ok: false, detail: "forbidden" };
  }

  const email = (input?.email ?? "").trim().toLowerCase();
  const plan = (input?.plan ?? "").trim();
  if (!EMAIL_RE.test(email)) {
    return { ok: false, detail: "請輸入有效的 email。" };
  }
  if (!isGrantablePlan(plan)) {
    return { ok: false, detail: "方案不在允許清單內。" };
  }

  const base = process.env.BACKEND_API_BASE_URL?.replace(/\/$/, "");
  const token = process.env.BACKEND_ADMIN_GRANT_TOKEN;
  if (!base) {
    return { ok: false, detail: "後端 base URL 尚未設定（BACKEND_API_BASE_URL）。" };
  }
  if (!token) {
    return { ok: false, detail: "後端 admin grant token 尚未設定（BACKEND_ADMIN_GRANT_TOKEN）。" };
  }

  try {
    const response = await fetch(`${base}/v2/admin/grant-plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-grant-token": token,
      },
      body: JSON.stringify({ email, plan }),
      cache: "no-store",
    });

    const data = (await response.json().catch(() => null)) as
      | { ok?: boolean; plan?: string; subscription_id?: string | null; api_key_id?: string | null; detail?: string; error?: string; message?: string }
      | null;

    if (!response.ok) {
      const detail =
        (data && (data.detail || data.error || data.message)) || `後端回應 ${response.status}`;
      return { ok: false, detail: String(detail) };
    }

    return {
      ok: true,
      plan: data?.plan ?? plan,
      subscriptionId: data?.subscription_id ?? null,
      apiKeyId: data?.api_key_id ?? null,
    };
  } catch (error) {
    // Log only the error name — never the token, headers, or backend body.
    const errorName = error instanceof Error ? error.name : "UnknownError";
    console.warn(`[admin-grant-plan] backend request failed (${errorName})`);
    return { ok: false, detail: "呼叫後端失敗，請稍後再試。" };
  }
}
