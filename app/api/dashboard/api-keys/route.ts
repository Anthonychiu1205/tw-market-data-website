import { NextResponse } from "next/server";

import { getSession } from "@/src/auth/session";
import { createApiKeyForUser, getApiKeysSummaryForUser } from "@/src/lib/api-keys/service";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const summary = await getApiKeysSummaryForUser(session.id);
  return NextResponse.json(summary);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as { name?: string } | null;

  try {
    const created = await createApiKeyForUser({
      userId: session.id,
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
    if (error instanceof Error && error.message === "invalid_api_key_name") {
      return NextResponse.json({ error: "invalid_api_key_name" }, { status: 400 });
    }

    if (error instanceof Error && error.message === "api_key_limit_reached") {
      return NextResponse.json({ error: "api_key_limit_reached" }, { status: 409 });
    }

    return NextResponse.json({ error: "api_key_create_failed" }, { status: 500 });
  }
}
