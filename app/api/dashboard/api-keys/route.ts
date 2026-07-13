import { NextResponse } from "next/server";

import { getSession } from "@/src/auth/session";
import { createApiKeyForUser, getApiKeysSummaryForUser } from "@/src/lib/api-keys/service";
import { SelfServeError } from "@/src/lib/api-keys/self-serve-client";
import { getDashboardEntitlementForUser } from "@/src/lib/billing/subscription";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    // Resolve the plan limit from the same authoritative entitlement the dashboard shell uses, so a
    // client refetch (after create/revoke) computes canCreate against the real plan cap, not the
    // conservative account-summary fallback. Fail-open to the account/default limit on error.
    const entitlement = await getDashboardEntitlementForUser({
      userId: session.id,
      email: session.email,
      skipBackendSummaryLookup: false,
    }).catch(() => null);

    const summary = await getApiKeysSummaryForUser(
      session.email,
      entitlement ? { planKeyLimit: entitlement.apiKeyLimit ?? null } : undefined,
    );
    return NextResponse.json(summary);
  } catch {
    // Self-serve API unreachable / error — surface a clear failure rather than a broken dashboard.
    return NextResponse.json({ error: "api_keys_unavailable" }, { status: 502 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as { name?: string } | null;

  try {
    const created = await createApiKeyForUser({
      email: session.email,
      name: payload?.name,
    });

    return NextResponse.json(
      {
        apiKey: created.apiKey,
        secret: created.secret,
        message: "請立即複製，離開後不會再次顯示。",
      },
      { status: 201 },
    );
  } catch (error) {
    const code = error instanceof Error ? error.message : "";

    if (code === "invalid_api_key_name") {
      return NextResponse.json({ error: "invalid_api_key_name" }, { status: 400 });
    }
    if (code === "self_serve_unavailable") {
      return NextResponse.json({ error: "api_keys_unavailable" }, { status: 503 });
    }

    // R2: the API owns the status semantics now (402 = paywall + payment block, 403 = has a plan but
    // it is inactive, 401 = auth). We propagate rather than re-derive — the old hard-coded table here
    // was re-mapping the API's 403 subscription_required into a 402, and would have silently drifted
    // from the API the moment either side changed.
    if (error instanceof SelfServeError) {
      // api_key_limit_reached stays 409: it is the signal this UI already understands, and it is a
      // conflict with existing state rather than a paywall.
      if (error.code === "api_key_limit_reached") {
        return NextResponse.json({ error: "api_key_limit_reached", message: error.message }, { status: 409 });
      }
      return NextResponse.json(
        {
          error: error.code,
          message: error.message,
          ...(error.payment ? { payment: error.payment } : {}),
        },
        { status: error.status },
      );
    }

    return NextResponse.json({ error: "api_key_create_failed" }, { status: 500 });
  }
}
