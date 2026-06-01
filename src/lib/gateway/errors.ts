import "server-only";

export type GatewayErrorCode =
  | "missing_api_key"
  | "invalid_api_key"
  | "api_key_lookup_unavailable"
  | "api_key_revoked"
  | "dataset_not_allowed"
  | "plan_not_entitled"
  | "insufficient_credits"
  | "dataset_not_found"
  | "upstream_timeout"
  | "upstream_error"
  | "internal_error";

const DEFAULT_MESSAGES: Record<GatewayErrorCode, string> = {
  missing_api_key: "API key is required.",
  invalid_api_key: "Invalid API key.",
  api_key_lookup_unavailable: "API key verification is temporarily unavailable.",
  api_key_revoked: "API key is revoked.",
  dataset_not_allowed: "Dataset is not allowed.",
  plan_not_entitled: "Current plan is not entitled for this dataset.",
  insufficient_credits: "Insufficient credits.",
  dataset_not_found: "Dataset not found.",
  upstream_timeout: "Upstream request timed out.",
  upstream_error: "Upstream service error.",
  internal_error: "Internal service error.",
};

export class GatewayHttpError extends Error {
  status: number;
  code: GatewayErrorCode;
  details?: Record<string, string | null | undefined>;

  constructor(
    status: number,
    code: GatewayErrorCode,
    message?: string,
    details?: Record<string, string | null | undefined>,
  ) {
    super(message ?? DEFAULT_MESSAGES[code]);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function sanitizeGatewayErrorMessage(error: unknown) {
  const defaultMessage = "operation_failed";
  if (!(error instanceof Error)) return defaultMessage;

  const redacted = error.message
    .replace(/twmd_live_[A-Za-z0-9]{8,}/g, "[REDACTED_API_KEY]")
    .replace(/\bsk-[A-Za-z0-9_-]{8,}\b/g, "[REDACTED_TOKEN]")
    .replace(/https?:\/\/[^\s]+/gi, "[REDACTED_URL]")
    .replace(/\bpostgres(?:ql)?:\/\/[^\s]+/gi, "[REDACTED_DB_URL]")
    .replace(/\b[A-Z0-9_]*(?:SECRET|TOKEN|API_KEY)[A-Z0-9_]*\b/gi, "[REDACTED_SECRET_NAME]")
    .trim();

  return redacted ? redacted.slice(0, 200) : defaultMessage;
}

export function logGatewayIssue(input: {
  level: "warn" | "error";
  requestId: string;
  stage: string;
  error: unknown;
}) {
  const errorName = input.error instanceof Error ? input.error.name : "UnknownError";
  const sanitizedMessage = sanitizeGatewayErrorMessage(input.error);
  const payload = {
    requestId: input.requestId,
    stage: input.stage,
    errorName,
    message: sanitizedMessage,
  };

  if (input.level === "warn") {
    console.warn("[gateway]", payload);
    return;
  }
  console.error("[gateway]", payload);
}

function shouldExposeDebugStage() {
  return process.env.NODE_ENV !== "production" || process.env.GATEWAY_DEBUG === "true";
}

export function createGatewayErrorBody(input: {
  code: GatewayErrorCode;
  message?: string;
  requestId: string;
  stage?: string;
}) {
  const body: Record<string, unknown> = {
    error: {
      code: input.code,
      message: input.message ?? DEFAULT_MESSAGES[input.code],
    },
    requestId: input.requestId,
  };
  if (input.stage && shouldExposeDebugStage()) {
    body.debug = { stage: input.stage };
  }
  return body;
}
