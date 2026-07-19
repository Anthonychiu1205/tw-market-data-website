# I18N §2-11 — Agent-friendly machine-readability acceptance (§3-⑨)

Browser-type agents (computer-use) read the rendered DOM / accessibility tree directly instead of the
API. The main data pages must therefore expose their data as semantic, machine-readable HTML. This PR
brings the data pages to that bar; below are the fixes applied and the 5-page sample for the
accessibility-tree acceptance report (Cowork captures the trees in a browser).

## Fixes applied in this PR

| Area | Fix | File |
|---|---|---|
| Pricing comparison table | column `<th>` → `scope="col"`; feature-label cells `<td>` → `<th scope="row">` — every plan number is now associated to (feature row × tier column) | `src/components/pricing/pricing-shell.tsx` |
| Nested `<main>` landmark | docs content `<main>` → `<div>` (SiteShell already provides the single page `<main>`); fixes docs slug pages **and** `/about` + `/api` | `src/components/docs/docs-page-shell.tsx`, `src/components/docs/docs-layout.tsx` |
| Docs / coverage tables | all column `<th>` → `scope="col"` (query-params, field-reference, coverage, SDK matrices) | `app/[locale]/docs/[...slug]/page.tsx`, `src/components/docs/api-coverage-and-limits.tsx` |
| Dead code | removed unreferenced `twse-daily-price-live-demo.tsx` (rule 1) | — |

## 5 sample pages for the accessibility-tree report

| # | Route | What the a11y tree must show |
|---|---|---|
| 1 | `/pricing` | The plan comparison is a real `<table>`; RPM / included-request / price numbers are `<td>` text under `<th scope=col>` tiers with `<th scope=row>` feature labels. |
| 2 | `/datasets` | Single `<main>`, single `<h1>`, `role=tablist` catalog; dataset cards are `<article>` with heading + text (numbers as text). Note: inactive tab panels use `hidden` — an a11y-tree agent sees the active family until it activates a tab (content is in HTML source for crawlers). |
| 3 | `/datasets/twse-daily-price` | Single `<main>`/`<h1>`, `Dataset` + `BreadcrumbList` JSON-LD, breadcrumb `<nav aria-label>`, reconciliation date as DOM text, sample-CSV `<a>` with accessible name. |
| 4 | `/docs/api/market-prices/twse-daily-price` | **Exactly one** `<main>` (nested-main fix); query-params + field-reference + coverage tables are real `<table>` with `<th scope=col>`; all coverage numbers (from coverage-facts SSOT) are `<td>` text. |
| 5 | `/` (homepage) | Known limitation — see below. |

## Known limitation — homepage coverage/agent-workflow demo

The homepage `market-coverage` / `agent-workflow` panels are an **animated marketing demo** rendered
client-only (`LazyAgentWorkflowDemo` is `dynamic(..., { ssr: false })`) as a CSS-grid `<div>` layout,
with rows revealed on scroll. A static-DOM / a11y-tree agent sees only a skeleton, and even after JS
the numbers are in `<div>`s, not a `<table>`.

- **Not a rule-2 issue** (DEMO-01 made these numbers *real* own-API values), and **not the canonical
  machine-readable surface**: an agent wanting coverage/screen data reads `/datasets`, the dataset
  detail pages, or `/docs/*`, which are fully semantic. The homepage panel is eye-candy.
- **Recommended follow-up** (separate ticket): render an SSR semantic `<table>` (or a visually-hidden
  a11y table) carrying the real coverage numbers at first paint, with the animation as progressive
  enhancement. Left out of this PR to avoid reworking the shared demo renderer's animation.

## Cowork browser-verify checklist

- [ ] Capture the accessibility tree for pages 1–4 above; confirm one `<main>`, table roles with
      column/row header associations, and that key numbers appear as text nodes (not images/hover-only).
- [ ] Page 5: note the client-only demo limitation (expected) and that the real data lives on the
      semantic data pages.
