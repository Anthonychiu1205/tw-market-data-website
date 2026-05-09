export type AnalyticsEventName =
  | "auth_signup"
  | "auth_login_success"
  | "api_key_created"
  | "api_key_copied"
  | "api_key_revoked"
  | "api_request_success"
  | "api_request_first_success"
  | "api_request_upstream_timeout"
  | "api_request_upstream_error"
  | "pricing_viewed"
  | "pricing_upgrade_clicked"
  | "sdk_docs_viewed"
  | "mcp_docs_viewed"
  | "help_center_viewed";

export type AnalyticsProperties = Record<string, string | number | boolean | null | undefined>;

export type AnalyticsContext = {
  requestId?: string;
  userId?: string | null;
  source?: "client" | "server" | "gateway";
  page?: string;
};

export type AnalyticsEventPayload = {
  event: AnalyticsEventName;
  properties?: AnalyticsProperties;
  context?: AnalyticsContext;
  timestamp?: string;
};

export type AnalyticsTrackResult = {
  ok: boolean;
  skipped?: boolean;
  reason?: string;
};
