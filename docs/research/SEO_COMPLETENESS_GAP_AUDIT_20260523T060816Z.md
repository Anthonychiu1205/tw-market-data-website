# TWMarketData SEO Completeness Gap Audit and Page Map

- Timestamp (UTC): 20260523T060816Z
- Scope: Read-only audit only (no code changes)
- Repo: /Volumes/DEV_USB/Projects/tw-market-data-website

## Executive Summary
TW Market Data 的 SEO 基礎已經很強：首頁定位、datasets hub、5 個核心 dataset landing pages、完整 docs API surface、workflows guides、llms/openapi/sitemap 都已到位。現階段不是「重做結構」，而是補齊內容 ownership 深度與 trust canonical 分工。

Gate 評估：**SEO_FOUNDATION_STRONG_NEEDS_TRUST_AND_DEPTH**。

## Current Surface
1. Homepage: 有明確「台股資料 API + AI agent workflow」定位，含結構化資料與 CTA。
2. Dataset hub: /datasets 有 ItemList JSON-LD、family tabs、docs/slug 內部連結。
3. Dataset slugs: 目前只有 5 個核心頁（TWSE、月營收、損益表、資產負債表、法人流向）。
4. Docs/API: endpoint surface 完整，OpenAPI spec 與 machine-readable 入口已接上。
5. Trust: /docs/source-policy、/docs/data-provenance、/docs/market-coverage 已可用，但存在內容重疊與 alias/canonical 可再明確化。
6. AI-readable: /llms.txt、/llms-full.txt、/openapi.json 都已上線。

## Main Gaps
1. 第二批 dataset slug 尚未建立 owner page（例如 TPEx、technical indicators、valuation、issuer profile、margin short、events）。
2. Trust layer 邊界需要更清楚：source-policy vs data-provenance vs market-coverage。
3. OpenAPI phase2（更完整 examples / error / pagination semantics）尚未完成。
4. Quickstart/dev onboarding 還可再補 language-specific pages（Python/JS/Postman import）。
5. 部分 docs 文案仍有「後續可透過 OpenAPI/llms/MCP」語氣，與已上線狀態不一致。

## Recommended Order
### P0 — Must do before “SEO complete”
1. Dataset slug SEO phase2（先補高意圖但已具 docs 的主題）
2. Trust pages canonicalization（確立 single owner page per trust intent）

### P1 — Strongly recommended
1. OpenAPI phase2 schema 深化
2. Quickstart pages（Python / JS / Postman/OpenAPI import）
3. machine-readable 文案時態統一

### P2 — Later
1. Dedicated data-gaps/status page
2. Dataset slug phase3（news-intelligence / events deeper pages，僅 metadata-first 表述）

## Safety Notes
- 不應宣稱 institutional-flow full 3Y complete。
- 不應宣稱 cash flow coverage 已完整。
- MCP 仍應維持 preview/planned。
- 不給投資建議、不給 target price。
