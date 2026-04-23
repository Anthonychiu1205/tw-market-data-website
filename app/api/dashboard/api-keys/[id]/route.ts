import { NextResponse } from "next/server";

import { getSession } from "@/src/auth/session";
import { revokeApiKey } from "@/src/lib/backend-adapter";

type Context = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, context: Context) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const params = await context.params;
  const success = await revokeApiKey(session.email, params.id);
  if (!success) {
    return NextResponse.json({ error: "api_key_revoke_unavailable" }, { status: 503 });
  }

  return NextResponse.json({ ok: true });
}
