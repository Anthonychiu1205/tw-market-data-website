import { NextResponse } from "next/server";

import { getSession } from "@/src/auth/session";
import { revokeApiKeyForUser } from "@/src/lib/api-keys/service";

type Context = {
  params: Promise<{ id: string }>;
};

export const runtime = "nodejs";

export async function DELETE(_request: Request, context: Context) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const params = await context.params;
  const result = await revokeApiKeyForUser({
    userId: session.id,
    apiKeyId: params.id,
  });

  if (!result.ok && result.notFound) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    apiKey: result.apiKey,
    alreadyRevoked: result.alreadyRevoked,
  });
}
