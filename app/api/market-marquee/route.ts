import { NextResponse } from "next/server";

import { getMarketMarqueeSnapshotRaw, isSnapshotStale, refreshMarketMarqueeSnapshot } from "@/src/lib/market-marquee-snapshot";

function unauthorized() {
  return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
}

function canTriggerRefresh(request: Request) {
  const configured = process.env.MARKET_MARQUEE_CRON_TOKEN;
  if (!configured) return process.env.NODE_ENV !== "production";

  const token = request.headers.get("x-cron-token") ?? request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return token === configured;
}

export async function GET() {
  const snapshot = await getMarketMarqueeSnapshotRaw();

  if (!snapshot) {
    return NextResponse.json(
      {
        ok: false,
        message: "snapshot_unavailable",
      },
      { status: 503 },
    );
  }

  return NextResponse.json({
    ok: true,
    stale: isSnapshotStale(snapshot),
    snapshot,
  });
}

export async function POST(request: Request) {
  if (!canTriggerRefresh(request)) {
    return unauthorized();
  }

  const result = await refreshMarketMarqueeSnapshot();
  const status = result.ok ? 200 : 503;

  return NextResponse.json(
    {
      ok: result.ok,
      used_previous_snapshot: result.usedPreviousSnapshot,
      error: result.error ?? null,
      snapshot: result.snapshot,
    },
    { status },
  );
}
