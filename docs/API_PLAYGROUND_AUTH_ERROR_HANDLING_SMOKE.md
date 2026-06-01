# API Playground Auth Error Handling Smoke

## Scope
- Repo: `/Volumes/DEV_USB/Projects/tw-market-data-website`
- Baseline commit: `be57db7`
- Objective: local/staging-style smoke for API Playground auth error handling.
- No deploy / no push / no backend repo changes.

## Tested Route / Endpoint
- Docs route used for target endpoint: `/docs/api/financial-growth/monthly-revenue`
- Playground endpoint target: `GET /v2/datasets/monthly-revenue`

## Smoke Case Results

### A. Empty API key
- Verification method:
  - Frontend validation logic (`validateApiKey`) + test suite.
- Result:
  - Request is blocked at client side.
  - UI message expected/implemented: `請先輸入 API key。`

### B. Placeholder / masked key
- Inputs verified in validation path:
  - `$TWMD_API_KEY`
  - `YOUR_API_KEY`
  - `********`
  - `••••••••`
- Verification method:
  - Frontend validation logic + test suite.
- Result:
  - Request is blocked at client side.
  - UI message expected/implemented: `請輸入有效 API key，而不是範例或遮罩文字。`

### C. Clearly invalid key
- Request:
  - `X-API-Key: test_invalid_key_do_not_use`
- Observed response:
  - HTTP `401`
  - `{"error":{"code":"invalid_api_key","message":"Invalid API key."},"requestId":"..."}`
- Result:
  - No `500` / no `internal_error` / no `API key lookup failed.`

### D. API key lookup unavailable
- Simulation method:
  - Start local dev with intentionally unavailable DB auth store (`DATABASE_URL`/`DIRECT_URL` pointed to invalid local port), then call endpoint with valid-format key.
- Observed response:
  - HTTP `503`
  - `{"error":{"code":"api_key_lookup_unavailable","message":"API key verification is temporarily unavailable."},"requestId":"..."}`
- Result:
  - Correct contract surfaced.

### E. Other 5xx fallback
- Verification method:
  - Frontend error mapping test (`mapRunErrorNotice`) for `5xx + requestId`.
- Result:
  - UI fallback string is present:
    - `服務暫時無法處理請求。請稍後再試，或附上 requestId（...）聯繫我們。`

## Old Error Regression Check
- Legacy payload string `API key lookup failed.` is no longer returned in gateway lookup failure path.

## Validation
- `npm run lint` ✅
- `NEXT_TELEMETRY_DISABLED=1 npm run build` ✅
- `node --test tests/docs-run-playground-real-api.test.mjs` ✅

## Final Gate
- `API_PLAYGROUND_AUTH_ERROR_SMOKE_PASS_READY_FOR_PUSH`
