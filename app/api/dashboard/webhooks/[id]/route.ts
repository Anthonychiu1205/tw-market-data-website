import { NextResponse } from "next/server";

import { getSession } from "@/src/auth/session";
import { setDestinationStatus, type StatusChange } from "@/src/lib/webhooks/destinations";
import { prisma } from "@/src/lib/auth/prisma";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

const ALLOWED_ACTIONS = new Set<StatusChange>(["pause", "resume", "enable"]);

// PATCH /api/dashboard/webhooks/:id   → { action: "pause" | "resume" | "enable" }
// DELETE /api/dashboard/webhooks/:id  → remove the destination (and, by cascade, its subscriptions
//                                       and delivery rows)

export async function PATCH(request: Request, context: Context) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;

  let body: { action?: string } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const action = body.action as StatusChange;
  if (!ALLOWED_ACTIONS.has(action)) {
    return NextResponse.json({ error: "invalid_action" }, { status: 400 });
  }

  const result = await setDestinationStatus({ userId: session.id, destinationId: id, action });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.error === "not_found" ? 404 : 400 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, context: Context) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;

  // Scope the delete by userId so one account cannot delete another's destination.
  const result = await prisma.webhookDestination.deleteMany({ where: { id, userId: session.id } });
  if (result.count === 0) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
