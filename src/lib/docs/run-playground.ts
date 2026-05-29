export type QueryEntry = readonly [string, string];
export type LiveRunResult = {
  status: string;
  body: string;
  usageCounted: boolean;
};

const PLACEHOLDER_TOKENS = ["<api-key>", "your_api_key_here", "twmd_live_xxx", "placeholder", "demo", "test_key"];

export function sanitizeApiKeyInput(value: string): string {
  return value.trim();
}

export function isPlaceholderApiKey(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return false;
  return PLACEHOLDER_TOKENS.some((token) => normalized.includes(token));
}

export function validateApiKey(value: string): { ok: true } | { ok: false; reason: "missing" | "placeholder" } {
  const normalized = sanitizeApiKeyInput(value);
  if (!normalized) return { ok: false, reason: "missing" };
  if (isPlaceholderApiKey(normalized)) return { ok: false, reason: "placeholder" };
  return { ok: true };
}

export function maskApiKey(value: string): string {
  const normalized = sanitizeApiKeyInput(value);
  if (!normalized) return "<api-key>";
  if (normalized.length <= 8) return "••••••";
  return `${normalized.slice(0, 8)}••••••`;
}

export function buildRunUrl(endpoint: string, entries: readonly QueryEntry[]): string {
  const safeEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const params = new URLSearchParams();
  for (const [key, val] of entries) {
    params.set(key, val);
  }
  const query = params.toString();
  return query ? `${safeEndpoint}?${query}` : safeEndpoint;
}

export function createLiveRunResult(status: number | string, body: string): LiveRunResult {
  return {
    status: String(status),
    body,
    usageCounted: true,
  };
}
