import { NextResponse } from "next/server";

import { getSession } from "@/src/auth/session";
import { createDestination, listDestinations } from "@/src/lib/webhooks/destinations";

export const runtime = "nodejs";

// GET  /api/dashboard/webhooks         → this account's destinations (secret shown only as a hint)
// POST /api/dashboard/webhooks         → create a destination + subscription; returns the raw signing
//                                        secret ONCE (never retrievable again except via the reveal route)

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const destinations = await listDestinations(session.id);
  return NextResponse.json({ destinations });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: {
    url?: string;
    type?: string;
    eventTypes?: unknown;
    symbolFilter?: unknown;
  } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const url = typeof body.url === "string" ? body.url.trim() : "";
  if (!url) {
    return NextResponse.json({ error: "url_required" }, { status: 400 });
  }
  const eventTypes = Array.isArray(body.eventTypes) ? body.eventTypes.map((v) => String(v)) : [];
  const symbolFilter = Array.isArray(body.symbolFilter) ? body.symbolFilter.map((v) => String(v)) : [];

  const result = await createDestination({
    userId: session.id,
    url,
    type: typeof body.type === "string" ? body.type : undefined,
    eventTypes,
    symbolFilter,
  });

  if (!result.ok) {
    // unsafe_url / invalid_type / no_event_types are all caller errors → 400.
    return NextResponse.json({ error: result.error, detail: result.detail }, { status: 400 });
  }

  return NextResponse.json(
    {
      destinationId: result.destinationId,
      // Shown once. The client must copy it now; it is never returned again.
      signingSecret: result.signingSecret,
    },
    { status: 201 },
  );
}
