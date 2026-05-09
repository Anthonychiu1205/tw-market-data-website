from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, Optional

import requests

from .errors import (
    AuthenticationError,
    DatasetNotFoundError,
    EntitlementError,
    InsufficientCreditsError,
    RateLimitError,
    TWMarketDataError,
    UpstreamError,
)


@dataclass
class ResponseMeta:
    request_id: Optional[str]
    dry_run: Optional[bool]
    credits_cost: Optional[int]
    credits_charged: Optional[int]
    plan: Optional[str]


@dataclass
class TWMarketDataResponse:
    data: Any
    meta: ResponseMeta
    status_code: int


class TWMarketDataClient:
    def __init__(self, api_key: str, base_url: str = "https://twmarketdata.com", timeout: int = 10) -> None:
        normalized = api_key.strip()
        if not normalized:
            raise ValueError("api_key is required")

        self.api_key = normalized
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout

    def get_dataset(self, dataset: str, **params: Any) -> TWMarketDataResponse:
        if not dataset or not dataset.strip():
            raise ValueError("dataset is required")

        endpoint = f"{self.base_url}/v2/datasets/{dataset.strip()}"
        clean_params = {key: value for key, value in params.items() if value is not None}

        try:
            response = requests.get(
                endpoint,
                params=clean_params,
                headers={"X-API-Key": self.api_key},
                timeout=self.timeout,
            )
        except requests.RequestException as exc:
            raise UpstreamError("Request failed.", details={"dataset": dataset}) from exc

        return self._parse_response(response)

    def twse_daily_price(
        self,
        symbol: str,
        limit: Optional[int] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
    ) -> TWMarketDataResponse:
        return self.get_dataset(
            "twse-daily-price",
            symbol=symbol,
            limit=limit,
            start_date=start_date,
            end_date=end_date,
        )

    def tpex_daily_price(
        self,
        symbol: str,
        limit: Optional[int] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
    ) -> TWMarketDataResponse:
        return self.get_dataset(
            "tpex-daily-price",
            symbol=symbol,
            limit=limit,
            start_date=start_date,
            end_date=end_date,
        )

    def issuer_profile(self, symbol: str) -> TWMarketDataResponse:
        return self.get_dataset("issuer-profile", symbol=symbol)

    def monthly_revenue(self, symbol: str, limit: Optional[int] = None) -> TWMarketDataResponse:
        return self.get_dataset("monthly-revenue", symbol=symbol, limit=limit)

    def valuation_data(self, symbol: str, limit: Optional[int] = None) -> TWMarketDataResponse:
        return self.get_dataset("valuation-data", symbol=symbol, limit=limit)

    def technical_indicators(self, symbol: str, limit: Optional[int] = None) -> TWMarketDataResponse:
        return self.get_dataset("technical-indicators", symbol=symbol, limit=limit)

    def _parse_response(self, response: requests.Response) -> TWMarketDataResponse:
        request_id = response.headers.get("X-Request-Id")
        dry_run_header = response.headers.get("X-TWMD-Dry-Run")
        credits_cost_header = response.headers.get("X-TWMD-Credits-Cost")
        credits_charged_header = response.headers.get("X-TWMD-Credits-Charged")
        plan = response.headers.get("X-TWMD-Plan")

        meta = ResponseMeta(
            request_id=request_id,
            dry_run=dry_run_header.lower() == "true" if isinstance(dry_run_header, str) else None,
            credits_cost=self._to_int(credits_cost_header),
            credits_charged=self._to_int(credits_charged_header),
            plan=plan,
        )

        try:
            payload: Any = response.json()
        except ValueError:
            payload = {"raw": response.text}

        if response.ok:
            return TWMarketDataResponse(data=payload, meta=meta, status_code=response.status_code)

        error_code = self._extract_error_code(payload)
        message = self._extract_error_message(payload) or f"Request failed with status {response.status_code}."

        kwargs = {
            "status_code": response.status_code,
            "error_code": error_code,
            "request_id": request_id,
            "details": payload if isinstance(payload, dict) else {"raw": payload},
        }

        if response.status_code == 401 or error_code == "invalid_api_key":
            raise AuthenticationError(message, **kwargs)
        if response.status_code == 402 or error_code == "insufficient_credits":
            raise InsufficientCreditsError(message, **kwargs)
        if response.status_code == 403 or error_code in {"plan_not_entitled", "dataset_not_allowed", "api_key_revoked"}:
            raise EntitlementError(message, **kwargs)
        if response.status_code == 404 or error_code == "dataset_not_found":
            raise DatasetNotFoundError(message, **kwargs)
        if response.status_code == 429 or error_code == "rate_limit_exceeded":
            raise RateLimitError(message, **kwargs)
        if response.status_code in {502, 504} or error_code in {"upstream_error", "upstream_timeout"}:
            raise UpstreamError(message, **kwargs)

        raise TWMarketDataError(message, **kwargs)

    @staticmethod
    def _to_int(value: Optional[str]) -> Optional[int]:
        if value is None:
            return None
        try:
            return int(value)
        except (TypeError, ValueError):
            return None

    @staticmethod
    def _extract_error_code(payload: Any) -> Optional[str]:
        if isinstance(payload, dict):
            error = payload.get("error")
            if isinstance(error, dict):
                code = error.get("code")
                if isinstance(code, str):
                    return code
        return None

    @staticmethod
    def _extract_error_message(payload: Any) -> Optional[str]:
        if isinstance(payload, dict):
            error = payload.get("error")
            if isinstance(error, dict):
                message = error.get("message")
                if isinstance(message, str):
                    return message
            detail = payload.get("detail")
            if isinstance(detail, str):
                return detail
        return None
