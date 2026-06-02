# Docs API Run Playground Modal

## Scope
- Add `Run` button to API docs endpoint rows.
- Open a shared playground modal in Chinese.
- Keep backend and API behavior unchanged.

## Implementation Summary
- Added client component: `src/components/docs/api-run-playground.tsx`.
- Integrated into API row render paths in `app/docs/[...slug]/page.tsx`.
- Modal content includes:
  - 授權（X-API-Key）
  - 查詢參數（來自頁面 `apiReference.queryParameters`）
  - 動態 cURL（根據輸入生成）
  - 回應範例（status tabs，來自 `statusExamples`）
- Reused `CodeBlock` for cURL/JSON display (icon-only copy + highlighting).

## Security Notes
- API key stored only in React state.
- No localStorage/sessionStorage/cookie persistence.
- No console output of API key.
- No live request execution in this phase.

## Validation
- `npm run lint` PASS
- `npm run build` PASS

## Commit Scope
- `app/docs/[...slug]/page.tsx`
- `src/components/docs/api-run-playground.tsx`

Artifacts and research files are intentionally excluded from commit.
