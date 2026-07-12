import { NextResponse } from "next/server";

import { getSession } from "@/src/auth/session";
import { createApiKeyForUser, getApiKeysSummaryForUser } from "@/src/lib/api-keys/service";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const summary = await getApiKeysSummaryForUser(session.email);
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
    if (code === "api_key_limit_reached") {
      return NextResponse.json({ error: "api_key_limit_reached" }, { status: 409 });
    }
    // Self-serve gate errors (need an active subscription + entitlement to mint a key).
    if (code === "subscription_required") {
      return NextResponse.json({ error: "subscription_required" }, { status: 402 });
    }
    if (code === "entitlement_inactive") {
      return NextResponse.json({ error: "entitlement_inactive" }, { status: 403 });
    }
    if (code === "self_serve_unavailable") {
      return NextResponse.json({ error: "api_keys_unavailable" }, { status: 503 });
    }

    return NextResponse.json({ error: "api_key_create_failed" }, { status: 500 });
  }
}
