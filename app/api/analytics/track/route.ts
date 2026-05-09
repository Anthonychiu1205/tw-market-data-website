import { NextResponse } from "next/server";

import { trackEventServer } from "@/src/lib/analytics/server";
import type { AnalyticsEventPayload } from "@/src/lib/analytics/types";

export const runtime = "nodejs";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidEventName(value: unknown): value is AnalyticsEventPayload["event"] {
  return typeof value === "string" && /^[a-z0-9_]{3,64}$/.test(value);
}

function parseProperties(value: unknown): AnalyticsEventPayload["properties"] {
  if (!isObject(value)) return undefined;
  const properties: Record<string, string | number | boolean | null | undefined> = {};
  for (const [key, raw] of Object.entries(value)) {
    if (
      typeof raw === "string" ||
      typeof raw === "number" ||
      typeof raw === "boolean" ||
      raw === null ||
      typeof raw === "undefined"
    ) {
      properties[key] = raw;
    }
  }
  return properties;
}

function parseContext(value: unknown): AnalyticsEventPayload["context"] {
  if (!isObject(value)) return undefined;
  const context: AnalyticsEventPayload["context"] = {};

  if (typeof value.requestId === "string") context.requestId = value.requestId;
  if (typeof value.userId === "string" || value.userId === null) context.userId = value.userId;
  if (value.source === "client" || value.source === "server" || value.source === "gateway") {
    context.source = value.source;
  }
  if (typeof value.page === "string") context.page = value.page;

  return context;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!isObject(body) || !isValidEventName(body.event)) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const payload: AnalyticsEventPayload = {
    event: body.event,
    properties: parseProperties(body.properties),
    context: parseContext(body.context),
    timestamp: typeof body.timestamp === "string" ? body.timestamp : undefined,
  };

  const result = await trackEventServer(payload);
  return NextResponse.json({ ok: result.ok, skipped: result.skipped ?? false });
}
