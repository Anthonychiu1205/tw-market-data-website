export type QueryEntry = readonly [string, string];
export type LiveRunResult = {
  status: string;
  body: string;
  usageCounted: boolean;
};

const PLACEHOLDER_TOKENS = ["<api-key>", "your_api_key_here", "twmd_live_xxx", "sk_live_xxx", "placeholder", "demo", "test_key", "$twmd_api_key", "your_api_key"];

export function sanitizeApiKeyInput(value: string): string {
  return value.trim();
}

export function isPlaceholderApiKey(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return false;
  if (/^[•*]+$/.test(normalized)) return true;
  return PLACEHOLDER_TOKENS.some((token) => normalized.includes(token));
}

export function validateApiKey(value: string): { ok: true } | { ok: false; reason: "missing" | "placeholder" } {
  const normalized = sanitizeApiKeyInput(value);
  if (!normalized) return { ok: false, reason: "missing" };
  if (isPlaceholderApiKey(normalized)) return { ok: false, reason: "placeholder" };
  return { ok: true };
}

export function mapRunErrorNotice(input: {
  status: number;
  errorCode?: string;
  requestId?: string;
}): string {
  if (input.errorCode === "api_key_lookup_unavailable") {
    return "API 金鑰驗證服務暫時不可用，請稍後再試。";
  }
  if (input.errorCode === "invalid_api_key") {
    return "API key 無效，請確認後再試。";
  }
  if (input.errorCode === "missing_api_key") {
    return "請先輸入 API key。";
  }
  if (input.status >= 500) {
    return input.requestId
      ? `服務暫時無法處理請求。請稍後再試，或附上 requestId（${input.requestId}）聯繫我們。`
      : "服務暫時無法處理請求。請稍後再試，或附上 requestId 聯繫我們。";
  }
  return "";
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
