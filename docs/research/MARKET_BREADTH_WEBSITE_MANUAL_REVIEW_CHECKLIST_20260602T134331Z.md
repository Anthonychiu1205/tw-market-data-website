# Market Breadth Website Manual Review Checklist

- `/datasets` card displays `市場廣度`
- `/datasets/market-breadth` route renders correctly
- `/docs/api/market-prices/market-breadth` renders correctly
- API example uses:
  `GET /v2/datasets/market-breadth?market=TWSE&start_date=2026-05-04&end_date=2026-05-27&limit=5`
- no TPEx/full-market wording
- no cron-enabled wording
- no investment advice wording
- `source_lineage` / `data_gaps` present
- mobile layout sanity
- no pricing/auth runtime changed
