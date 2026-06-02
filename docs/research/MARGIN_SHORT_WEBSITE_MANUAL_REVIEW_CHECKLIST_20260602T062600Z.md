# Margin Short Website Manual Review Checklist

## Route review
- [ ] `/datasets` displays 融資融券 entry correctly
- [ ] `/datasets/margin-short` clearly shows private beta and TWSE-only
- [ ] `/docs/api/capital-flow/margin-short` loads without broken layout

## Content contract review
- [ ] canonical fields shown: `ticker`, `market`, `trade_date`
- [ ] canonical fields shown: `margin_purchase_buy`, `margin_purchase_sell`, `margin_purchase_balance`
- [ ] canonical fields shown: `short_sale_buy`, `short_sale_sell`, `short_sale_balance`
- [ ] canonical fields shown: `source_provider`, `source_role`, `source_lineage`, `data_gaps`, `not_investment_advice`
- [ ] no old legacy fields remain such as `margin_balance`, `margin_buy`, `short_cover`, `margin_short_ratio`, or legacy `lineage`

## Limitation review
- [ ] no TPEx claim
- [ ] no full-market claim
- [ ] not investment advice wording remains
- [ ] daily write cron not enabled wording remains
- [ ] official-first wording remains reasonable
- [ ] ratio tolerance `1e-6` wording is acceptable for private beta docs

## UX review
- [ ] API example matches backend handoff route and parameters
- [ ] mobile layout is not obviously broken
- [ ] pricing / private beta wording is acceptable for release
