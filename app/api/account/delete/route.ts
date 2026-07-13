import { NextResponse } from "next/server";

import { getSession } from "@/src/auth/session";
import { prisma } from "@/src/lib/auth/prisma";
import { deleteSelfServeAccount, SelfServeError } from "@/src/lib/api-keys/self-serve-client";

export const runtime = "nodejs";

type RetainedItem = { label: string; detail?: string };

// The API discloses what it retains for legal/tax reasons. The shape is normalized here (it may be
// a list of strings or of objects) but the CONTENT is passed through verbatim — we never paraphrase
// or drop a retention disclosure.
function normalizeRetained(value: unknown): RetainedItem[] {
  if (!Array.isArray(value)) return [];
  const items: RetainedItem[] = [];
  for (const entry of value) {
    if (typeof entry === "string") {
      items.push({ label: entry });
      continue;
    }
    if (entry && typeof entry === "object") {
      const row = entry as Record<string, unknown>;
      const label = [row.label, row.item, row.name, row.type, row.category].find(
        (candidate): candidate is string => typeof candidate === "string" && candidate.trim() !== "",
      );
      const detail = [row.detail, row.description, row.reason, row.note, row.retention].find(
        (candidate): candidate is string => typeof candidate === "string" && candidate.trim() !== "",
      );
      if (label) items.push({ label, ...(detail ? { detail } : {}) });
      else if (detail) items.push({ label: detail });
    }
  }
  return items;
}

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await deleteSelfServeAccount(session.email);
  } catch (error) {
    if (error instanceof SelfServeError) {
      // Endpoint not deployed yet (production currently answers `allow: GET` on this path).
      // Tell the client so it can fall back to the support-request path rather than dead-ending.
      if (error.status === 404 || error.status === 405) {
        return NextResponse.json({ error: "not_implemented" }, { status: 501 });
      }
      return NextResponse.json({ error: error.code, message: error.message }, { status: 502 });
    }
    return NextResponse.json({ error: "account_delete_failed" }, { status: 502 });
  }

  // The API account is gone. Now remove the website login too — onboarding/start is create-or-get,
  // so leaving the local user behind would let the next dashboard visit silently RESURRECT the
  // account. All User relations are onDelete: Cascade, so this cleans up sessions/keys/usage rows.
  // If this fails the API-side deletion still stands; report it rather than claiming a clean delete.
  let localDeleted = true;
  try {
    await prisma.user.delete({ where: { id: session.id } });
  } catch {
    localDeleted = false;
    console.error("[account-delete] API account deleted but local user delete failed", {
      userId: session.id,
    });
  }

  const billing = (payload.billing as Record<string, unknown> | undefined) ?? undefined;
  const billingNote = typeof billing?.note === "string" ? billing.note : null;

  return NextResponse.json({
    ok: true,
    retained: normalizeRetained(payload.retained),
    billingNote,
    localDeleted,
  });
}
