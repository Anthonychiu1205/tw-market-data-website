# Help Center Binance-style Navigation Refine

## Goal
Refine standalone Help Center navigation and right related links to a lighter, Binance-inspired rhythm while keeping TW Market Data low-chroma style.

## What changed
- Left nav (article + index) now uses:
  - Category rows with icons
  - Expand/collapse behavior
  - Indented text links for child articles
  - Reduced nested card/border stacking
- Search stays client-side and filters by title/description/category.
- Search mode auto-expands matched categories.
- Related articles panel now uses plain text links (no per-link card borders).
- Hover effects are color-only feedback (no movement or scale).

## Icon mapping
- 快速開始: Rocket
- 帳號與安全: ShieldCheck
- 錯誤排查: AlertTriangle
- 資料與用量: Database
- 工具與 AI: Bot
- 聯絡支援: LifeBuoy

## Validation
- `npm run lint`: PASS
- `npm run build`: PASS
- Static checks passed for:
  - no `translate`/`scale` hover motion
  - no `本頁章節`/`更新時間` in standalone help-center UI

## Files changed
- `src/components/help-center/help-center-nav-search.tsx`
- `src/components/help-center/help-center-shell.tsx`
