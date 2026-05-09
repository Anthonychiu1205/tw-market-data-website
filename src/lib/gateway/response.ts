import "server-only";

type GatewayResponseHeaderInput = {
  requestId: string;
  planCode?: string;
  creditsCost?: number;
  dryRun?: boolean;
};

export type GatewayResponseOptions = GatewayResponseHeaderInput & {
  status: number;
  headers?: HeadersInit;
};

export type GatewayProxyResponseInput = {
  upstreamStatus: number;
  upstreamPayload: unknown;
  upstreamRawText: string | null;
  upstreamIsJson: boolean;
  upstreamHeaders?: HeadersInit;
} & GatewayResponseHeaderInput;

export function applyGatewayHeaders(headers: Headers, input: GatewayResponseHeaderInput) {
  const dryRun = input.dryRun ?? true;
  headers.set("X-Request-Id", input.requestId);
  headers.set("X-TWMD-Dry-Run", dryRun ? "true" : "false");
  if (typeof input.planCode === "string" && input.planCode.trim()) {
    headers.set("X-TWMD-Plan", input.planCode.trim());
  }
  if (typeof input.creditsCost === "number" && Number.isFinite(input.creditsCost)) {
    headers.set("X-TWMD-Credits-Cost", String(input.creditsCost));
  }
}

export function buildGatewayHeaders(input: GatewayResponseHeaderInput) {
  const headers = new Headers();
  applyGatewayHeaders(headers, input);
  return headers;
}

function mergeHeaders(baseHeaders: Headers, extraHeaders?: HeadersInit) {
  if (!extraHeaders) return;
  const extra = new Headers(extraHeaders);
  extra.forEach((value, key) => {
    baseHeaders.set(key, value);
  });
}

export function gatewayJsonResponse(body: unknown, options: GatewayResponseOptions) {
  const headers = buildGatewayHeaders(options);
  mergeHeaders(headers, options.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json; charset=utf-8");
  }
  return new Response(JSON.stringify(body), {
    status: options.status,
    headers,
  });
}

export function gatewayProxyResponse(input: GatewayProxyResponseInput) {
  const headers = buildGatewayHeaders(input);
  mergeHeaders(headers, input.upstreamHeaders);

  if (input.upstreamIsJson) {
    const payload = mergeMetaField(input.upstreamPayload, {
      creditsCost: input.creditsCost,
      dryRun: input.dryRun ?? true,
      requestId: input.requestId,
      planCode: input.planCode,
    });
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json; charset=utf-8");
    }
    return new Response(JSON.stringify(payload), {
      status: input.upstreamStatus,
      headers,
    });
  }

  return new Response(input.upstreamRawText ?? "", {
    status: input.upstreamStatus,
    headers,
  });
}

export function mergeMetaField(
  upstreamPayload: unknown,
  meta: {
    creditsCost?: number;
    dryRun: boolean;
    requestId: string;
    planCode?: string;
  },
) {
  if (!upstreamPayload || typeof upstreamPayload !== "object" || Array.isArray(upstreamPayload)) {
    return upstreamPayload;
  }

  const record = upstreamPayload as Record<string, unknown>;
  const existingMeta =
    record.meta && typeof record.meta === "object" && !Array.isArray(record.meta)
      ? (record.meta as Record<string, unknown>)
      : {};

  return {
    ...record,
    meta: {
      ...existingMeta,
      ...(typeof meta.creditsCost === "number" && Number.isFinite(meta.creditsCost)
        ? { creditsCost: meta.creditsCost }
        : {}),
      dryRun: meta.dryRun,
      requestId: meta.requestId,
      ...(typeof meta.planCode === "string" && meta.planCode.trim()
        ? { planCode: meta.planCode.trim() }
        : {}),
    },
  };
}
