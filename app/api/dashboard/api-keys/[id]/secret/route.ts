import { NextResponse } from "next/server";

import { getSession } from "@/src/auth/session";
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

  // TODO(security): add step-up authentication (recent password/OAuth re-auth) before returning full API key secret.

  const params = await context.params;
  const result = await getApiKeySecretForUser({
    userId: session.id,
    apiKeyId: params.id,
  });

  if (!result.ok) {
    if (result.error === "not_found") {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    if (result.error === "revoked") {
      return NextResponse.json({ error: "api_key_revoked" }, { status: 409 });
    }
    return NextResponse.json({ error: "secret_unavailable" }, { status: 409 });
  }

  return NextResponse.json(
    { secret: result.secret },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
