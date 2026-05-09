import "server-only";

import { createHash } from "crypto";

const DEFAULT_GATEWAY_CACHE_TTL_MS = 30_000;
const DEFAULT_GATEWAY_CACHE_MAX_STALE_MS = 5 * 60_000;
const DEFAULT_GATEWAY_CACHE_MAX_ENTRIES = 800;

type CachedGatewayPayload = {
  upstreamStatus: number;
  upstreamPayload: unknown;
  upstreamRawText: string | null;
  upstreamIsJson: boolean;
  upstreamHeaders: Array<[string, string]>;
};

type GatewayCacheEntry = CachedGatewayPayload & {
  cachedAt: number;
  expiresAt: number;
  staleUntil: number;
  refreshing: boolean;
};

const gatewayCache = new Map<string, GatewayCacheEntry>();

function nowMs() {
  return Date.now();
}

function parseMs(value: string | undefined, fallback: number, minimum: number) {
  const parsed = Number.parseInt(String(value ?? "").trim(), 10);
  if (Number.isFinite(parsed) && parsed >= minimum) return parsed;
  return fallback;
}

export function getGatewayCacheTtlMs() {
  return parseMs(process.env.PUBLIC_API_CACHE_TTL_MS, DEFAULT_GATEWAY_CACHE_TTL_MS, 1000);
}

export function getGatewayCacheMaxStaleMs() {
  return parseMs(process.env.PUBLIC_API_CACHE_MAX_STALE_MS, DEFAULT_GATEWAY_CACHE_MAX_STALE_MS, 1000);
}

function getGatewayCacheMaxEntries() {
  return parseMs(process.env.PUBLIC_API_CACHE_MAX_ENTRIES, DEFAULT_GATEWAY_CACHE_MAX_ENTRIES, 100);
}

export function buildGatewayCacheKey(input: { datasetSlug: string; normalizedQueryString: string }) {
  return `${input.datasetSlug}?${input.normalizedQueryString}`;
}

function shortKey(key: string) {
  return createHash("sha1").update(key).digest("hex").slice(0, 12);
}

function cleanupExpiredEntries() {
  const current = nowMs();
  for (const [key, entry] of gatewayCache.entries()) {
    if (entry.staleUntil < current) {
      gatewayCache.delete(key);
    }
  }

  const maxEntries = getGatewayCacheMaxEntries();
  if (gatewayCache.size <= maxEntries) return;

  const entries = Array.from(gatewayCache.entries()).sort((a, b) => a[1].cachedAt - b[1].cachedAt);
  const toDelete = gatewayCache.size - maxEntries;
  for (let index = 0; index < toDelete; index += 1) {
    const key = entries[index]?.[0];
    if (key) {
      gatewayCache.delete(key);
    }
  }
}

export type GatewayCacheLookupResult =
  | { status: "miss" }
  | {
      status: "fresh" | "stale";
      payload: CachedGatewayPayload;
      ageMs: number;
      cachedAt: number;
      expiresAt: number;
      staleUntil: number;
      refreshing: boolean;
    };

export function getGatewayCacheEntry(key: string): GatewayCacheLookupResult {
  cleanupExpiredEntries();

  const entry = gatewayCache.get(key);
  if (!entry) {
    console.info(`[gateway-cache] key=${shortKey(key)} hit=false stale=false ageMs=0`);
    return { status: "miss" };
  }

  const current = nowMs();
  const ageMs = Math.max(0, current - entry.cachedAt);

  if (entry.expiresAt >= current) {
    console.info(`[gateway-cache] key=${shortKey(key)} hit=true stale=false ageMs=${ageMs}`);
    return {
      status: "fresh",
      payload: {
        upstreamStatus: entry.upstreamStatus,
        upstreamPayload: entry.upstreamPayload,
        upstreamRawText: entry.upstreamRawText,
        upstreamIsJson: entry.upstreamIsJson,
        upstreamHeaders: entry.upstreamHeaders,
      },
      ageMs,
      cachedAt: entry.cachedAt,
      expiresAt: entry.expiresAt,
      staleUntil: entry.staleUntil,
      refreshing: entry.refreshing,
    };
  }

  if (entry.staleUntil >= current) {
    console.info(`[gateway-cache] key=${shortKey(key)} hit=true stale=true ageMs=${ageMs}`);
    return {
      status: "stale",
      payload: {
        upstreamStatus: entry.upstreamStatus,
        upstreamPayload: entry.upstreamPayload,
        upstreamRawText: entry.upstreamRawText,
        upstreamIsJson: entry.upstreamIsJson,
        upstreamHeaders: entry.upstreamHeaders,
      },
      ageMs,
      cachedAt: entry.cachedAt,
      expiresAt: entry.expiresAt,
      staleUntil: entry.staleUntil,
      refreshing: entry.refreshing,
    };
  }

  gatewayCache.delete(key);
  return { status: "miss" };
}

export function upsertGatewayCacheEntry(key: string, payload: CachedGatewayPayload) {
  const current = nowMs();
  const ttlMs = getGatewayCacheTtlMs();
  const maxStaleMs = getGatewayCacheMaxStaleMs();
  const entry: GatewayCacheEntry = {
    ...payload,
    cachedAt: current,
    expiresAt: current + ttlMs,
    staleUntil: current + ttlMs + maxStaleMs,
    refreshing: false,
  };
  gatewayCache.set(key, entry);
  cleanupExpiredEntries();
  console.info(`[gateway-cache] key=${shortKey(key)} hit=false stale=false ageMs=0`);
}

export function beginGatewayCacheRefresh(key: string) {
  const entry = gatewayCache.get(key);
  if (!entry) return false;
  if (entry.refreshing) return false;
  entry.refreshing = true;
  gatewayCache.set(key, entry);
  return true;
}

export function endGatewayCacheRefresh(key: string) {
  const entry = gatewayCache.get(key);
  if (!entry) return;
  entry.refreshing = false;
  gatewayCache.set(key, entry);
}
