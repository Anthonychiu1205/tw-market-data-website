import { datasetProducts } from "@/src/content/site";

type IntegrationMode = "live" | "fallback";

export type AccountSummary = {
  plan: string;
  accessStatus: string;
  enabledDatasets: number;
  integrationMode: IntegrationMode;
};

export type BillingSummary = {
  subscriptionStatus: string;
  renewalDate: string;
  currentBalance: string;
  portalAvailable: boolean;
  checkoutAvailable: boolean;
  integrationMode: IntegrationMode;
};

export type UsageSummary = {
  monthlyUsed: number;
  monthlyQuota: number;
  rateLimitPerMin: number;
  topEndpoints: string[];
  dailyUsage: Array<{ date: string; count: number }>;
  integrationMode: IntegrationMode;
};

export type UsageRequestRow = {
  requestTimestamp: string;
  dataset: string;
  endpoint: string;
  statusCode: number | null;
  rowCount: number | null;
  planCode: string;
};

export type UsageRequestsSummary = {
  rows: UsageRequestRow[];
  integrationMode: IntegrationMode;
  insufficientCredits?: boolean;
};

export type ApiKeyItem = {
  id: string;
  name: string;
  maskedKey: string;
  lastUsed: string;
  keyValue?: string;
};

export type ApiKeysSummary = {
  keys: ApiKeyItem[];
  canCreate: boolean;
  canRevoke: boolean;
  integrationMode: IntegrationMode;
};

type FetchResult<T> = {
  data: T;
  status: number;
  path: string;
};

function getBase() {
  const base = process.env.BACKEND_API_BASE_URL;
  if (!base) return null;
  return base.replace(/\/$/, "");
}

function getHeaders(email: string) {
  const token = process.env.BACKEND_API_TOKEN;
  const selfServeToken = process.env.BACKEND_SELF_SERVE_TOKEN;
  return {
    "X-Account-Email": email,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(selfServeToken ? { "x-self-serve-token": selfServeToken } : {}),
  };
}

async function parseJsonSafe<T>(response: Response): Promise<T | null> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return null;
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

async function fetchFromCandidates<T>(
  email: string,
  paths: string[],
  init?: RequestInit,
): Promise<FetchResult<T> | null> {
  const base = getBase();
  if (!base) return null;

  for (const path of paths) {
    try {
      const response = await fetch(`${base}${path}`, {
        cache: "no-store",
        ...init,
        headers: {
          ...(init?.method && init.method !== "GET" ? { "Content-Type": "application/json" } : {}),
          ...getHeaders(email),
          ...(init?.headers ?? {}),
        },
      });

      if (!response.ok) continue;
      const json = await parseJsonSafe<T>(response);
      if (!json) {
        if (response.status === 204 || (init?.method && init.method !== "GET")) {
          return {
            data: {} as T,
            status: response.status,
            path,
          };
        }
        continue;
      }
      return {
        data: json,
        status: response.status,
        path,
      };
    } catch {
      continue;
    }
  }

  return null;
}

function getString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function getNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function getBoolean(value: unknown, fallback = false) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value === "true") return true;
    if (value === "false") return false;
  }
  return fallback;
}

function pickArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  const candidate = payload as Record<string, unknown>;
  const keys = ["keys", "data", "items", "results", "rows", "events", "daily", "points", "apiKeys", "list"];
  for (const key of keys) {
    const value = candidate[key];
    if (Array.isArray(value)) return value;
  }
  return [];
}

function normalizeDate(value: unknown): string {
  const raw = getString(value);
  if (!raw) return "-";
  return raw.length >= 10 ? raw.slice(0, 10) : raw;
}

function normalizeEndpointList(payload: unknown): string[] {
  const items = pickArray(payload);
  return items
    .map((item) => {
      if (typeof item === "string") return item;
      if (!item || typeof item !== "object") return "";
      const row = item as Record<string, unknown>;
      return getString(row.endpoint || row.path || row.name || row.route);
    })
    .filter(Boolean);
}

function normalizeApiKeyItem(item: unknown, index: number): ApiKeyItem {
  const row = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
  const rawValue = getString(row.key || row.apiKey || row.plainTextKey || row.token || row.value);
  const fallbackMasked = rawValue ? `${rawValue.slice(0, 8)}••••••` : "twmd_••••••••";
  return {
    id: getString(row.id || row.keyId, `key-${index}`),
    name: getString(row.name || row.label, `api-key-${index + 1}`),
    maskedKey: getString(row.maskedKey || row.masked_key, fallbackMasked),
    lastUsed: getString(row.lastUsed || row.last_used || row.lastUsedAt || row.last_used_at, "-"),
    keyValue: rawValue || undefined,
  };
}

export async function getAccountSummary(email: string): Promise<AccountSummary> {
  const live = await fetchFromCandidates<Record<string, unknown>>(email, [
    "/v1/account/summary",
    "/v1/account",
    "/account/summary",
  ]);

  if (live?.data) {
    const payload = live.data;
    return {
      plan: getString(payload.plan || payload.plan_name, "Developer"),
      accessStatus: getString(payload.accessStatus || payload.access_status, "Active"),
      enabledDatasets: getNumber(payload.enabledDatasets || payload.enabled_datasets, datasetProducts.length),
      integrationMode: "live",
    };
  }

  return {
    plan: "Developer",
    accessStatus: "Active",
    enabledDatasets: datasetProducts.length,
    integrationMode: "fallback",
  };
}

export async function getBillingSummary(email: string): Promise<BillingSummary> {
  const live = await fetchFromCandidates<Record<string, unknown>>(email, [
    "/v1/billing/summary",
    "/v1/billing/subscription",
    "/billing/summary",
  ]);

  if (live?.data) {
    const payload = live.data;
    return {
      subscriptionStatus: getString(payload.subscriptionStatus || payload.subscription_status, "active"),
      renewalDate: getString(payload.renewalDate || payload.renewal_date, "-"),
      currentBalance: getString(payload.currentBalance || payload.current_balance, "-"),
      portalAvailable: getBoolean(payload.portalAvailable ?? payload.portal_available, false),
      checkoutAvailable: getBoolean(payload.checkoutAvailable ?? payload.checkout_available, false),
      integrationMode: "live",
    };
  }

  return {
    subscriptionStatus: "trial",
    renewalDate: "2026-05-01",
    currentBalance: "NT$0",
    portalAvailable: false,
    checkoutAvailable: false,
    integrationMode: "fallback",
  };
}

export async function getUsageSummary(email: string): Promise<UsageSummary> {
  const selfServeSummary = await fetchFromCandidates<Record<string, unknown>>(email, [
    "/v2/self-serve/usage-summary",
  ]);

  if (selfServeSummary?.data) {
    const payload = selfServeSummary.data;
    const profile =
      (payload.current_rate_limit_profile && typeof payload.current_rate_limit_profile === "object"
        ? payload.current_rate_limit_profile
        : {}) as Record<string, unknown>;
    const top = Array.isArray(payload.top_endpoints_used) ? payload.top_endpoints_used : [];
    const topEndpoints = top
      .map((item) => (item && typeof item === "object" ? getString((item as Record<string, unknown>).endpoint) : ""))
      .filter(Boolean)
      .slice(0, 8);

    const today = new Date().toISOString().slice(0, 10);
    const dailyUsageCount = getNumber(payload.daily_quota_usage, 0);
    const fallbackDailyUsage = Array.from({ length: 35 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (34 - index));
      return {
        date: date.toISOString().slice(0, 10),
        count: date.toISOString().slice(0, 10) === today ? dailyUsageCount : 0,
      };
    });

    return {
      monthlyUsed: getNumber(payload.recent_request_count, 0),
      monthlyQuota: Math.max(getNumber(profile.quota_daily_limit, 0), 1),
      rateLimitPerMin: getNumber(profile.rate_limit_rpm, 60),
      topEndpoints,
      dailyUsage: fallbackDailyUsage,
      integrationMode: "live",
    };
  }

  const liveSummary = await fetchFromCandidates<Record<string, unknown>>(email, [
    "/v1/usage/summary",
    "/usage/summary",
  ]);

  const liveDaily = await fetchFromCandidates<Record<string, unknown> | Array<Record<string, unknown>>>(email, [
    "/v1/usage/daily",
    "/v1/usage/events/daily",
    "/usage/daily",
  ]);

  const liveTopEndpoints = await fetchFromCandidates<Record<string, unknown> | string[]>(email, [
    "/v1/usage/top-endpoints",
    "/usage/top-endpoints",
  ]);

  const dailyUsage = pickArray(liveDaily?.data)
    .map((item) => {
      const row = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
      return {
        date: normalizeDate(row.date || row.day || row.usage_date || row.event_date),
        count: getNumber(row.count || row.requests || row.total || row.usage || row.used, 0),
      };
    })
    .filter((row) => row.date !== "-")
    .sort((a, b) => a.date.localeCompare(b.date));

  if (liveSummary?.data || liveDaily?.data || liveTopEndpoints?.data) {
    const summary = (liveSummary?.data ?? {}) as Record<string, unknown>;
    const topEndpointsFromSummary = normalizeEndpointList(summary.topEndpoints || summary.top_endpoints || summary.endpoints);
    const topEndpointsFromDedicated = normalizeEndpointList(liveTopEndpoints?.data);
    const mergedTopEndpoints = (topEndpointsFromSummary.length ? topEndpointsFromSummary : topEndpointsFromDedicated).slice(0, 8);

    return {
      monthlyUsed: getNumber(summary.monthlyUsed || summary.monthly_used, 0),
      monthlyQuota: getNumber(summary.monthlyQuota || summary.monthly_quota, 250000),
      rateLimitPerMin: getNumber(summary.rateLimitPerMin || summary.rate_limit_per_min, 60),
      topEndpoints: mergedTopEndpoints,
      dailyUsage,
      integrationMode: "live",
    };
  }

  const fallbackDailyUsage = Array.from({ length: 35 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (34 - index));
    return {
      date: date.toISOString().slice(0, 10),
      count: 0,
    };
  });

  return {
    monthlyUsed: 0,
    monthlyQuota: 250000,
    rateLimitPerMin: 60,
    topEndpoints: [],
    dailyUsage: fallbackDailyUsage,
    integrationMode: "fallback",
  };
}

function normalizeUsageRequestRow(item: unknown): UsageRequestRow | null {
  const row = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
  const requestTimestamp = getString(row.request_ts || row.requestTimestamp || row.timestamp || row.created_at, "-");
  const dataset = getString(row.dataset, "");
  const endpoint = getString(row.endpoint, "");
  const statusCode = Number.isFinite(getNumber(row.status_code ?? row.status, Number.NaN))
    ? getNumber(row.status_code ?? row.status, Number.NaN)
    : Number.NaN;
  const rowCount = Number.isFinite(getNumber(row.row_count ?? row.response_rows, Number.NaN))
    ? getNumber(row.row_count ?? row.response_rows, Number.NaN)
    : Number.NaN;
  const planCode = getString(row.plan_code || row.plan || row.current_plan_id, "");

  if (!endpoint) return null;

  return {
    requestTimestamp,
    dataset: dataset || "-",
    endpoint,
    statusCode: Number.isFinite(statusCode) ? statusCode : null,
    rowCount: Number.isFinite(rowCount) ? rowCount : null,
    planCode: planCode || "-",
  };
}

export async function getUsageRequestRows(email: string): Promise<UsageRequestsSummary> {
  const base = getBase();
  if (!base) {
    return {
      rows: [],
      integrationMode: "fallback",
      insufficientCredits: false,
    };
  }

  try {
    const response = await fetch(`${base}/v2/self-serve/usage-events`, {
      cache: "no-store",
      headers: getHeaders(email),
    });
    const payload = (await parseJsonSafe<Record<string, unknown>>(response)) ?? {};

    if (response.status === 402 && getString(payload.detail) === "insufficient_credits") {
      return {
        rows: [],
        integrationMode: "live",
        insufficientCredits: true,
      };
    }

    if (!response.ok) {
      return {
        rows: [],
        integrationMode: "fallback",
        insufficientCredits: false,
      };
    }

    const rows = pickArray(payload)
      .map(normalizeUsageRequestRow)
      .filter((row): row is UsageRequestRow => Boolean(row));
    const exhaustedFromRows = rows.some((row) => row.statusCode === 402);
    return {
      rows,
      integrationMode: "live",
      insufficientCredits: exhaustedFromRows,
    };
  } catch {
    return {
      rows: [],
      integrationMode: "fallback",
      insufficientCredits: false,
    };
  }
}

export async function getApiKeysSummary(email: string): Promise<ApiKeysSummary> {
  const live = await fetchFromCandidates<Record<string, unknown> | Array<Record<string, unknown>>>(email, [
    "/v1/api-keys",
    "/api-keys",
  ]);

  if (live?.data) {
    const payload = live.data as Record<string, unknown>;
    const rows = pickArray(live.data);
    const keys = rows.map((item, index) => normalizeApiKeyItem(item, index));

    return {
      keys,
      canCreate: getBoolean(payload.canCreate ?? payload.can_create, true),
      canRevoke: getBoolean(payload.canRevoke ?? payload.can_revoke, true),
      integrationMode: "live",
    };
  }

  return {
    keys: [],
    canCreate: false,
    canRevoke: false,
    integrationMode: "fallback",
  };
}

export async function createApiKey(
  email: string,
  name?: string,
): Promise<{ key: ApiKeyItem; plainTextKey?: string; integrationMode: IntegrationMode } | null> {
  const live = await fetchFromCandidates<Record<string, unknown>>(email, ["/v1/api-keys", "/api-keys"], {
    method: "POST",
    body: JSON.stringify(name ? { name } : {}),
  });

  if (!live?.data) return null;

  const payload = live.data;
  const candidate =
    ((payload.key as Record<string, unknown> | undefined) ??
      (payload.data as Record<string, unknown> | undefined) ??
      payload) as Record<string, unknown>;
  const normalized = normalizeApiKeyItem(candidate, 0);
  const plainTextKey =
    getString(payload.plainTextKey || payload.plain_text_key || candidate.key || candidate.apiKey || candidate.token) ||
    undefined;

  return {
    key: {
      ...normalized,
      keyValue: plainTextKey ?? normalized.keyValue,
      maskedKey:
        normalized.maskedKey === "twmd_••••••••" && plainTextKey
          ? `${plainTextKey.slice(0, 8)}••••••`
          : normalized.maskedKey,
    },
    plainTextKey,
    integrationMode: "live",
  };
}

export async function revokeApiKey(email: string, keyId: string): Promise<boolean> {
  const live = await fetchFromCandidates<Record<string, unknown>>(email, [
    `/v1/api-keys/${encodeURIComponent(keyId)}`,
    `/api-keys/${encodeURIComponent(keyId)}`,
  ], {
    method: "DELETE",
  });

  return Boolean(live?.status && live.status >= 200 && live.status < 300);
}
