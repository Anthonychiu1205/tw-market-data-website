import { randomUUID } from "crypto";

import { authenticateApiKey } from "@/src/lib/gateway/auth";
import { assertDatasetEntitlement } from "@/src/lib/gateway/entitlement";
import {
  createGatewayErrorBody,
  GatewayHttpError,
  logGatewayIssue,
  type GatewayErrorCode,
} from "@/src/lib/gateway/errors";
import {
  checkCreditsAvailabilityForApiUsage,
  deductCreditsForApiUsage,
} from "@/src/lib/gateway/credits-deduction";
import { isCreditsDeductionEnabled } from "@/src/lib/billing/credits-mode";
import { resolveDryRunMetering } from "@/src/lib/gateway/metering";
import { resolveDatasetPolicy } from "@/src/lib/gateway/policies";
import { proxyDatasetRequest } from "@/src/lib/gateway/proxy";
import { gatewayJsonResponse, gatewayProxyResponse } from "@/src/lib/gateway/response";
import { createApiUsageEvent, deriveSymbolFromSearchParams } from "@/src/lib/gateway/usage";
import {
  beginGatewayCacheRefresh,
  buildGatewayCacheKey,
  endGatewayCacheRefresh,
  getGatewayCacheEntry,
  getGatewayCacheMaxStaleMs,
  getGatewayCacheTtlMs,
  upsertGatewayCacheEntry,
} from "@/src/lib/gateway/cache";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ dataset: string }>;
};

function isValidDateString(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function sanitizeSymbol(value: string) {
  const normalized = value.trim();
  if (!normalized) return "";
  if (!/^[A-Za-z0-9._-]{1,16}$/.test(normalized)) return "";
  return normalized;
}

function buildAllowedQueryString(request: Request) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams();

  const symbol = sanitizeSymbol(url.searchParams.get("symbol") ?? "");
  if (symbol) {
    searchParams.set("symbol", symbol);
  }

  const limitRaw = url.searchParams.get("limit") ?? "";
  if (limitRaw) {
    const parsedLimit = Number.parseInt(limitRaw, 10);
    if (Number.isFinite(parsedLimit) && parsedLimit > 0) {
      searchParams.set("limit", String(Math.min(parsedLimit, 100)));
    }
  }

  const startDate = (url.searchParams.get("start_date") ?? "").trim();
  if (startDate && isValidDateString(startDate)) {
    searchParams.set("start_date", startDate);
  }

  const endDate = (url.searchParams.get("end_date") ?? "").trim();
  if (endDate && isValidDateString(endDate)) {
    searchParams.set("end_date", endDate);
  }

  return searchParams.toString();
}

function applyGatewayCacheHeaders(response: Response, input: {
  cacheStatus: "HIT" | "MISS" | "STALE";
  ageMs: number;
  deductionEnabled: boolean;
}) {
  const headers = new Headers(response.headers);
  headers.set("X-TWMD-Cache", input.cacheStatus);
  headers.set("X-TWMD-Cache-Age", String(Math.max(0, Math.trunc(input.ageMs))));

  if (!input.deductionEnabled && response.status >= 200 && response.status < 300) {
    const ttlSeconds = Math.max(1, Math.floor(getGatewayCacheTtlMs() / 1000));
    const staleSeconds = Math.max(1, Math.floor(getGatewayCacheMaxStaleMs() / 1000));
    headers.set("Cache-Control", `private, max-age=${ttlSeconds}, stale-while-revalidate=${staleSeconds}`);
  }

  return new Response(response.body, {
    status: response.status,
    headers,
  });
}

async function refreshGatewayCacheInBackground(input: {
  cacheKey: string;
  backendPath: string;
  queryString: string;
  userEmail: string | null;
}) {
  if (!beginGatewayCacheRefresh(input.cacheKey)) {
    return;
  }

  try {
    const upstream = await proxyDatasetRequest({
      backendPath: input.backendPath,
      queryString: input.queryString,
      userEmail: input.userEmail,
    });

    if (upstream.status === 200) {
      upsertGatewayCacheEntry(input.cacheKey, {
        upstreamStatus: upstream.status,
        upstreamPayload: upstream.payload,
        upstreamRawText: upstream.rawText,
        upstreamIsJson: upstream.isJson,
        upstreamHeaders: Array.from(upstream.headers.entries()),
      });
    }
  } catch {
    // Ignore refresh failure and keep stale value.
  } finally {
    endGatewayCacheRefresh(input.cacheKey);
  }
}

export async function GET(request: Request, context: Context) {
  const requestId = randomUUID();
  const deductionEnabled = isCreditsDeductionEnabled();
  let planCode: string | undefined;
  let creditsCost: number | undefined;
  const dryRun = !deductionEnabled;
  let creditsCharged = 0;
  let creditsForUsageEvent = 0;
  let stage = "dataset_policy";
  const startedAt = Date.now();
  let authUserId: string | null = null;
  let authApiKeyId: string | null = null;
  let datasetSlugForLog = "unknown";
  let endpointForLog = "/v2/datasets/unknown";
  const searchParams = new URL(request.url).searchParams;
  const symbol = deriveSymbolFromSearchParams(searchParams);
  let statusCodeForLog = 500;
  let errorCodeForLog: GatewayErrorCode | null = null;
  let cacheStatusForLog: "HIT" | "MISS" | "STALE" = "MISS";
  let cacheAgeMsForLog = 0;

  try {
    const params = await context.params;
    const datasetSlug = params.dataset;
    datasetSlugForLog = datasetSlug;
    endpointForLog = `/v2/datasets/${datasetSlug}`;

    stage = "dataset_policy";
    const datasetPolicy = resolveDatasetPolicy(datasetSlug);
    if (!datasetPolicy) {
      statusCodeForLog = 404;
      errorCodeForLog = "dataset_not_found";
      return gatewayJsonResponse(createGatewayErrorBody({
        code: "dataset_not_found",
        requestId,
        stage,
      }), {
        status: 404,
        requestId,
        planCode,
        creditsCost,
        dryRun,
      });
    }

    stage = "api_key_auth";
    const authContext = await authenticateApiKey(request);
    authUserId = authContext.userId;
    authApiKeyId = authContext.apiKeyId;
    stage = "entitlement";
    const entitlement = await assertDatasetEntitlement({
      userId: authContext.userId,
      datasetPolicy,
      requestId,
    });

    planCode = entitlement.planCode;
    const metering = resolveDryRunMetering(datasetPolicy);
    creditsCost = metering.creditsCost;
    if (!deductionEnabled) {
      creditsForUsageEvent = creditsCost;
    }

    const queryString = buildAllowedQueryString(request);
    const cacheKey = buildGatewayCacheKey({
      datasetSlug,
      normalizedQueryString: queryString,
    });

    if (!deductionEnabled) {
      const cacheLookup = getGatewayCacheEntry(cacheKey);
      if (cacheLookup.status === "fresh" || cacheLookup.status === "stale") {
        cacheStatusForLog = cacheLookup.status === "fresh" ? "HIT" : "STALE";
        cacheAgeMsForLog = cacheLookup.ageMs;
        statusCodeForLog = cacheLookup.payload.upstreamStatus;

        if (cacheLookup.status === "stale") {
          void refreshGatewayCacheInBackground({
            cacheKey,
            backendPath: datasetPolicy.backendPath,
            queryString,
            userEmail: authContext.userEmail,
          });
        }

        const cachedResponse = gatewayProxyResponse({
          upstreamStatus: cacheLookup.payload.upstreamStatus,
          upstreamPayload: cacheLookup.payload.upstreamPayload,
          upstreamRawText: cacheLookup.payload.upstreamRawText,
          upstreamIsJson: cacheLookup.payload.upstreamIsJson,
          upstreamHeaders: cacheLookup.payload.upstreamHeaders,
          requestId,
          planCode,
          creditsCost,
          creditsCharged: undefined,
          dryRun,
        });

        return applyGatewayCacheHeaders(cachedResponse, {
          cacheStatus: cacheStatusForLog,
          ageMs: cacheAgeMsForLog,
          deductionEnabled,
        });
      }
    }

    if (deductionEnabled && authUserId && creditsCost > 0) {
      stage = "credits_precheck";
      const availability = await checkCreditsAvailabilityForApiUsage({
        userId: authUserId,
        credits: creditsCost,
      });
      if (!availability.sufficient) {
        statusCodeForLog = 402;
        errorCodeForLog = "insufficient_credits";
        creditsForUsageEvent = 0;
        return gatewayJsonResponse(createGatewayErrorBody({
          code: "insufficient_credits",
          requestId,
          stage,
        }), {
          status: 402,
          requestId,
          planCode,
          creditsCost,
          creditsCharged: 0,
          dryRun,
        });
      }
    }

    stage = "proxy";

    const upstream = await proxyDatasetRequest({
      backendPath: datasetPolicy.backendPath,
      queryString,
      userEmail: authContext.userEmail,
    });

    if (upstream.status === 401 || upstream.status === 403 || upstream.status >= 500) {
      throw new GatewayHttpError(502, "upstream_error", undefined, { stage: "proxy" });
    }

    statusCodeForLog = upstream.status;

    if (!deductionEnabled && upstream.status === 200) {
      upsertGatewayCacheEntry(cacheKey, {
        upstreamStatus: upstream.status,
        upstreamPayload: upstream.payload,
        upstreamRawText: upstream.rawText,
        upstreamIsJson: upstream.isJson,
        upstreamHeaders: Array.from(upstream.headers.entries()),
      });
      cacheStatusForLog = "MISS";
      cacheAgeMsForLog = 0;
    }

    if (deductionEnabled && authUserId && upstream.status >= 200 && upstream.status < 300 && (creditsCost ?? 0) > 0) {
      stage = "credits_deduction";
      const deduction = await deductCreditsForApiUsage({
        userId: authUserId,
        apiKeyId: authApiKeyId,
        datasetSlug,
        requestId,
        credits: creditsCost ?? 0,
        statusCode: upstream.status,
      });
      if (!deduction.ok) {
        if (deduction.code === "insufficient_credits") {
          statusCodeForLog = 402;
          errorCodeForLog = "insufficient_credits";
          creditsForUsageEvent = 0;
          return gatewayJsonResponse(createGatewayErrorBody({
            code: "insufficient_credits",
            requestId,
            stage,
          }), {
            status: 402,
            requestId,
            planCode,
            creditsCost,
            creditsCharged: 0,
            dryRun,
          });
        }

        throw new GatewayHttpError(500, "internal_error", "Credits deduction failed.", { stage });
      }
      creditsCharged = deduction.chargedCredits;
      creditsForUsageEvent = deduction.chargedCredits;
    } else if (deductionEnabled) {
      creditsForUsageEvent = 0;
    }

    stage = "response_build";
    const upstreamResponse = gatewayProxyResponse({
      upstreamStatus: upstream.status,
      upstreamPayload: upstream.payload,
      upstreamRawText: upstream.rawText,
      upstreamIsJson: upstream.isJson,
      upstreamHeaders: upstream.headers,
      requestId,
      planCode,
      creditsCost,
      creditsCharged: deductionEnabled ? creditsCharged : undefined,
      dryRun,
    });
    return applyGatewayCacheHeaders(upstreamResponse, {
      cacheStatus: deductionEnabled ? "MISS" : cacheStatusForLog,
      ageMs: deductionEnabled ? 0 : cacheAgeMsForLog,
      deductionEnabled,
    });
  } catch (error) {
    if (error instanceof GatewayHttpError) {
      if (!authUserId) {
        authUserId = error.details?.userId ?? null;
      }
      if (!authApiKeyId) {
        authApiKeyId = error.details?.apiKeyId ?? null;
      }
      statusCodeForLog = error.status;
      errorCodeForLog = error.code;
      stage = error.details?.stage ?? stage;
      logGatewayIssue({
        level: error.status >= 500 ? "error" : "warn",
        requestId,
        stage,
        error,
      });

      const errorResponse = gatewayJsonResponse(createGatewayErrorBody({
        code: error.code,
        message: error.message,
        requestId,
        stage,
      }), {
        status: error.status,
        requestId,
        planCode,
        creditsCost,
        creditsCharged: deductionEnabled ? creditsCharged : undefined,
        dryRun,
      });
      return applyGatewayCacheHeaders(errorResponse, {
        cacheStatus: "MISS",
        ageMs: 0,
        deductionEnabled,
      });
    }

    statusCodeForLog = 500;
    errorCodeForLog = "internal_error";
    stage = "unknown_internal";
    logGatewayIssue({
      level: "error",
      requestId,
      stage,
      error,
    });

    const internalErrorResponse = gatewayJsonResponse(createGatewayErrorBody({
      code: "internal_error",
      requestId,
      stage,
    }), {
      status: 500,
      requestId,
      planCode,
      creditsCost,
      creditsCharged: deductionEnabled ? creditsCharged : undefined,
      dryRun,
    });
    return applyGatewayCacheHeaders(internalErrorResponse, {
      cacheStatus: "MISS",
      ageMs: 0,
      deductionEnabled,
    });
  } finally {
    if (authUserId) {
      stage = "usage_logging";
      const latencyMs = Date.now() - startedAt;
      await createApiUsageEvent({
        userId: authUserId,
        apiKeyId: authApiKeyId,
        datasetSlug: datasetSlugForLog,
        endpoint: endpointForLog,
        method: "GET",
        symbol,
        creditsCharged: creditsForUsageEvent,
        statusCode: statusCodeForLog,
        latencyMs,
        requestId,
        errorCode: errorCodeForLog,
      });
    }
  }
}
