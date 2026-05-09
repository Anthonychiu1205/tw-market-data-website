import type { AnalyticsEventName } from "@/src/lib/analytics/types";

export const ANALYTICS_EVENTS: Record<AnalyticsEventName, AnalyticsEventName> = {
  auth_signup: "auth_signup",
  auth_login_success: "auth_login_success",
  api_key_created: "api_key_created",
  api_key_copied: "api_key_copied",
  api_key_revoked: "api_key_revoked",
  api_request_success: "api_request_success",
  api_request_first_success: "api_request_first_success",
  api_request_upstream_timeout: "api_request_upstream_timeout",
  api_request_upstream_error: "api_request_upstream_error",
  pricing_viewed: "pricing_viewed",
  pricing_upgrade_clicked: "pricing_upgrade_clicked",
  sdk_docs_viewed: "sdk_docs_viewed",
  mcp_docs_viewed: "mcp_docs_viewed",
  help_center_viewed: "help_center_viewed",
};
