# Market Breadth Website Content Consistency Audit

- Scope: market breadth sync validation
- Audit time: 2026-06-02T13:31:46Z

## Checklist
- Dataset card exists in catalog with slug `market-breadth`
- `app/datasets/page.tsx` includes market breadth card under market-prices family and JSON-LD path
- `src/content/site.ts` marks source scope as TWSE-only and private beta use case
- `src/content/docs-sidebar.ts` includes `"/docs/api/market-prices/market-breadth"`
- API docs page is present under market-prices namespace
- Endpoint aligned: `/v2/datasets/market-breadth`
- Example request aligned: `market=TWSE&start_date=2026-05-04&end_date=2026-05-27&limit=5`
- Response fields aligned to backend handoff package
- Limitations preserved: TWSE-only, private beta, no TPEx claim, no cron-enabled write claim, no investment advice
- `source_lineage`, `data_gaps`, `not_investment_advice` exposed in docs sample and requirements

## Audit result
- Route coverage for market breadth is synchronized in catalog + docs structures.
- No backend files modified.
- No pricing/billing/auth runtime changed.
