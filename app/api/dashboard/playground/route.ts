import { NextResponse } from "next/server";

import { getSession } from "@/src/auth/session";

type EndpointOption = { path: string; requiresSymbol: boolean; backendPath?: string };

const ENDPOINT_OPTIONS: readonly EndpointOption[] = [
  { path: "/v2/datasets/twse-daily-price", requiresSymbol: true },
  { path: "/v2/datasets/tpex-daily-price", requiresSymbol: true },
  { path: "/v2/datasets/issuer-profile", requiresSymbol: true },
  { path: "/v2/datasets/monthly-revenue", requiresSymbol: true },
  { path: "/v2/datasets/valuation-data", requiresSymbol: true },
  { path: "/v2/datasets/technical-indicators", requiresSymbol: true },
  { path: "/v2/datasets/issuer-announcements", requiresSymbol: true },
  { path: "/v2/datasets/index-data", requiresSymbol: false },
  { path: "/v2/datasets/market-breadth", requiresSymbol: false },
  { path: "/v2/datasets/interest-rate-snapshot", requiresSymbol: false },
  { path: "/v2/datasets/income-statement", requiresSymbol: true },
  { path: "/v2/datasets/cash-flow-statement", requiresSymbol: true },
  { path: "/v2/datasets/balance-sheet", requiresSymbol: true },
  { path: "/v2/datasets/institutional-flow", requiresSymbol: true },
  { path: "/v2/datasets/securities-lending", backendPath: "/v2/datasets/chip-deep-securities-lending-daily", requiresSymbol: true },
  { path: "/v2/datasets/margin-short", requiresSymbol: true },
  { path: "/v2/datasets/events", requiresSymbol: true },
  { path: "/v2/datasets/structured-events", requiresSymbol: true },
  { path: "/v2/datasets/corporate-actions", requiresSymbol: true },
  { path: "/v2/datasets/dividends", requiresSymbol: true },
  { path: "/v2/datasets/theme-taxonomy", requiresSymbol: false },
  { path: "/v2/datasets/index-classification", requiresSymbol: false },
  { path: "/v2/datasets/company-news", requiresSymbol: true },
  { path: "/v2/datasets/market-news", requiresSymbol: false },
];

function getBackendBaseUrl() {
  const base = process.env.BACKEND_API_BASE_URL;
  return base ? base.replace(/\/$/, "") : null;
}

type PlaygroundPayload = {
  endpoint?: string;
  apiKey?: string;
  symbol?: string;
  limit?: number;
  period?: string;
  startDate?: string;
  endDate?: string;
};

function sanitizeDate(value?: string) {
  if (!value) return "";
  const normalized = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return "";
  return normalized;
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const baseUrl = getBackendBaseUrl();
  if (!baseUrl) {
    return NextResponse.json({ error: "backend_base_url_missing" }, { status: 503 });
  }

  let payload: PlaygroundPayload = {};
  try {
    payload = (await request.json()) as PlaygroundPayload;
  } catch {
    payload = {};
  }

  const endpoint = typeof payload.endpoint === "string" ? payload.endpoint.trim() : "";
  const endpointConfig = ENDPOINT_OPTIONS.find((item) => item.path === endpoint);
  if (!endpointConfig) {
    return NextResponse.json({ error: "invalid_endpoint" }, { status: 400 });
  }

  const apiKey = typeof payload.apiKey === "string" ? payload.apiKey.trim() : "";
  if (!apiKey) {
    return NextResponse.json({ error: "missing_api_key" }, { status: 400 });
  }

  const symbol = typeof payload.symbol === "string" ? payload.symbol.trim() : "";
  if (endpointConfig.requiresSymbol && !symbol) {
    return NextResponse.json({ error: "missing_symbol" }, { status: 400 });
  }

  const query = new URLSearchParams();
  if (symbol) {
    query.set("symbol", symbol);
  }

  const limit = Number(payload.limit);
  if (Number.isFinite(limit) && limit > 0) {
    query.set("limit", String(Math.min(Math.floor(limit), 100)));
  } else {
    query.set("limit", "5");
  }

  if (typeof payload.period === "string" && payload.period.trim()) {
    query.set("period", payload.period.trim());
  }

  const startDate = sanitizeDate(payload.startDate);
  const endDate = sanitizeDate(payload.endDate);
  if (startDate) query.set("start_date", startDate);
  if (endDate) query.set("end_date", endDate);

  const targetPath = endpointConfig.backendPath ?? endpoint;
  const targetUrl = `${baseUrl}${targetPath}?${query.toString()}`;

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      cache: "no-store",
      headers: {
        "x-api-key": apiKey,
      },
    });

    let body: unknown;
    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      body = await response.json().catch(() => ({ error: "invalid_json_response" }));
    } else {
      body = { raw: await response.text().catch(() => "") };
    }

    return NextResponse.json(
      {
        ok: response.ok,
        status: response.status,
        endpoint,
        request: {
          symbol: symbol || null,
          limit: query.get("limit"),
          period: query.get("period") ?? null,
          start_date: query.get("start_date") ?? null,
          end_date: query.get("end_date") ?? null,
        },
        response: body,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json({ error: "playground_request_failed", status: 502 }, { status: 502 });
  }
}
