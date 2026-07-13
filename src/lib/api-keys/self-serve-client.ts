import "server-only";

// Server-side client for the API's self-serve key endpoints (P0 key-system unification).
// The account page issues/lists/revokes keys through here so keys live in the API's
// read_api_api_keys (sk_live_, sha256(raw)) and authenticate directly against api.twmarketdata.com.
// The ssv_ management token and sk_live_ raw NEVER reach the browser.

const SELF_SERVE_BASE = (
  process.env.SELF_SERVE_API_BASE_URL ??
  process.env.BACKEND_API_BASE_URL ??
  "https://api.twmarketdata.com"
).replace(/\/$/, "");

// onboarding/start rotates the management token each call, so cache it per email and reuse; on a
// 401 we refresh once (a concurrent onboarding elsewhere may have rotated it).
const TOKEN_TTL_MS = 5 * 60 * 1000;
type TokenEntry = { token: string; expiresAt: number };
const tokenCache = new Map<string, TokenEntry>();

export type PaymentBlock = {
  price: number | null;
  credits_url: string;
  purchase_hint: string;
};

export class SelfServeError extends Error {
  readonly status: number;
  readonly code: string;
  /** The API's additive `payment` object. Present on 402 (paywall) only. */
  readonly payment?: PaymentBlock;
  constructor(status: number, code: string, message?: string, payment?: PaymentBlock) {
    super(message ?? code);
    this.name = "SelfServeError";
    this.status = status;
    this.code = code;
    this.payment = payment;
  }
}

export type SelfServeKey = {
  key_id: string;
  label?: string;
  prefix?: string;
  status?: string;
  created_at?: string;
  last_used_at?: string;
  revoked_at?: string | null;
};

async function ssvFetch(path: string, init: RequestInit): Promise<Record<string, unknown>> {
  let res: Response;
  try {
    res = await fetch(`${SELF_SERVE_BASE}${path}`, { ...init, cache: "no-store" });
  } catch {
    throw new SelfServeError(503, "self_serve_unavailable", "Self-serve API unreachable");
  }
  const text = await res.text();
  let json: Record<string, unknown> = {};
  if (text) {
    try {
      json = JSON.parse(text) as Record<string, unknown>;
    } catch {
      json = {};
    }
  }
  if (!res.ok) {
    const code = typeof json.error === "string" ? json.error : "self_serve_error";
    const message = typeof json.message === "string" ? json.message : undefined;
    // 402 carries an additive `payment` block (price / credits_url / purchase_hint). Keep it on the
    // error so the route can hand the UI a real purchase CTA instead of a bare status.
    const payment =
      json.payment && typeof json.payment === "object" ? (json.payment as PaymentBlock) : undefined;
    throw new SelfServeError(res.status, code, message, payment);
  }
  return json;
}

async function fetchFreshToken(email: string): Promise<string> {
  const json = await ssvFetch("/v2/self-serve/onboarding/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customer_email: email }),
  });
  const token = typeof json.self_serve_token === "string" ? json.self_serve_token : "";
  if (!token) throw new SelfServeError(502, "onboarding_no_token", "onboarding did not return a token");
  tokenCache.set(email, { token, expiresAt: Date.now() + TOKEN_TTL_MS });
  return token;
}

async function getToken(email: string, forceRefresh = false): Promise<string> {
  if (!forceRefresh) {
    const cached = tokenCache.get(email);
    if (cached && cached.expiresAt > Date.now()) return cached.token;
  }
  return fetchFreshToken(email);
}

// Run an authed self-serve call; on a 401 (token rotated/expired) refresh the token once and retry.
async function withToken(email: string, run: (token: string) => Promise<Record<string, unknown>>) {
  const token = await getToken(email);
  try {
    return await run(token);
  } catch (error) {
    if (error instanceof SelfServeError && error.status === 401) {
      const fresh = await getToken(email, true);
      return run(fresh);
    }
    throw error;
  }
}

export async function listSelfServeKeys(email: string): Promise<SelfServeKey[]> {
  const json = await withToken(email, (token) =>
    ssvFetch("/v2/self-serve/api-keys", { method: "GET", headers: { "x-self-serve-token": token } }),
  );
  return Array.isArray(json.api_keys) ? (json.api_keys as SelfServeKey[]) : [];
}

export async function createSelfServeKey(email: string, label: string): Promise<{ key: SelfServeKey; apiKey: string }> {
  const json = await withToken(email, (token) =>
    ssvFetch("/v2/self-serve/api-keys", {
      method: "POST",
      headers: { "x-self-serve-token": token, "Content-Type": "application/json" },
      body: JSON.stringify({ label }),
    }),
  );
  const apiKey = typeof json.api_key === "string" ? json.api_key : "";
  return { key: json as SelfServeKey, apiKey };
}

// Re-fetch the full sk_live_ for a key. Only works for keys created after the API's at-rest
// encryption shipped; older (hash-only) keys make the API return secret_unavailable / 404.
export async function revealSelfServeKey(email: string, keyId: string): Promise<string> {
  const json = await withToken(email, (token) =>
    ssvFetch(`/v2/self-serve/api-keys/${encodeURIComponent(keyId)}/reveal`, {
      method: "GET",
      headers: { "x-self-serve-token": token },
    }),
  );
  return typeof json.api_key === "string" ? json.api_key : "";
}

export async function revokeSelfServeKey(email: string, keyId: string): Promise<void> {
  await withToken(email, (token) =>
    ssvFetch(`/v2/self-serve/api-keys/${encodeURIComponent(keyId)}/revoke`, {
      method: "POST",
      headers: { "x-self-serve-token": token },
    }),
  );
}

// Account-level info (subscription/plan/limit) for display + accurate canCreate.
export async function getSelfServeAccount(email: string): Promise<Record<string, unknown>> {
  const json = await withToken(email, (token) =>
    ssvFetch("/v2/self-serve/account", { method: "GET", headers: { "x-self-serve-token": token } }),
  );
  return (json.account as Record<string, unknown>) ?? json;
}
