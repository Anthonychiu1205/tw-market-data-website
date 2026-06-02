# API Run Playground FinancialDatasets-inspired Layout

## Scope
Polish only visual density and layout rhythm of the docs API playground modal, while keeping behavior and security constraints unchanged.

## Key Updates
- Modal dimensions tuned for one-screen readability: narrower width and lower max height.
- Header tightened into compact endpoint command-bar rhythm.
- Body shifted to left-heavy (57/43) API-reference style.
- Left panel rows compacted and aligned (authorization + query rows).
- Right panel reordered to cURL first, response second.
- Response/cURL code block heights rebalanced to prevent over-dominant response area.

## Code Theme
- Lowered syntax saturation for JSON/cURL tokens.
- Added muted punctuation styling for calmer docs appearance.
- Preserved copy integrity and shared CodeBlock behavior.

## Safety
- No real API request execution.
- No API key persistence in localStorage/sessionStorage/cookie.
- No API key logging.

## Validation
- npm run lint: PASS
- npm run build: PASS
