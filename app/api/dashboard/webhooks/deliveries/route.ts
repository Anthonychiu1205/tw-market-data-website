import { NextResponse } from "next/server";

import { getSession } from "@/src/auth/session";
import { prisma } from "@/src/lib/auth/prisma";

export const runtime = "nodejs";

// GET /api/dashboard/webhooks/deliveries → recent delivery attempts for THIS account.
//
// No such endpoint existed, so this adds it (WEBHOOK-01 read side). Deliveries are scoped to the
// logged-in user through the destination relation (WebhookDelivery has no userId of its own), so one
// account can never read another's delivery history. Read-only; the worker owns writes.

const MAX_ROWS = 50;

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const rows = await prisma.webhookDelivery.findMany({
    where: { destination: { userId: session.id } },
    orderBy: { createdAt: "desc" },
    take: MAX_ROWS,
    select: {
      id: true,
      eventId: true,
      eventType: true,
      status: true,
      attempt: true,
      statusCode: true,
      error: true,
      lastAttemptedAt: true,
      deliveredAt: true,
      createdAt: true,
      destination: { select: { url: true } },
    },
  });

  const deliveries = rows.map((row) => ({
    id: row.id,
    eventId: row.eventId,
    eventType: row.eventType,
    status: row.status,
    attempt: row.attempt,
    statusCode: row.statusCode,
    error: row.error,
    // "When" = the last attempt if there was one, else when the delivery was queued.
    at: (row.lastAttemptedAt ?? row.deliveredAt ?? row.createdAt).toISOString(),
    destinationUrl: row.destination?.url ?? null,
  }));

  return NextResponse.json({ deliveries });
}
