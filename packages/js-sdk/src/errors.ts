export type TWMarketDataErrorInput = {
  message: string;
  status?: number;
  code?: string;
  requestId?: string;
  details?: unknown;
};

export class TWMarketDataError extends Error {
  status?: number;
  code?: string;
  requestId?: string;
  details?: unknown;

  constructor(input: TWMarketDataErrorInput) {
    super(input.message);
    this.name = "TWMarketDataError";
    this.status = input.status;
    this.code = input.code;
    this.requestId = input.requestId;
    this.details = input.details;
  }
}

export class AuthenticationError extends TWMarketDataError {
  constructor(input: TWMarketDataErrorInput) {
    super(input);
    this.name = "AuthenticationError";
  }
}

export class EntitlementError extends TWMarketDataError {
  constructor(input: TWMarketDataErrorInput) {
    super(input);
    this.name = "EntitlementError";
  }
}

export class InsufficientCreditsError extends TWMarketDataError {
  constructor(input: TWMarketDataErrorInput) {
    super(input);
    this.name = "InsufficientCreditsError";
  }
}

export class DatasetNotFoundError extends TWMarketDataError {
  constructor(input: TWMarketDataErrorInput) {
    super(input);
    this.name = "DatasetNotFoundError";
  }
}

export class UpstreamError extends TWMarketDataError {
  constructor(input: TWMarketDataErrorInput) {
    super(input);
    this.name = "UpstreamError";
  }
}

export class RateLimitError extends TWMarketDataError {
  constructor(input: TWMarketDataErrorInput) {
    super(input);
    this.name = "RateLimitError";
  }
}
