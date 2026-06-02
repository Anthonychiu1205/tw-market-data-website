# HELP_CENTER_PHASE2

## Summary
This phase expands standalone Help Center from 3 pilot articles to 9 total articles (3 existing + 6 new), and removes right-side in-article TOC from help-center article pages.

## Implemented
- Added 6 articles:
  - `/help-center/401-unauthorized`
  - `/help-center/429-rate-limit`
  - `/help-center/data-gaps`
  - `/help-center/credits`
  - `/help-center/change-api-key`
  - `/help-center/contact-support`
- Removed right sidebar section-card titled `本頁章節` in standalone help-center article shell.
- Kept related-articles sidebar and capped to max 3.
- Added a compact support-contact card in right sidebar.
- Updated help-center index to grouped article-entry list by category; no accordion behavior.

## Content style updates
- More plain-language wording with fewer dense terms.
- Each new article includes:
  - what the issue means
  - common causes
  - concrete steps
  - when to contact support
  - next-step links
- Avoided sensitive data requests; support guidance explicitly avoids full key sharing.

## Validation
- `npm run lint`: pass
- `npm run build`: pass
- Build output includes all 6 new `/help-center/[slug]` routes.

## Scope guard
- No backend/auth/billing/database/API behavior changes.
- No OpenAPI/llms/docs-sidebar architecture rollback.
- No dependency additions.
- No push/deploy.
