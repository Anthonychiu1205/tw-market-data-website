# Margin Short Website Post-Sync Route Review

## Reviewed routes
- `/datasets`
- `/datasets/margin-short`
- `/docs/api/capital-flow/margin-short`

## Route review result
- dataset catalog entry exists and points to `/datasets/margin-short`
- dataset detail page route is present in static build output under `/datasets/[slug]`
- API docs route is present through `/docs/[...slug]`
- endpoint shown in docs is `/v2/datasets/margin-short`

## Route-level assertions
- private beta language is present
- TWSE-only limitation is present
- no TPEx / full-market claim is present
- source_lineage / data_gaps / not_investment_advice are explicitly retained in docs content
- no backend endpoint drift detected against handoff manifest
