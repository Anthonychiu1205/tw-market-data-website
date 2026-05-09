import "server-only";

import { createHash } from "crypto";

import type { AnalyticsEventPayload, AnalyticsProperties, AnalyticsTrackResult } from "@/src/lib/analytics/types";

function nowIso() {
  return new Date().toISOString();
}

function isDebugEnabled() {
  return process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "true";
}

function maskUserId(userId: string | null | undefined) {
  if (!userId) return null;
  const hash = createHash("sha256").update(userId).digest("hex");
  return `u_${hash.slice(0, 12)}`;
}

function sanitizeString(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.length > 200 ? `${trimmed.slice(0, 200)}...` : trimmed;
}

function sanitizeProperties(properties: AnalyticsProperties | undefined) {
  if (!properties) return undefined;
  const next: AnalyticsProperties = {};

  for (const [key, value] of Object.entries(properties)) {
    const lowered = key.toLowerCase();
    if (lowered.includes("apikey") || lowered.includes("token") || lowered.includes("secret") || lowered.includes("password") || lowered.includes("database_url")) {
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

function buildCapturePayload(payload: AnalyticsEventPayload) {
  const distinctId = maskUserId(payload.context?.userId) ?? "anonymous";
  return {
    api_key: process.env.POSTHOG_API_KEY,
    event: payload.event,
    distinct_id: distinctId,
    timestamp: payload.timestamp ?? nowIso(),
    properties: {
      ...sanitizeProperties(payload.properties),
      requestId: payload.context?.requestId,
      source: payload.context?.source ?? "server",
      page: payload.context?.page,
      userIdMasked: distinctId,
    },
  };
}

async function sendToPostHog(payload: AnalyticsEventPayload): Promise<AnalyticsTrackResult> {
  const apiKey = process.env.POSTHOG_API_KEY;
  if (!apiKey) {
    return { ok: true, skipped: true, reason: "posthog_disabled" };
  }

  const host = (process.env.POSTHOG_HOST || "https://us.i.posthog.com").replace(/\/$/, "");
  const capturePayload = buildCapturePayload(payload);

  try {
    const response = await fetch(`${host}/capture/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(capturePayload),
      cache: "no-store",
    });
    if (!response.ok) {
      return { ok: false, reason: `posthog_http_${response.status}` };
    }
    return { ok: true };
  } catch {
    return { ok: false, reason: "posthog_network_error" };
  }
}

export async function trackEvent(payload: AnalyticsEventPayload): Promise<AnalyticsTrackResult> {
  const eventPayload: AnalyticsEventPayload = {
    ...payload,
    properties: sanitizeProperties(payload.properties),
    context: {
      ...payload.context,
      userId: payload.context?.userId ?? null,
      source: payload.context?.source ?? "server",
    },
    timestamp: payload.timestamp ?? nowIso(),
  };

  if (isDebugEnabled()) {
    console.info(`[analytics] event=${eventPayload.event}`, {
      properties: eventPayload.properties,
      context: {
        ...eventPayload.context,
        userId: maskUserId(eventPayload.context?.userId ?? null),
      },
    });
  }

  return sendToPostHog(eventPayload);
}

export const trackEventServer = trackEvent;

export async function trackApiEvent(input: {
  event: AnalyticsEventPayload["event"];
  requestId: string;
  userId?: string | null;
  dataset: string;
  status: number;
  latencyMs: number;
  creditsCost?: number;
  plan?: string;
}) {
  return trackEventServer({
    event: input.event,
    context: {
      source: "gateway",
      requestId: input.requestId,
      userId: input.userId ?? null,
      page: "/v2/datasets",
    },
    properties: {
      dataset: input.dataset,
      status: input.status,
      latencyMs: input.latencyMs,
      creditsCost: input.creditsCost ?? null,
      plan: input.plan ?? null,
    },
  });
}
