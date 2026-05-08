import "server-only";

export type GatewayErrorCode =
  | "invalid_api_key"
  | "api_key_revoked"
  | "dataset_not_allowed"
  | "plan_not_entitled"
  | "dataset_not_found"
  | "upstream_timeout"
  | "upstream_error"
  | "internal_error";

const DEFAULT_MESSAGES: Record<GatewayErrorCode, string> = {
  invalid_api_key: "Invalid API key.",
  api_key_revoked: "API key is revoked.",
  dataset_not_allowed: "Dataset is not allowed.",
  plan_not_entitled: "Current plan is not entitled for this dataset.",
  dataset_not_found: "Dataset not found.",
  upstream_timeout: "Upstream request timed out.",
  upstream_error: "Upstream service error.",
  internal_error: "Internal service error.",
};

export class GatewayHttpError extends Error {
  status: number;
  code: GatewayErrorCode;

  constructor(status: number, code: GatewayErrorCode, message?: string) {
    super(message ?? DEFAULT_MESSAGES[code]);
    this.status = status;
    this.code = code;
  }
}

export function createGatewayErrorResponse(input: {
  status: number;
  code: GatewayErrorCode;
  requestId: string;
  message?: string;
  headers?: HeadersInit;
}) {
  return new Response(
    JSON.stringify({
      error: {
        code: input.code,
        message: input.message ?? DEFAULT_MESSAGES[input.code],
      },
      requestId: input.requestId,
    }),
    {
      status: input.status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        ...(input.headers ?? {}),
      },
    },
  );
}

