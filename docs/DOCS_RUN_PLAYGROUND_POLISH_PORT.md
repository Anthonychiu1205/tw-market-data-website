# Docs Run Playground Polish Port

## Scope
Port API docs Run playground UI polish from legacy commits into current `main` without backend changes.

## Legacy commits reviewed
- `76bf197` refactor(docs): compact API run playground modal
- `a7129da` refactor(docs): polish API run playground layout and theme
- `bfe8882` refactor(docs): improve API playground controls and parameter layout
- `c70de96` fix(docs): keep API playground language menu above content

## Ported in this round
- Restored polished Run playground modal structure and spacing rhythm.
- Restored request language switcher UI (cURL / Python / JavaScript / PHP / Go / Java / Ruby) for code preview generation.
- Restored improved response status tabs and compact response preview behavior.
- Restored parameter/auth layout refinements from legacy chain.
- Restored language dropdown z-index layering fix to keep menu above content.
- Restored `CodeBlock` optional rendering controls needed by playground polish:
  - `wrapLines`
  - `contentClassName`

## Intentionally not ported
- No real API call execution.
- No backend endpoint changes.
- No API key persistence/storage.
- No secret handling changes.

## Safety behavior
- Run remains preview-only/safe interaction.
- API key stays local component state only.
- UI only composes request examples and example response previews.

## Modified files
- `src/components/docs/api-run-playground.tsx`
- `src/components/docs/code-block.tsx`
- `docs/DOCS_RUN_PLAYGROUND_POLISH_PORT.md`

## Validation
- `npm run lint`
- `npm run build`
