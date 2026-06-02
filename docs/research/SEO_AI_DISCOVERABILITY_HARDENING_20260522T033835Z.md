# SEO / AI Discoverability Hardening (20260522T033835Z)

## Scope
Low-risk hardening for SEO + AI agent discoverability on TW Market Data, without backend behavior changes.

## What Was Improved
1. Added ItemList JSON-LD to \/datasets for crawler-readable dataset index.
2. Added API-docs-to-datasets cross-link blocks in docs API page renderer.
3. Reworked `llms.txt` and `llms-full.txt` to be clearer for AI-agent consumption:
   - explicit data_gaps and freshness caution
   - no investment-advice posture
   - MCP marked as preview/planned
4. Added pricing-side internal conversion links to \/datasets and \/docs\/introduction.
5. Added sitemap entries for \/datasets, \/llms.txt, and \/llms-full.txt.

## Deliberate No-ops
- Homepage UI not redesigned.
- Docs framework unchanged.
- No new backend routes or billing/auth logic.
- No fake MCP endpoint or fake OpenAPI availability claim.

## Validation
- `npm run lint`: pass
- `npm run build`: pass

## Residual Gap
- Machine-first OpenAPI artifact endpoint/public file is still not confirmed in this round; discoverability currently points to docs OpenAPI spec page.

## Recommended Next Step
- Add a minimal, verifiable public OpenAPI artifact path (if available from existing source-of-truth) and link it from docs + llms files.
