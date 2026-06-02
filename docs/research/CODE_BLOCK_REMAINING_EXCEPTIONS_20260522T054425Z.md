# CODE BLOCK REMAINING EXCEPTIONS

- Task: CodeBlock-copy-icon-highlight-remaining-exceptions
- Timestamp (UTC): 2026-05-22T05:44:25Z

## Scope
Resolve the two known remaining docs code block exceptions after shared `CodeBlock` rollout.

## Files
1. `src/components/docs/animated-code-block.tsx`
2. `src/components/docs/twse-daily-price-live-demo.tsx`

## Changes
### animated-code-block
- Preserved tab + line-by-line reveal animation.
- Added icon-only copy button in header.
- Added `Copy -> Check` success feedback state.
- Added aria labels (`複製程式碼` / `已複製`).
- Added lightweight token coloring for visual consistency with shared code style.

### twse-daily-price-live-demo
- Replaced raw JSON `<pre>` block with shared `<CodeBlock language="json" copyButtonVariant="icon" />`.
- Fetch logic, endpoint behavior, and data path remain unchanged.

## Validation
- `npm run lint`: PASS
- `npm run build`: PASS

## Gate
- READY_FOR_CODE_BLOCK_EXCEPTIONS_COMMIT
