from __future__ import annotations

from typing import Any, Dict, Optional


class TWMarketDataError(Exception):
    def __init__(
        self,
        message: str,
        *,
        status_code: Optional[int] = None,
        error_code: Optional[str] = None,
        request_id: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(message)
        self.status_code = status_code
        self.error_code = error_code
        self.request_id = request_id
        self.details = details or {}


class AuthenticationError(TWMarketDataError):
    pass


class EntitlementError(TWMarketDataError):
    pass


class InsufficientCreditsError(TWMarketDataError):
    pass


class DatasetNotFoundError(TWMarketDataError):
    pass


class UpstreamError(TWMarketDataError):
    pass


class RateLimitError(TWMarketDataError):
    pass
