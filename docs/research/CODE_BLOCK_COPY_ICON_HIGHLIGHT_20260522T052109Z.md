# CODE BLOCK COPY ICON HIGHLIGHT

- Task: Unify-docs-code-block-copy-icon-button-and-syntax-highlighting
- Timestamp (UTC): 2026-05-22T05:21:09Z

## Summary
Implemented a shared docs `CodeBlock` with icon-only copy UX and lightweight syntax highlighting, then applied it to core docs rendering paths.

## What Was Added
- `src/components/docs/code-block.tsx`
  - Client component
  - Copy button variants: `icon` and `text`
  - Docs usage default: `icon` only
  - Copy success state via `Copy -> Check` icon
  - `aria-label` state changes (`複製程式碼` -> `已複製`)
  - Lightweight syntax highlighting for Python/JS/TS/Bash/JSON/Curl/Text

## What Was Replaced
1. `app/docs/[...slug]/page.tsx`
- Workflow/general `section.codeBlocks`
- API request/response `<pre>` blocks

2. `src/components/docs/api-side-panel.tsx`
- Removed local text copy button
- Removed local JSON-only highlighter
- Replaced with shared CodeBlock

3. `src/components/docs/quick-start-content.tsx`
- Replaced major docs code examples with shared CodeBlock

## Behavior Notes
- Code block copy button is icon-only for docs code examples.
- No large text copy button is used in docs code block UI.
- Copy operation copies raw source text, not highlighted markup.

## Remaining Exceptions
- `src/components/docs/animated-code-block.tsx`
- `src/components/docs/twse-daily-price-live-demo.tsx`

These still render with local `<pre><code>` and can be migrated in a follow-up pass.

## Validation
- `npm run lint` PASS
- `npm run build` PASS
