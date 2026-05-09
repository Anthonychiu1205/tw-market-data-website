import { MCPToolError } from "./errors.js";

export type TWMDClientOptions = {
  apiKey: string;
  baseUrl?: string;
  timeoutMs?: number;
};

export type TWMDToolResponse<T = unknown> = {
  data: T;
  meta: {
    requestId: string | null;
    dryRun: boolean | null;
    creditsCost: number | null;
    creditsCharged: number | null;
    plan: string | null;
  };
  status: number;
};

export class TWMDClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;

  constructor(options: TWMDClientOptions) {
    const apiKey = options.apiKey.trim();
    if (!apiKey) {
      throw new MCPToolError("missing_api_key", "TWMD_API_KEY is required.");
    }

    this.apiKey = apiKey;
    this.baseUrl = (options.baseUrl || "https://twmarketdata.com").replace(/\/$/, "");
    this.timeoutMs = Number.isFinite(options.timeoutMs) ? Number(options.timeoutMs) : 10000;
  }

  async getDataset<T = unknown>(dataset: string, params: Record<string, string | number | undefined>) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === "") return;
      query.set(key, String(value));
    });

    const endpoint = `${this.baseUrl}/v2/datasets/${dataset}${query.toString() ? `?${query.toString()}` : ""}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "X-API-Key": this.apiKey,
        },
        signal: controller.signal,
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new MCPToolError("upstream_timeout", "Upstream request timed out.");
      }
      throw new MCPToolError("upstream_error", "Failed to fetch dataset.");
    } finally {
      clearTimeout(timeoutId);
    }

    const payload = await parseBody(response);
    const meta = {
      requestId: response.headers.get("X-Request-Id"),
      dryRun: parseBoolean(response.headers.get("X-TWMD-Dry-Run")),
      creditsCost: parseInteger(response.headers.get("X-TWMD-Credits-Cost")),
      creditsCharged: parseInteger(response.headers.get("X-TWMD-Credits-Charged")),
      plan: response.headers.get("X-TWMD-Plan"),
    };

    if (!response.ok) {
      const message = extractErrorMessage(payload) || `Dataset request failed (${response.status}).`;
      throw new MCPToolError(extractErrorCode(payload) || `http_${response.status}`, message);
    }

    return {
      data: payload as T,
      meta,
      status: response.status,
    } satisfies TWMDToolResponse<T>;
  }
}

function parseBoolean(value: string | null): boolean | null {
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
}

function parseInteger(value: string | null): number | null {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

async function parseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  try {
    return { raw: await response.text() };
  } catch {
    return null;
  }
}

function extractErrorCode(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const error = (payload as Record<string, unknown>).error;
  if (!error || typeof error !== "object") return null;
  const code = (error as Record<string, unknown>).code;
  return typeof code === "string" ? code : null;
}

function extractErrorMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;
  const error = record.error;
  if (error && typeof error === "object") {
    const message = (error as Record<string, unknown>).message;
    if (typeof message === "string") return message;
  }
  const detail = record.detail;
  return typeof detail === "string" ? detail : null;
}
