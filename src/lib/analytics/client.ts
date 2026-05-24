"use client";

import {
  hasAnalyticsConsent,
} from "@/src/lib/analytics/consent";
import type { AnalyticsEventPayload, AnalyticsProperties, AnalyticsTrackResult } from "@/src/lib/analytics/types";

const DEDUPE_EVENTS_MS = 1200;
const sentEventMap = new Map<string, number>();

function nowMs() {
  return Date.now();
}

function cleanStaleDedupeEntries() {
  const now = nowMs();
  for (const [key, ts] of sentEventMap.entries()) {
    if (now - ts > DEDUPE_EVENTS_MS * 3) {
      sentEventMap.delete(key);
    }
  }
}

function isDebugEnabled() {
  return process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "true";
}

function sanitizeString(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.length > 180) return `${trimmed.slice(0, 180)}...`;
  return trimmed;
}

function sanitizeProperties(properties: AnalyticsProperties | undefined) {
  if (!properties) return undefined;
  const next: AnalyticsProperties = {};
  for (const [key, value] of Object.entries(properties)) {
    const lowered = key.toLowerCase();
    if (lowered.includes("apikey") || lowered.includes("token") || lowered.includes("secret") || lowered.includes("password")) {
      continue;
    }

    if (typeof value === "string") {
      next[key] = sanitizeString(value);
      continue;
    }

    if (typeof value === "number" || typeof value === "boolean" || value == null) {
      next[key] = value;
    }
  }
  return next;
}

function buildDedupeKey(payload: AnalyticsEventPayload, dedupeKey?: string) {
  if (dedupeKey) return `${payload.event}:${dedupeKey}`;
  return `${payload.event}:${JSON.stringify(payload.properties ?? {})}`;
}

export async function trackEvent(
  payload: AnalyticsEventPayload,
  options?: { dedupeKey?: string; dedupeMs?: number },
): Promise<AnalyticsTrackResult> {
  if (!hasAnalyticsConsent()) {
    return { ok: true, skipped: true, reason: "consent_denied" };
  }

  const dedupeWindow = options?.dedupeMs ?? DEDUPE_EVENTS_MS;
  const dedupeKey = buildDedupeKey(payload, options?.dedupeKey);
  const previousTs = sentEventMap.get(dedupeKey);
  const now = nowMs();

  if (typeof previousTs === "number" && now - previousTs <= dedupeWindow) {
    return { ok: true, skipped: true, reason: "deduped" };
  }

  sentEventMap.set(dedupeKey, now);
  cleanStaleDedupeEntries();

  const body: AnalyticsEventPayload = {
    ...payload,
    properties: sanitizeProperties(payload.properties),
    context: {
      ...payload.context,
      source: payload.context?.source ?? "client",
    },
    timestamp: payload.timestamp ?? new Date().toISOString(),
  };

  if (isDebugEnabled()) {
    console.info(`[analytics] event=${body.event}`, {
      properties: body.properties,
      context: body.context,
    });
  }

  try {
    await fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export async function trackPage(pathname: string) {
  const normalized = pathname.trim();
  if (!normalized) return;

  if (normalized === "/pricing") {
    await trackEvent({
      event: "pricing_viewed",
      properties: { pathname: normalized },
      context: { source: "client", page: normalized },
    }, { dedupeKey: `page:${normalized}`, dedupeMs: 15_000 });
    return;
  }

  if (normalized === "/help" || normalized === "/help-center" || normalized.startsWith("/help-center/") || normalized === "/faq") {
    await trackEvent({
      event: "help_center_viewed",
      properties: { pathname: normalized },
      context: { source: "client", page: normalized },
    }, { dedupeKey: `page:${normalized}`, dedupeMs: 15_000 });
    return;
  }

  if (normalized.startsWith("/docs/sdk/python-sdk") || normalized.startsWith("/docs/sdk/javascript-sdk")) {
    await trackEvent({
      event: "sdk_docs_viewed",
      properties: { pathname: normalized },
      context: { source: "client", page: normalized },
    }, { dedupeKey: `page:${normalized}`, dedupeMs: 15_000 });
    return;
  }

  if (normalized.startsWith("/docs/ai-agents/mcp-server-preview") || normalized.startsWith("/docs/tools-and-mcp")) {
    await trackEvent({
      event: "mcp_docs_viewed",
      properties: { pathname: normalized },
      context: { source: "client", page: normalized },
    }, { dedupeKey: `page:${normalized}`, dedupeMs: 15_000 });
  }
}

export async function trackApiEvent(input: {
  event: AnalyticsEventPayload["event"];
  requestId?: string;
  dataset?: string;
  status?: number;
  latencyMs?: number;
  creditsCost?: number;
  plan?: string;
}) {
  return trackEvent(
    {
      event: input.event,
      context: {
        source: "client",
        requestId: input.requestId,
      },
      properties: {
        dataset: input.dataset,
        status: input.status,
        latencyMs: input.latencyMs,
        creditsCost: input.creditsCost,
        plan: input.plan,
      },
    },
    { dedupeKey: `api:${input.event}:${input.requestId ?? "none"}`, dedupeMs: 5000 },
  );
}
