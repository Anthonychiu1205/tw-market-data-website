import { NextResponse } from "next/server";

import {
  getMarketMarqueePublicSnapshot,
  refreshMarketMarqueeSnapshot,
  shouldRefreshMarketMarqueeNow,
  shouldRefreshNewsSnapshotNow,
} from "@/src/lib/market-marquee-snapshot";

function unauthorized() {
  return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
}

function getRefreshSecrets() {
  return [
    process.env.MARKET_MARQUEE_REFRESH_SECRET ?? "",
    process.env.CRON_SECRET ?? "",
  ].filter((value) => value.length > 0);
}

function getRefreshToken(request: Request) {
  return request.headers.get("x-refresh-secret") ?? request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
}

function isRefreshRequest(request: Request) {
  const url = new URL(request.url);
  return url.searchParams.get("refresh") === "1";
}

async function runRefresh() {
  const marketRefreshWindow = shouldRefreshMarketMarqueeNow();
  const newsRefreshWindow = shouldRefreshNewsSnapshotNow();

  const shouldRefreshMarketIndicators = marketRefreshWindow.allowed;
  const shouldRefreshNews = newsRefreshWindow.allowed;

  if (!shouldRefreshMarketIndicators && !shouldRefreshNews) {
    const snapshot = await getMarketMarqueePublicSnapshot();
    return NextResponse.json(
      {
        ok: true,
        skipped: true,
        refreshType: "none",
        reason: marketRefreshWindow.reason,
        updatedAt: snapshot.updatedAt,
      },
      { status: 200 },
    );
  }

  const result = await refreshMarketMarqueeSnapshot({
    refreshMarketIndicators: shouldRefreshMarketIndicators,
    refreshNews: shouldRefreshNews,
  });
  const status = result.ok ? 200 : 503;

  const refreshType = shouldRefreshMarketIndicators ? "market" : shouldRefreshNews ? "news" : "none";
  const updatedAt = result.snapshot?.updatedAt ?? null;

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        refreshed: false,
        refreshType,
        skipped: false,
        updatedAt,
        error: result.error ?? "refresh_failed",
      },
      { status },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      refreshed: true,
      refreshType,
      skipped: false,
      updatedAt,
    },
    { status },
  );
}

function validateSecret(request: Request) {
  const configuredSecrets = getRefreshSecrets();
  if (configuredSecrets.length === 0) {
    return NextResponse.json({ ok: false, error: "missing_refresh_secret_env" }, { status: 503 });
  }

  const token = getRefreshToken(request);
  if (!configuredSecrets.includes(token)) {
    return unauthorized();
  }

  return null;
}

export async function GET(request: Request) {
  if (isRefreshRequest(request)) {
    const secretError = validateSecret(request);
    if (secretError) return secretError;
    return runRefresh();
  }

  // Public endpoint: return snapshot summary fields only.
  const snapshot = await getMarketMarqueePublicSnapshot();
  return NextResponse.json({ ok: true, snapshot });
}

export async function POST(request: Request) {
  const secretError = validateSecret(request);
  if (secretError) return secretError;
  return runRefresh();
}
