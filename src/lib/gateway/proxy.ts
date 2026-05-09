import "server-only";

import { GatewayHttpError } from "@/src/lib/gateway/errors";

const UPSTREAM_TIMEOUT_MS = 4000;
const SAFE_UPSTREAM_RESPONSE_HEADERS = ["content-type", "cache-control", "content-language", "etag"];

type ProxyDatasetRequestInput = {
  backendPath: string;
  queryString: string;
  userEmail?: string | null;
};

export type ProxyDatasetResult = {
  status: number;
  payload: unknown;
  rawText: string | null;
  isJson: boolean;
  headers: Headers;
};

function resolveBackendBaseUrl() {
  const rawBaseUrl = process.env.BACKEND_API_BASE_URL?.trim();
  if (!rawBaseUrl) {
    throw new GatewayHttpError(502, "upstream_error", "Backend base URL is not configured.", {
      stage: "proxy",
    });
  }
  return rawBaseUrl.replace(/\/$/, "");
}

function getInternalBackendHeaders(userEmail?: string | null) {
  const backendApiKey =
    process.env.BACKEND_API_TOKEN?.trim() ||
    process.env.BACKEND_API_KEY?.trim() ||
    process.env.STAGING_BACKEND_API_TOKEN?.trim();
  const backendBearerToken = process.env.BACKEND_BEARER_TOKEN?.trim();
  const selfServeToken = process.env.BACKEND_SELF_SERVE_TOKEN?.trim();

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (backendApiKey) {
    headers["x-api-key"] = backendApiKey;
  }

  if (backendBearerToken) {
    headers.Authorization = `Bearer ${backendBearerToken}`;
  } else if (backendApiKey) {
    // Backward-compatible fallback: some upstream routes accept Bearer token in place of x-api-key.
    headers.Authorization = `Bearer ${backendApiKey}`;
  }

  if (selfServeToken) {
    headers["x-self-serve-token"] = selfServeToken;
  }

  if (userEmail) {
    headers["X-Account-Email"] = userEmail;
  }

  return headers;
}

function pickSafeUpstreamHeaders(upstreamHeaders: Headers) {
  const headers = new Headers();
  for (const key of SAFE_UPSTREAM_RESPONSE_HEADERS) {
    const value = upstreamHeaders.get(key);
    if (value) {
      headers.set(key, value);
    }
  }
  return headers;
}

export async function proxyDatasetRequest(input: ProxyDatasetRequestInput): Promise<ProxyDatasetResult> {
  const baseUrl = resolveBackendBaseUrl();
  const targetUrl = `${baseUrl}${input.backendPath}${input.queryString ? `?${input.queryString}` : ""}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const upstreamResponse = await fetch(targetUrl, {
      method: "GET",
      cache: "no-store",
      headers: getInternalBackendHeaders(input.userEmail),
      signal: controller.signal,
    });

    const safeHeaders = pickSafeUpstreamHeaders(upstreamResponse.headers);
    const contentType = upstreamResponse.headers.get("content-type") ?? "";
    const isJson = contentType.includes("application/json");

    if (isJson) {
      const payload = await upstreamResponse.json().catch(() => null);
      return {
        status: upstreamResponse.status,
        payload,
        rawText: null,
        isJson: true,
        headers: safeHeaders,
      };
    }

    const rawText = await upstreamResponse.text().catch(() => "");
    return {
      status: upstreamResponse.status,
      payload: null,
      rawText,
      isJson: false,
      headers: safeHeaders,
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new GatewayHttpError(504, "upstream_timeout", undefined, { stage: "proxy" });
    }
    if (error instanceof GatewayHttpError) {
      throw error;
    }
    throw new GatewayHttpError(502, "upstream_error", undefined, { stage: "proxy" });
  } finally {
    clearTimeout(timeoutId);
  }
}
