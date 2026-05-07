import { NextResponse } from "next/server";

import { getSession } from "@/src/auth/session";
import { getApiKeysSummary } from "@/src/lib/backend-adapter";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const summary = await getApiKeysSummary(session.email);
  return NextResponse.json(summary);
}

export async function POST(request: Request) {
  void request;
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  return NextResponse.json(
    {
      error: "api_key_issuance_disabled_beta",
      message: "API key issuance is not enabled for this beta account yet. Contact us to enable access.",
    },
    { status: 403 },
  );
}
