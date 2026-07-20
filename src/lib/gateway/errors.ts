import "server-only";

// The code union + default messages live in ./error-codes (no server-only import) so the docs can
// document the real error bodies from this same source rather than a hand-typed copy.
import { GATEWAY_DEFAULT_MESSAGES as DEFAULT_MESSAGES, type GatewayErrorCode } from "./error-codes";

export type { GatewayErrorCode };

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
