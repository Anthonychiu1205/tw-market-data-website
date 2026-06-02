# API Run Playground Visual + Endpoint-Specific Params Refinement

## Summary
This iteration focused on UI polish and endpoint-specific parameter fidelity for the docs API playground modal.

## Parameter Mapping
- Modal parameter rendering is strictly driven by `apiReference.queryParameters`.
- No global parameter injection is used.
- Verified target endpoints and resolved params:
  - TWSE 日線價格: `symbol`, `start_date`, `end_date`, `limit`
  - TPEx 日線價格: `symbol`, `start_date`, `end_date`, `limit`
  - 月營收: `symbol`, `start_date`, `end_date`, `limit`
  - 三大法人: `symbol`, `start_date`, `end_date`, `limit`
- Label semantics remain endpoint-defined (`symbol` vs `ticker` is not forced by modal).

## Visual Refinement
- Cleaner low-saturation slate styling for modal shell and header.
- Better desktop composition with a 48/52 split.
- Unified row/input sizing and column alignment in parameter list.
- Refined status tabs and spacing for denser one-screen readability.

## Code Theme Refinement
- Adjusted syntax token colors to muted docs-friendly palette.
- Preserved shared `CodeBlock` component behavior and copy fidelity.

## Behavior and Security
- Run action remains preview-only (no real API request).
- Missing required params switches to 400 example with inline notice.
- API key remains in-memory only; no persistence or logging.

## Validation
- `npm run lint` PASS
- `npm run build` PASS
