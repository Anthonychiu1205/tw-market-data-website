# Market Breadth Website Post-Sync Content Audit

## Scope
Content audit for website-side `market_breadth` sync against the backend handoff package.

## Contract checks
- endpoint: `/v2/datasets/market-breadth`
- sample request present:
  `GET /v2/datasets/market-breadth?market=TWSE&start_date=2026-05-04&end_date=2026-05-27&limit=5`
- coverage: `2026-05-04..2026-05-27`
- row_count: `18`
- status: `Private beta`
- market scope: `TWSE-only`
- source basis: `TWSE MI_INDEX derived market breadth`

## Field coverage present
- `trade_date`
- `market`
- `advancing_count`
- `declining_count`
- `unchanged_count`
- `limit_up_count`
- `limit_down_count`
- `total_traded_count`
- `turnover_value`
- `volume`
- `market_scope`
- `calculation_basis`
- `source_provider`
- `source_role`
- `source_lineage`
- `data_gaps`
- `not_investment_advice`

## Limitation checks
- no TPEx claim: preserved
- no full-market claim: preserved
- no daily cron enabled claim: preserved
- no investment advice claim: preserved

## Content audit result
Current website content matches the backend handoff package and preserves all required limitations.

## Final gate
`MARKET_BREADTH_WEBSITE_POST_SYNC_CONTENT_AUDIT_PASS`
