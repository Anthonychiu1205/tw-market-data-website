# Margin Short Website Post-Cleanup Deploy Preflight

## Validation
- `npm run lint`: passed
- `npm run build`: blocked by an already-running `next build` process in the same repo
- non-blocking note from prior successful build remains true: auth/billing dynamic server usage messages were informational when build exit code was `0`

## Build blockage note
- observed active process family under `/Volumes/DEV_USB/Projects/tw-market-data-website`
- primary process included `node .../node_modules/.bin/next build`
- this task did not terminate that process

## Decision
`MARGIN_SHORT_WEBSITE_DOCS_CLEANUP_BLOCKED_BY_BUILD`

## Reasoning
- legacy contract wording for the margin-short docs route was cleaned up
- content alignment now looks correct for the target route
- deploy preflight cannot be advanced to approval until build validation is rerun cleanly without the concurrent build-process conflict
