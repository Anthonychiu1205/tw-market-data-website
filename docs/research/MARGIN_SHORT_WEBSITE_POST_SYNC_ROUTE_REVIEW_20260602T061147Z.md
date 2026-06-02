# Margin Short Website Post-Sync Route Review

## Routes found
- `/datasets`
- `/datasets/margin-short`
- `/docs/api/capital-flow/margin-short`

## Navigation path
- dataset catalog entry exists in `app/datasets/page.tsx`
- dataset SEO/detail source exists in `src/content/datasets.ts`
- docs sidebar path exists in `src/content/docs-sidebar.ts` and points to `/docs/api/capital-flow/margin-short`
- docs route registration exists in `src/content/docs-pages.ts`

## Broken links / missing docs
- no broken route evidence found from local route/source inspection
- no missing route registration found for the three target surfaces

## Private beta / limitations review
- dataset catalog note includes private beta, TWSE-only, no TPEx claim, and daily write cron not enabled
- dataset detail source in `src/content/datasets.ts` includes official-first, source_lineage/data_gaps, and no TPEx framing
- docs page route remains reachable, but content consistency still needs one more alignment pass

## SEO / discoverability notes
- `/datasets/margin-short` is part of the dataset slug source
- dataset item JSON-LD on `/datasets` points to `/datasets/margin-short`
- no separate site-search indexing issue was discovered from repo source inspection
