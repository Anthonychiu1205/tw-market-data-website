import { promises as fs } from "node:fs";
import path from "node:path";

const MARKET_ITEMS = [
  { label: "加權指數", symbol: "TAIEX" },
  { label: "櫃買指數", symbol: "OTCI" },
  { label: "台灣50", symbol: "0050" },
  { label: "電子類", symbol: "TWBETR" },
  { label: "金融類", symbol: "TWBFIN" },
] as const;

const SNAPSHOT_STALE_HOURS = 36;
const SNAPSHOT_PATH = process.env.MARKET_MARQUEE_SNAPSHOT_PATH
  ? path.resolve(process.env.MARKET_MARQUEE_SNAPSHOT_PATH)
  : path.join(process.cwd(), "data", "market-marquee-snapshot.json");

type Trend = "up" | "down" | "flat";

type AnyRecord = Record<string, unknown>;

export type MarketMarqueeSnapshotItem = {
  symbol: string;
  label: string;
  value: number;
  change: number;
  change_percent: number;
};

export type MarketMarqueeSnapshot = {
  as_of_date: string;
  updated_at: string;
  items: MarketMarqueeSnapshotItem[];
};

export type MarketMarqueeViewItem = {
  id: string;
  name: string;
  value: string;
  change: string;
  percent: string;
  trend: Trend;
};

export type MarketMarqueeViewPayload = {
  items: MarketMarqueeViewItem[];
  updatedAt: string | null;
  asOfDate: string | null;
  isFallback: boolean;
  isStale: boolean;
};

let memorySnapshot: MarketMarqueeSnapshot | null = null;

function getBaseUrl() {
  const base = process.env.BACKEND_API_BASE_URL ?? process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
  return base?.replace(/\/$/, "") ?? null;
}

function getAuthHeaders() {
  const token = process.env.BACKEND_API_TOKEN;
  return {
    "X-API-Key": "free_key",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/[,%\s]/g, "");
    if (!cleaned) return null;
    const parsed = Number(cleaned);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function getRows(payload: unknown): AnyRecord[] {
  if (!payload || typeof payload !== "object") return [];
  const rowKeys = ["rows", "data", "items", "results"];
  for (const key of rowKeys) {
    const value = (payload as AnyRecord)[key];
    if (Array.isArray(value)) {
      return value.filter((item): item is AnyRecord => !!item && typeof item === "object");
    }
  }
  return [];
}

function pickValue(row: AnyRecord): number | null {
  const keys = ["index_value", "value", "close", "last", "price", "points", "index"];
  for (const key of keys) {
    const parsed = toNumber(row[key]);
    if (parsed !== null) return parsed;
  }
  return null;
}

function pickChange(row: AnyRecord): number | null {
  const keys = ["change", "change_value", "diff", "delta", "point_change"];
  for (const key of keys) {
    const parsed = toNumber(row[key]);
    if (parsed !== null) return parsed;
  }
  return null;
}

function pickPercent(row: AnyRecord): number | null {
  const keys = ["change_percent", "pct_change", "change_pct", "percent", "return_pct"];
  for (const key of keys) {
    const parsed = toNumber(row[key]);
    if (parsed !== null) return parsed;
  }
  return null;
}

function pickAsOfDate(row: AnyRecord): string | null {
  const keys = ["date", "trade_date", "as_of_date", "updated_at"];
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.length >= 10) {
      return value.slice(0, 10);
    }
  }
  return null;
}

function toSnapshotItem(symbol: string, label: string, row: AnyRecord): MarketMarqueeSnapshotItem | null {
  const value = pickValue(row);
  if (value === null) return null;

  return {
    symbol,
    label,
    value,
    change: pickChange(row) ?? 0,
    change_percent: pickPercent(row) ?? 0,
  };
}

async function fetchMarketItem(baseUrl: string, symbol: string, label: string): Promise<{ item: MarketMarqueeSnapshotItem; asOfDate: string | null } | null> {
  const pathName = `/v2/datasets/index-market-context?symbol=${encodeURIComponent(symbol)}&limit=1`;
  const response = await fetch(`${baseUrl}${pathName}`, {
    method: "GET",
    headers: getAuthHeaders(),
    cache: "no-store",
  });

  if (!response.ok) return null;

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    return null;
  }

  const rows = getRows(payload);
  if (rows.length === 0) return null;

  const parsed = toSnapshotItem(symbol, label, rows[0]);
  if (!parsed) return null;
  return {
    item: parsed,
    asOfDate: pickAsOfDate(rows[0]),
  };
}

function formatValue(value: number) {
  return new Intl.NumberFormat("zh-TW", {
    minimumFractionDigits: value >= 1000 ? 2 : 3,
    maximumFractionDigits: value >= 1000 ? 2 : 3,
  }).format(value);
}

function formatSigned(value: number, decimals = 2) {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${Math.abs(value).toFixed(decimals)}`;
}

function toTrend(change: number): Trend {
  if (change > 0) return "up";
  if (change < 0) return "down";
  return "flat";
}

function asView(snapshot: MarketMarqueeSnapshot | null): MarketMarqueeViewPayload {
  if (!snapshot || snapshot.items.length === 0) {
    return {
      items: [],
      updatedAt: null,
      asOfDate: null,
      isFallback: true,
      isStale: false,
    };
  }

  const items: MarketMarqueeViewItem[] = snapshot.items.map((item) => ({
    id: `${item.symbol}-${item.label}`,
    name: item.label,
    value: formatValue(item.value),
    change: formatSigned(item.change, 2),
    percent: `${formatSigned(item.change_percent, 2)}%`,
    trend: toTrend(item.change),
  }));

  return {
    items,
    updatedAt: snapshot.updated_at,
    asOfDate: snapshot.as_of_date,
    isFallback: false,
    isStale: isSnapshotStale(snapshot),
  };
}

function isMarketMarqueeSnapshot(value: unknown): value is MarketMarqueeSnapshot {
  if (!value || typeof value !== "object") return false;
  const raw = value as AnyRecord;
  if (typeof raw.as_of_date !== "string" || typeof raw.updated_at !== "string" || !Array.isArray(raw.items)) {
    return false;
  }

  return raw.items.every((item) => {
    if (!item || typeof item !== "object") return false;
    const row = item as AnyRecord;
    return (
      typeof row.symbol === "string" &&
      typeof row.label === "string" &&
      typeof row.value === "number" &&
      Number.isFinite(row.value) &&
      typeof row.change === "number" &&
      Number.isFinite(row.change) &&
      typeof row.change_percent === "number" &&
      Number.isFinite(row.change_percent)
    );
  });
}

async function readSnapshotFromDisk(): Promise<MarketMarqueeSnapshot | null> {
  try {
    const file = await fs.readFile(SNAPSHOT_PATH, "utf8");
    const parsed = JSON.parse(file) as unknown;
    if (isMarketMarqueeSnapshot(parsed)) return parsed;
    return null;
  } catch {
    return null;
  }
}

async function writeSnapshotToDisk(snapshot: MarketMarqueeSnapshot): Promise<void> {
  const dir = path.dirname(SNAPSHOT_PATH);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(SNAPSHOT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
}

export function isSnapshotStale(snapshot: MarketMarqueeSnapshot): boolean {
  const updatedMs = Date.parse(snapshot.updated_at);
  if (!Number.isFinite(updatedMs)) return true;
  const staleMs = SNAPSHOT_STALE_HOURS * 60 * 60 * 1000;
  return Date.now() - updatedMs > staleMs;
}

export async function getMarketMarqueeSnapshotRaw(): Promise<MarketMarqueeSnapshot | null> {
  if (memorySnapshot) return memorySnapshot;
  const disk = await readSnapshotFromDisk();
  if (disk) {
    memorySnapshot = disk;
    return disk;
  }
  return null;
}

export async function getMarketMarqueeSnapshotView(): Promise<MarketMarqueeViewPayload> {
  const snapshot = await getMarketMarqueeSnapshotRaw();
  return asView(snapshot);
}

export async function refreshMarketMarqueeSnapshot(): Promise<{
  ok: boolean;
  snapshot: MarketMarqueeSnapshot | null;
  usedPreviousSnapshot: boolean;
  error?: string;
}> {
  const baseUrl = getBaseUrl();
  const previous = await getMarketMarqueeSnapshotRaw();

  if (!baseUrl) {
    return {
      ok: false,
      snapshot: previous,
      usedPreviousSnapshot: previous !== null,
      error: "missing BACKEND_API_BASE_URL",
    };
  }

  const results = await Promise.allSettled(MARKET_ITEMS.map((item) => fetchMarketItem(baseUrl, item.symbol, item.label)));
  const successful = results
    .map((result) => (result.status === "fulfilled" ? result.value : null))
    .filter((item): item is { item: MarketMarqueeSnapshotItem; asOfDate: string | null } => item !== null);

  if (successful.length === 0) {
    return {
      ok: false,
      snapshot: previous,
      usedPreviousSnapshot: previous !== null,
      error: "all market item requests failed",
    };
  }

  const asOfDate =
    successful.map((entry) => entry.asOfDate).find((value): value is string => typeof value === "string" && value.length > 0) ??
    new Date().toISOString().slice(0, 10);

  const snapshot: MarketMarqueeSnapshot = {
    as_of_date: asOfDate,
    updated_at: new Date().toISOString(),
    items: successful.map((entry) => entry.item),
  };

  try {
    await writeSnapshotToDisk(snapshot);
    memorySnapshot = snapshot;
    return { ok: true, snapshot, usedPreviousSnapshot: false };
  } catch {
    memorySnapshot = snapshot;
    return {
      ok: false,
      snapshot: previous ?? snapshot,
      usedPreviousSnapshot: previous !== null,
      error: "snapshot persisted in memory only",
    };
  }
}
