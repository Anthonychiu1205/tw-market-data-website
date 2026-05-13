import { z } from "zod";

export const AI_RESEARCH_PROXY_ENABLED_FLAG = "AI_RESEARCH_MOCK_PROXY_ENABLED";
export const AI_RESEARCH_PROXY_BASE_URL_ENV = "AI_RESEARCH_MOCK_API_BASE_URL";
export const AI_RESEARCH_PROXY_ALLOW_PROD_FLAG =
  "AI_RESEARCH_MOCK_PROXY_ALLOW_IN_PRODUCTION";

const REQUEST_SCHEMA = z.object({
  ticker: z.string().trim().min(1),
  as_of_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  mode: z.literal("mock"),
  include_simulation: z.boolean().optional().default(true),
});

export type AiResearchProxyRequest = z.infer<typeof REQUEST_SCHEMA>;

export type ProxyFallbackReason =
  | "proxy_disabled"
  | "proxy_blocked_in_production"
  | "invalid_request"
  | "proxy_unavailable"
  | "proxy_upstream_error"
  | "proxy_invalid_response"
  | "proxy_unsafe_response";

export function parseAiResearchProxyRequest(payload: unknown): {
  ok: true;
  data: AiResearchProxyRequest;
} | {
  ok: false;
} {
  const parsed = REQUEST_SCHEMA.safeParse(payload);
  if (!parsed.success) {
    return { ok: false };
  }
  return { ok: true, data: parsed.data };
}

export function isProxyAllowedInCurrentEnv(
  nodeEnv: string | undefined,
  allowProdFlag: string | undefined,
): boolean {
  if (nodeEnv !== "production") {
    return true;
  }
  return allowProdFlag === "true";
}

export function isProxyEnabled(proxyEnabledFlag: string | undefined): boolean {
  return proxyEnabledFlag === "true";
}

export function getProxyBaseUrl(baseUrl: string | undefined): string | null {
  const normalized = baseUrl?.trim();
  if (!normalized) {
    return null;
  }
  return normalized.replace(/\/+$/, "");
}

export function hasSafeFlags(payload: unknown): boolean {
  if (!payload || typeof payload !== "object") {
    return false;
  }
  const value = payload as Record<string, unknown>;
  return (
    value.broker_execution === false &&
    value.simulation_only === true &&
    value.not_investment_advice === true
  );
}
