import { randomUUID } from "crypto";

import { authenticateApiKey } from "@/src/lib/gateway/auth";
import { assertDatasetEntitlement } from "@/src/lib/gateway/entitlement";
import { createGatewayErrorResponse, GatewayHttpError } from "@/src/lib/gateway/errors";
import { resolveDryRunMetering } from "@/src/lib/gateway/metering";
import { resolveDatasetPolicy } from "@/src/lib/gateway/policies";
import { proxyDatasetRequest } from "@/src/lib/gateway/proxy";
import { applyGatewayHeaders, mergeMetaField } from "@/src/lib/gateway/response";

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
  let planCode = "unknown";
  let creditsCost = 0;
  const dryRun = true;

  try {
    const params = await context.params;
    const datasetSlug = params.dataset;
    const datasetPolicy = resolveDatasetPolicy(datasetSlug);
    if (!datasetPolicy) {
      return createGatewayErrorResponse({
        status: 404,
        code: "dataset_not_found",
        requestId,
      });
    }

    const authContext = await authenticateApiKey(request);
    const entitlement = await assertDatasetEntitlement({
      userId: authContext.userId,
      datasetPolicy,
    });

    planCode = entitlement.planCode;
    const metering = resolveDryRunMetering(datasetPolicy);
    creditsCost = metering.creditsCost;
    const queryString = buildAllowedQueryString(request);

    const upstream = await proxyDatasetRequest({
      backendPath: datasetPolicy.backendPath,
      queryString,
      userEmail: authContext.userEmail,
    });

    const headers = new Headers(upstream.headers);
    applyGatewayHeaders(headers, {
      requestId,
      planCode,
      creditsCost,
      dryRun,
    });

    if (!upstream.isJson) {
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

    return new Response(JSON.stringify(mergedPayload), {
      status: upstream.status,
      headers,
    });
  } catch (error) {
    if (error instanceof GatewayHttpError) {
      const errorHeaders = new Headers();
      applyGatewayHeaders(errorHeaders, {
        requestId,
        planCode,
        creditsCost,
        dryRun,
      });

      return createGatewayErrorResponse({
        status: error.status,
        code: error.code,
        message: error.message,
        requestId,
        headers: errorHeaders,
      });
    }

    const errorHeaders = new Headers();
    applyGatewayHeaders(errorHeaders, {
      requestId,
      planCode,
      creditsCost,
      dryRun,
    });

    return createGatewayErrorResponse({
      status: 500,
      code: "internal_error",
      requestId,
      headers: errorHeaders,
    });
  }
}

