import "server-only";

type GatewayResponseHeaderInput = {
  requestId: string;
  planCode: string;
  creditsCost: number;
  dryRun: boolean;
};

export function applyGatewayHeaders(headers: Headers, input: GatewayResponseHeaderInput) {
  headers.set("X-Request-Id", input.requestId);
  headers.set("X-TWMD-Plan", input.planCode);
  headers.set("X-TWMD-Credits-Cost", String(input.creditsCost));
  headers.set("X-TWMD-Dry-Run", input.dryRun ? "true" : "false");
}

export function createGatewayHeaders(input: GatewayResponseHeaderInput) {
  const headers = new Headers();
  applyGatewayHeaders(headers, input);
  return headers;
}

export function mergeMetaField(
  upstreamPayload: unknown,
  meta: {
    creditsCost: number;
    dryRun: boolean;
    requestId: string;
    planCode: string;
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
      creditsCost: meta.creditsCost,
      dryRun: meta.dryRun,
      requestId: meta.requestId,
      planCode: meta.planCode,
    },
  };
}

