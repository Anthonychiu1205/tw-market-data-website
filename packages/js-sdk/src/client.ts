import {
  AuthenticationError,
  DatasetNotFoundError,
  EntitlementError,
  InsufficientCreditsError,
  RateLimitError,
  TWMarketDataError,
  UpstreamError,
} from "./errors";

export type TWMarketDataClientOptions = {
  apiKey: string;
  baseUrl?: string;
  timeoutMs?: number;
};

export type SDKResponseMeta = {
  requestId: string | null;
  dryRun: boolean | null;
  creditsCost: number | null;
  creditsCharged: number | null;
  plan: string | null;
};

export type SDKResponse<T = unknown> = {
  data: T;
  meta: SDKResponseMeta;
  status: number;
};

export class TWMarketDataClient {
  private apiKey: string;

  private baseUrl: string;

  private timeoutMs: number;

  constructor(options: TWMarketDataClientOptions) {
    const normalizedApiKey = options.apiKey.trim();
    if (!normalizedApiKey) {
      throw new Error("apiKey is required");
    }

    this.apiKey = normalizedApiKey;
    this.baseUrl = (options.baseUrl || "https://twmarketdata.com").replace(/\/$/, "");
    this.timeoutMs = Number.isFinite(options.timeoutMs) ? Number(options.timeoutMs) : 10000;
  }

  async getDataset<T = unknown>(dataset: string, params: Record<string, string | number | undefined | null> = {}) {
    const cleanedDataset = dataset.trim();
    if (!cleanedDataset) {
      throw new Error("dataset is required");
    }

    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      query.set(key, String(value));
    });

    const url = `${this.baseUrl}/v2/datasets/${cleanedDataset}${query.toString() ? `?${query.toString()}` : ""}`;
    return this.request<T>(url);
  }

  twseDailyPrice(input: { symbol: string; limit?: number; startDate?: string; endDate?: string }) {
    return this.getDataset("twse-daily-price", {
      symbol: input.symbol,
      limit: input.limit,
      start_date: input.startDate,
      end_date: input.endDate,
    });
  }

  tpexDailyPrice(input: { symbol: string; limit?: number; startDate?: string; endDate?: string }) {
    return this.getDataset("tpex-daily-price", {
      symbol: input.symbol,
      limit: input.limit,
      start_date: input.startDate,
      end_date: input.endDate,
    });
  }

  issuerProfile(input: { symbol: string }) {
    return this.getDataset("issuer-profile", {
      symbol: input.symbol,
    });
  }

  monthlyRevenue(input: { symbol: string; limit?: number }) {
    return this.getDataset("monthly-revenue", {
      symbol: input.symbol,
      limit: input.limit,
    });
  }

  valuationData(input: { symbol: string; limit?: number }) {
    return this.getDataset("valuation-data", {
      symbol: input.symbol,
      limit: input.limit,
    });
  }

  technicalIndicators(input: { symbol: string; limit?: number }) {
    return this.getDataset("technical-indicators", {
      symbol: input.symbol,
      limit: input.limit,
    });
  }

  private async request<T>(url: string): Promise<SDKResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    let response: Response;
    try {
      response = await fetch(url, {
        method: "GET",
        headers: {
          "X-API-Key": this.apiKey,
        },
        signal: controller.signal,
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new UpstreamError({ message: "Upstream request timed out." });
      }
      throw new UpstreamError({ message: "Request failed.", details: error });
    } finally {
      clearTimeout(timeoutId);
    }

    const meta: SDKResponseMeta = {
      requestId: response.headers.get("X-Request-Id"),
      dryRun: this.toBoolean(response.headers.get("X-TWMD-Dry-Run")),
      creditsCost: this.toNumber(response.headers.get("X-TWMD-Credits-Cost")),
      creditsCharged: this.toNumber(response.headers.get("X-TWMD-Credits-Charged")),
      plan: response.headers.get("X-TWMD-Plan"),
    };

    const payload = await this.parseBody(response);

    if (response.ok) {
      return {
        data: payload as T,
        meta,
        status: response.status,
      };
    }

    const errorCode = this.extractErrorCode(payload);
    const message = this.extractErrorMessage(payload) || `Request failed with status ${response.status}.`;
    const errorInput = {
      message,
      status: response.status,
      code: errorCode || undefined,
      requestId: meta.requestId || undefined,
      details: payload,
    };

    if (response.status === 401 || errorCode === "invalid_api_key") {
      throw new AuthenticationError(errorInput);
    }

    if (response.status === 402 || errorCode === "insufficient_credits") {
      throw new InsufficientCreditsError(errorInput);
    }

    if (response.status === 403 || ["plan_not_entitled", "dataset_not_allowed", "api_key_revoked"].includes(errorCode || "")) {
      throw new EntitlementError(errorInput);
    }

    if (response.status === 404 || errorCode === "dataset_not_found") {
      throw new DatasetNotFoundError(errorInput);
    }

    if (response.status === 429 || errorCode === "rate_limit_exceeded") {
      throw new RateLimitError(errorInput);
    }

    if (response.status === 502 || response.status === 504 || ["upstream_error", "upstream_timeout"].includes(errorCode || "")) {
      throw new UpstreamError(errorInput);
    }

    throw new TWMarketDataError(errorInput);
  }

  private async parseBody(response: Response) {
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

  private extractErrorCode(payload: unknown) {
    if (!payload || typeof payload !== "object") return null;
    const record = payload as Record<string, unknown>;
    const error = record.error;
    if (!error || typeof error !== "object") return null;
    const code = (error as Record<string, unknown>).code;
    return typeof code === "string" ? code : null;
  }

  private extractErrorMessage(payload: unknown) {
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

  private toNumber(value: string | null) {
    if (!value) return null;
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : null;
  }

  private toBoolean(value: string | null) {
    if (value === "true") return true;
    if (value === "false") return false;
    return null;
  }
}
