import { NextResponse } from "next/server";
import {
  AI_RESEARCH_PROXY_ALLOW_PROD_FLAG,
  AI_RESEARCH_PROXY_BASE_URL_ENV,
  AI_RESEARCH_PROXY_ENABLED_FLAG,
  getProxyBaseUrl,
  hasSafeFlags,
  isProxyAllowedInCurrentEnv,
  isProxyEnabled,
  parseAiResearchProxyRequest,
  type ProxyFallbackReason,
} from "@/src/lib/ai-research/local-mock-proxy";

function createFallback(reason: ProxyFallbackReason, status = 200) {
  return NextResponse.json(
    {
      ok: false,
      reason,
      fallback_required: true,
    },
    { status },
  );
}

export async function POST(request: Request) {
  if (
    !isProxyAllowedInCurrentEnv(
      process.env.NODE_ENV,
      process.env[AI_RESEARCH_PROXY_ALLOW_PROD_FLAG],
    )
  ) {
    return createFallback("proxy_blocked_in_production", 404);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return createFallback("invalid_request", 400);
  }

  const parsed = parseAiResearchProxyRequest(body);
  if (!parsed.ok) {
    return createFallback("invalid_request", 400);
  }

  if (!isProxyEnabled(process.env[AI_RESEARCH_PROXY_ENABLED_FLAG])) {
    return createFallback("proxy_disabled");
  }

  const baseUrl = getProxyBaseUrl(process.env[AI_RESEARCH_PROXY_BASE_URL_ENV]);
  if (!baseUrl) {
    return createFallback("proxy_disabled");
  }

  const upstreamBody = {
    ticker: parsed.data.ticker,
    as_of_date: parsed.data.as_of_date,
    mode: "mock",
    include_simulation: parsed.data.include_simulation,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const upstreamResponse = await fetch(`${baseUrl}/v1/research/ticker`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(upstreamBody),
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (!upstreamResponse.ok) {
      return createFallback("proxy_upstream_error");
    }

    let upstreamPayload: unknown;
    try {
      upstreamPayload = await upstreamResponse.json();
    } catch {
      return createFallback("proxy_invalid_response");
    }

    if (!hasSafeFlags(upstreamPayload)) {
      return createFallback("proxy_unsafe_response");
    }

    return NextResponse.json({
      ok: true,
      source: "tw_ai_mock_proxy",
      data: upstreamPayload,
    });
  } catch {
    clearTimeout(timeoutId);
    return createFallback("proxy_unavailable");
  }
}
