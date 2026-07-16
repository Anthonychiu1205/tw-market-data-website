import "server-only";

import { assertSafeDestinationUrl, MAX_PAYLOAD_BYTES, type SsrfResult } from "@/src/lib/webhooks/ssrf";

// The actual outbound POST. Every SSRF rule is enforced HERE, at send time, not just at destination
// creation — a host that was public when the destination was created can later point at a private IP,
// so we re-validate on every attempt (§A5). Redirects are never followed: a 3xx is a hard failure, so
// a 302 → http://169.254.169.254 can never be chased.

const DEFAULT_TIMEOUT_MS = 10_000;

export type DeliveryOutcome = {
  ok: boolean;
  statusCode: number | null;
  latencyMs: number;
  error: string | null;
};

export type WebhookSender = (input: {
  url: string;
  headers: Record<string, string>;
  body: string;
  timeoutMs?: number;
}) => Promise<DeliveryOutcome>;

export const postWebhook: WebhookSender = async ({ url, headers, body, timeoutMs }) => {
  const startedAt = Date.now();

  // Payload cap — a notification, never a bulk feed. Refuse oversized bodies before touching the network.
  if (Buffer.byteLength(body, "utf8") > MAX_PAYLOAD_BYTES) {
    return { ok: false, statusCode: null, latencyMs: 0, error: "payload_too_large" };
  }

  // Re-run the full SSRF pre-flight on every attempt (https-only, resolve→all-public).
  const preflight: SsrfResult = await assertSafeDestinationUrl(url);
  if (!preflight.ok) {
    return { ok: false, statusCode: null, latencyMs: Date.now() - startedAt, error: `ssrf_${preflight.reason}` };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs ?? DEFAULT_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
      // NEVER follow redirects — a 3xx to an internal host is a classic SSRF pivot.
      redirect: "manual",
      signal: controller.signal,
      cache: "no-store",
    });
    const latencyMs = Date.now() - startedAt;

    // redirect: "manual" surfaces a 3xx (status 300–399) or an opaqueredirect (status 0). Both are a
    // refusal to follow — treat as a hard failure, do not chase the Location.
    if (response.type === "opaqueredirect" || (response.status >= 300 && response.status < 400)) {
      return { ok: false, statusCode: response.status || null, latencyMs, error: "redirect_blocked" };
    }

    const ok = response.status >= 200 && response.status < 300;
    return {
      ok,
      statusCode: response.status,
      latencyMs,
      error: ok ? null : `http_${response.status}`,
    };
  } catch (error) {
    const latencyMs = Date.now() - startedAt;
    const name = error instanceof Error ? error.name : "unknown";
    return {
      ok: false,
      statusCode: null,
      latencyMs,
      error: name === "AbortError" ? "timeout" : "network_error",
    };
  } finally {
    clearTimeout(timer);
  }
};
