import { randomUUID } from "crypto";

import { authenticateApiKey } from "@/src/lib/gateway/auth";
import { assertDatasetEntitlement } from "@/src/lib/gateway/entitlement";
import {
  createGatewayErrorResponse,
  GatewayHttpError,
  logGatewayIssue,
  type GatewayErrorCode,
} from "@/src/lib/gateway/errors";
import { resolveDryRunMetering } from "@/src/lib/gateway/metering";
import { resolveDatasetPolicy } from "@/src/lib/gateway/policies";
import { proxyDatasetRequest } from "@/src/lib/gateway/proxy";
import { applyGatewayHeaders, mergeMetaField } from "@/src/lib/gateway/response";
import { createApiUsageEvent, deriveSymbolFromSearchParams } from "@/src/lib/gateway/usage";

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

export async function GET(request: Request, context: Context) {
  const requestId = randomUUID();
  let planCode: string | undefined;
  let creditsCost: number | undefined;
  const dryRun = true;
  let stage = "init";
  const startedAt = Date.now();
  let authUserId: string | null = null;
  let authApiKeyId: string | null = null;
  let datasetSlugForLog = "unknown";
  let endpointForLog = "/v2/datasets/unknown";
  const searchParams = new URL(request.url).searchParams;
  const symbol = deriveSymbolFromSearchParams(searchParams);
  let statusCodeForLog = 500;
  let errorCodeForLog: GatewayErrorCode | null = null;
  let requestHeaders = new Headers();

  const buildGatewayMetaHeaders = () => {
    const headers = new Headers();
    applyGatewayHeaders(headers, {
      requestId,
      planCode,
      creditsCost,
      dryRun,
    });
    return headers;
  };

  try {
    stage = "route_params";
    const params = await context.params;
    const datasetSlug = params.dataset;
    datasetSlugForLog = datasetSlug;
    endpointForLog = `/v2/datasets/${datasetSlug}`;

    stage = "dataset_policy";
    const datasetPolicy = resolveDatasetPolicy(datasetSlug);
    if (!datasetPolicy) {
      statusCodeForLog = 404;
      errorCodeForLog = "dataset_not_found";
      return createGatewayErrorResponse({
        status: 404,
        code: "dataset_not_found",
        requestId,
        headers: buildGatewayMetaHeaders(),
        stage,
      });
    }

    stage = "auth_lookup";
    const authContext = await authenticateApiKey(request);
    authUserId = authContext.userId;
    authApiKeyId = authContext.apiKeyId;
    stage = "entitlement";
    const entitlement = await assertDatasetEntitlement({
      userId: authContext.userId,
      datasetPolicy,
    });

    planCode = entitlement.planCode;
    const metering = resolveDryRunMetering(datasetPolicy);
    creditsCost = metering.creditsCost;
    stage = "proxy";
    const queryString = buildAllowedQueryString(request);

    const upstream = await proxyDatasetRequest({
      backendPath: datasetPolicy.backendPath,
      queryString,
      userEmail: authContext.userEmail,
    });

    if (upstream.status >= 500) {
      throw new GatewayHttpError(502, "upstream_error");
    }

    statusCodeForLog = upstream.status;

    const headers = new Headers(upstream.headers);
    applyGatewayHeaders(headers, {
      requestId,
      planCode,
      creditsCost,
      dryRun,
    });

    if (!upstream.isJson) {
      stage = "response";
      return new Response(upstream.rawText ?? "", {
        status: upstream.status,
        headers,
      });
    }

    const mergedPayload = mergeMetaField(upstream.payload, {
      creditsCost,
      dryRun,
      requestId,
      planCode,
    });

    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json; charset=utf-8");
    }

    stage = "response";
    return new Response(JSON.stringify(mergedPayload), {
      status: upstream.status,
      headers,
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
      requestHeaders = buildGatewayMetaHeaders();
      logGatewayIssue({
        level: error.status >= 500 ? "error" : "warn",
        requestId,
        stage,
        error,
      });

      return createGatewayErrorResponse({
        status: error.status,
        code: error.code,
        message: error.message,
        requestId,
        headers: requestHeaders,
        stage,
      });
    }

    requestHeaders = buildGatewayMetaHeaders();
    statusCodeForLog = 500;
    errorCodeForLog = "internal_error";
    stage = "unknown_internal";
    logGatewayIssue({
      level: "error",
      requestId,
      stage,
      error,
    });

    return createGatewayErrorResponse({
      status: 500,
      code: "internal_error",
      requestId,
      headers: requestHeaders,
      stage,
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
        creditsCharged: creditsCost ?? 0,
        statusCode: statusCodeForLog,
        latencyMs,
        requestId,
        errorCode: errorCodeForLog,
      });
    }
  }
}
