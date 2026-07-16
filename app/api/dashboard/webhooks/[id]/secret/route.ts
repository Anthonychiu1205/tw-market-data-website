import { NextResponse } from "next/server";

import { getSession } from "@/src/auth/session";
import { isThrottled, recordFailure } from "@/src/lib/auth/auth-throttle";
import { revealSigningSecret, rotateSigningSecret } from "@/src/lib/webhooks/destinations";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

// GET  /api/dashboard/webhooks/:id/secret  → reveal the raw signing secret (throttled, same key-reveal
//                                            chain as API keys — every call counts toward the limit)
// POST /api/dashboard/webhooks/:id/secret  → rotate: issue a fresh secret, return it once

export async function GET(_request: Request, context: Context) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Reuse the secret_reveal throttle bucket: a human never reveals 20×/min, a scraper does.
  const gate = await isThrottled("secret_reveal", session.id);
  if (gate.blocked) {
    return NextResponse.json(
      { error: "too_many_requests" },
      { status: 429, headers: { "Retry-After": String(gate.retryAfterSeconds) } },
    );
  }
  await recordFailure("secret_reveal", session.id);

  const { id } = await context.params;
  const result = await revealSigningSecret({ userId: session.id, destinationId: id });
  if (result.ok) {
    return NextResponse.json({ signingSecret: result.signingSecret });
  }
  return NextResponse.json({ error: result.error }, { status: result.error === "not_found" ? 404 : 502 });
}

export async function POST(_request: Request, context: Context) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  const result = await rotateSigningSecret({ userId: session.id, destinationId: id });
  if (result.ok) {
    return NextResponse.json({ signingSecret: result.signingSecret });
  }
  return NextResponse.json({ error: result.error }, { status: 404 });
}
