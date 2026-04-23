import { NextResponse } from "next/server";

import { getSession } from "@/src/auth/session";
import { createApiKey, getApiKeysSummary } from "@/src/lib/backend-adapter";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const summary = await getApiKeysSummary(session.email);
  return NextResponse.json(summary);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let payload: { name?: string } = {};
  try {
    payload = (await request.json()) as { name?: string };
  } catch {
    payload = {};
  }

  const result = await createApiKey(session.email, payload.name);
  if (!result) {
    return NextResponse.json({ error: "api_key_create_unavailable" }, { status: 503 });
  }

  return NextResponse.json(result, { status: 201 });
}
