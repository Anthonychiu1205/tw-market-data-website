// The gateway's error CONTRACT — the code union and the exact default message string sent to callers.
//
// Split out of errors.ts (which is `server-only`) so the docs can document the real error bodies from
// the same source the gateway actually serves them from, instead of keeping a second hand-typed copy
// that silently drifts (rule 1). This module must stay free of server-only imports and side effects.
//
// Note the public OpenAPI spec still describes an older, uppercase error shape (INVALID_QUERY, …).
// THIS file is the truth: the gateway emits these lowercase snake_case codes with these messages.

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

export const GATEWAY_DEFAULT_MESSAGES: Record<GatewayErrorCode, string> = {
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

// The HTTP status each code is actually thrown with, traced to the throw sites:
//   401 missing_api_key / invalid_api_key      src/lib/gateway/auth.ts
//   403 api_key_revoked                        src/lib/gateway/auth.ts
//   403 plan_not_entitled                      src/lib/gateway/entitlement.ts
//   402 insufficient_credits                   app/v2/datasets/[dataset]/route.ts
//   404 dataset_not_found                      app/v2/datasets/[dataset]/route.ts
//   502 upstream_error / 504 upstream_timeout  src/lib/gateway/proxy.ts
//   503 api_key_lookup_unavailable             src/lib/gateway/auth.ts
//   500 internal_error                         app/v2/datasets/[dataset]/route.ts
export const GATEWAY_ERROR_STATUS: Record<GatewayErrorCode, number> = {
  missing_api_key: 401,
  invalid_api_key: 401,
  api_key_lookup_unavailable: 503,
  api_key_revoked: 403,
  dataset_not_allowed: 403,
  plan_not_entitled: 403,
  insufficient_credits: 402,
  dataset_not_found: 404,
  upstream_timeout: 504,
  upstream_error: 502,
  internal_error: 500,
};
