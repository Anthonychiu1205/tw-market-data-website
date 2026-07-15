import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

import { prisma } from "@/src/lib/auth/prisma";
import { PrismaDeliveryStore } from "@/src/lib/webhooks/store";
import { createOutboxSource, OutboxNotConfiguredError } from "@/src/lib/webhooks/outbox-source";
import { runWebhookWorker } from "@/src/lib/webhooks/worker";

export const runtime = "nodejs";
// A worker tick may poll + fan out + deliver many rows; give it room but stay well under the platform cap.
export const maxDuration = 60;

// §A3 delivery worker tick. Triggered by Vercel Cron (see vercel.json) and protected by CRON_SECRET —
// the same shared-secret, constant-time pattern the credit meter uses. Fails CLOSED: no secret set =
// unusable. Each tick is idempotent (at-least-once, cursor-driven), so overlapping or missed ticks
// only ever re-deliver, never drop.

function readToken(request: Request): string {
  return (
    request.headers.get("x-cron-secret") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    ""
  ).trim();
}

function tokenMatches(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

async function handle(request: Request) {
  const expected = process.env.CRON_SECRET?.trim();
  if (!expected) {
    console.error("[webhook-worker] CRON_SECRET is not configured");
    return NextResponse.json({ ok: false, error: "worker_not_configured" }, { status: 503 });
  }
  if (!tokenMatches(readToken(request), expected)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  try {
    const result = await runWebhookWorker({
      store: new PrismaDeliveryStore(prisma),
      outbox: createOutboxSource(),
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    if (error instanceof OutboxNotConfiguredError) {
      // No outbox connection configured — fail closed, never fabricate events.
      return NextResponse.json({ ok: false, error: "outbox_not_configured" }, { status: 503 });
    }
    console.error("[webhook-worker] run failed", error);
    return NextResponse.json({ ok: false, error: "worker_run_failed" }, { status: 500 });
  }
}

// Vercel Cron issues GET; POST is accepted for manual/administrative triggering with the same auth.
export async function GET(request: Request) {
  return handle(request);
}

export async function POST(request: Request) {
  return handle(request);
}
