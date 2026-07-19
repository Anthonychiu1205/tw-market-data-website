import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { DEMO_CACHE_TAG } from "@/src/lib/homepage/demo-real-data-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Daily Vercel Cron (see vercel.json) that refreshes the homepage demo data. The demo fetches are
// cached until deploy (revalidate:false) for cost — this expires their Data Cache tag once a day so
// the keyless panels' as_of keeps up with the latest trading day at ~1 fetch/combo/day (no per-request
// cost). Protected by CRON_SECRET, matching the webhook worker cron.
export async function GET(request: Request): Promise<Response> {
  const provided =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    new URL(request.url).searchParams.get("secret") ??
    "";
  const expected = process.env.CRON_SECRET?.trim();
  if (!expected) {
    console.error("[refresh-demo] CRON_SECRET is not configured");
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 500 });
  }
  if (provided !== expected) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  // Next 16 requires a cache-life profile as the 2nd arg; { expire: 0 } purges the tag immediately so
  // the next homepage render re-fetches the demo data (as_of catches up to the latest trading day).
  revalidateTag(DEMO_CACHE_TAG, { expire: 0 });
  console.warn(`[refresh-demo] revalidated tag ${DEMO_CACHE_TAG}`);
  return NextResponse.json({ ok: true, tag: DEMO_CACHE_TAG });
}
