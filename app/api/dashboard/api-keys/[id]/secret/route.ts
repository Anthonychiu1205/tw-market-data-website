import { NextResponse } from "next/server";

import { getSession } from "@/src/auth/session";
import { isThrottled, recordFailure } from "@/src/lib/auth/auth-throttle";
import { getApiKeySecretForUser } from "@/src/lib/api-keys/service";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: Context) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Throttle full-secret reveals per user (fail-open). Every call counts as one use;
  // a normal human never reaches 20/min, but a script scraping keys gets blocked.
  const gate = await isThrottled("secret_reveal", session.id);
  if (gate.blocked) {
    return NextResponse.json(
      { error: "too_many_requests" },
      { status: 429, headers: { "Retry-After": String(gate.retryAfterSeconds) } },
    );
  }
  await recordFailure("secret_reveal", session.id);

  // TODO(security): add step-up authentication (recent password/OAuth re-auth) before returning full API key secret.

  const params = await context.params;
  const result = await getApiKeySecretForUser({
    email: session.email,
    apiKeyId: params.id,
  });

  // Unified key model (P0): the raw sk_live_ is shown once at creation and is not retrievable
  // afterwards, so this endpoint always reports the secret as unavailable.
  return NextResponse.json({ error: result.error }, { status: 409 });
}
