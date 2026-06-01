# API Playground Auth Error Handling

## Root Cause Classification
- `database_lookup_exception`
- `auth_middleware_error_mapping_bug`
- `frontend_error_display_too_raw`

Observed source:
- `src/lib/gateway/auth.ts` was catching API key lookup exceptions and returning `500 internal_error` with message `API key lookup failed.`
- Playground displayed backend failures too directly, and placeholder/masked key validation text was not aligned with current UX requirement.

## Files Changed
- `src/lib/gateway/auth.ts`
- `src/lib/gateway/errors.ts`
- `src/lib/docs/run-playground.ts`
- `src/components/docs/api-run-playground.tsx`
- `tests/docs-run-playground-real-api.test.mjs`

## Backend Error Contract (website gateway)
Implemented in gateway layer:
- Missing key (`X-API-Key` absent):
  - HTTP `401`
  - `error.code = "missing_api_key"`
  - message: `API key is required.`
- Invalid key format / unknown key:
  - HTTP `401`
  - `error.code = "invalid_api_key"`
- API key lookup storage/DB unavailable:
  - HTTP `503`
  - `error.code = "api_key_lookup_unavailable"`
  - message: `API key verification is temporarily unavailable.`

Removed behavior:
- No more `500 internal_error` with `API key lookup failed.` for key lookup exceptions.

## Frontend Playground Behavior
- Empty key: block request and show `請先輸入 API key。`
- Placeholder/masked key (`••••••`, `********`, `$TWMD_API_KEY`, `YOUR_API_KEY`, `your_api_key_here`, etc.): block request and show `請輸入有效 API key，而不是範例或遮罩文字。`
- `api_key_lookup_unavailable`: show `API 金鑰驗證服務暫時不可用，請稍後再試。`
- `invalid_api_key`: show `API key 無效，請確認後再試。`
- Other `5xx`: show generic message with optional requestId, without raw internal error text.

## Security Notes
- No API key persistence to localStorage/sessionStorage/cookie.
- cURL/example output remains `$TWMD_API_KEY` placeholder and does not expose user input key.
- No raw key logging introduced.

## Validation
Website:
- `npm run lint` ✅
- `NEXT_TELEMETRY_DISABLED=1 npm run build` ✅
- `node --test tests/docs-run-playground-real-api.test.mjs` ✅

Backend repo (read-only verification only, no code change):
- `python3 -m compileall -q src scripts run_api_server.py` ✅
- `PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 PYTHONPATH=src:. .venv/bin/pytest -q tests -k "api_key or auth or monthly_revenue or external_data_api or read_api"` ✅ (`204 passed`)

## Remaining Caveat
- If production still returns auth lookup failures after this change, likely cause is runtime auth store/DB availability/config in deployed environment, not monthly-revenue dataset logic.

## Final Gate
- `API_PLAYGROUND_AUTH_LOOKUP_FIX_PASS_READY_FOR_STAGING_SMOKE`
