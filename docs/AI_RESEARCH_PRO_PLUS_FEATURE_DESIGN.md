# AI Research Pro+ Feature Design

## 1. Executive Summary

- AI Research is a TW Market Data Pro+ bonus feature.
- It is not a standalone website.
- It is not a standalone subscription.
- It does not execute real trades.
- It is not investment advice.
- This round is design-only, with no UI/API/billing implementation.

## 2. Product Positioning

- TW Market Data remains the main product.
- AI Research is a premium dashboard feature for paid subscribers.
- It increases Pro / Team / Enterprise value and retention.
- It is not a standalone product.
- It is not a separate pricing page.
- It is research-only and simulation-only.

## 3. Plan Entitlement

| Plan | AI Research access | Allowed mode | Monthly research runs | Batch support | Decision log | Simulated portfolio | Commercial use | Notes |
|---|---|---|---:|---|---|---|---|---|
| Free | No access | N/A | 0 | No | No | No | No | Show upgrade path only |
| Developer | Mock preview only | `mock` preview only | 5 previews | No | Limited preview | No | No | Limited demo, non-commercial research preview |
| Pro | Basic access | `mock` now, future gated live-read-only | 100 runs | Limited (single ticker focus) | Yes | Simulated decision | Yes | Core paid entry for AI Research |
| Team | Full access | `mock` now, future gated live-read-only | 1,000 runs | Yes | Yes | Yes | Yes | Team-scale workflow and export history |
| Enterprise | Custom access | Custom (contract-gated) | Custom | Custom | Custom | Custom | Yes | SLA, custom analyst workflow/quota |

## 4. Dashboard UX Placement

Suggested future route:

- `/dashboard/ai-research`

Suggested page sections:

- ticker input
- as_of_date selector
- mode badge
- run button
- decision summary
- bull case
- bear case
- trader proposal
- risk review
- portfolio decision
- simulated order
- data gaps
- warnings
- disclaimer
- replay fingerprint / run id

Pro+ gating behavior:

- Free / Developer should see upgrade prompt or mock-preview limitation message.
- Pro / Team / Enterprise can access according to entitlement tier.

## 5. Pricing Table Future Rows

Future pricing-table row suggestions (design only):

- AI Research API
- AI Research runs / month
- Decision log
- Simulated portfolio
- Batch research
- Custom analyst workflow

This phase does not modify the pricing table implementation.

## 6. API Integration Boundary

Future website integration options:

- internal API proxy route in website backend
- separate tw-ai FastAPI service behind controlled service boundary

Design constraints:

- website user session and plan entitlement must be checked first
- website API route (or service client) calls AI Research backend after entitlement check
- AI backend response remains research-only and simulation-only
- no direct browser access to upstream credentials
- no direct user access to TWSE / TPEx / MOPS credentials

## 7. Credits / Usage Boundary

Current state:

- credits remain dry-run
- no deduction implemented for AI Research
- no billing changes in this phase

Future design direction:

- Pro includes monthly research runs quota
- Team includes larger quota
- overage/add-on requires separate billing gate approval
- failed validation should not charge
- usage should appear in dashboard in a later phase

## 8. Safety / Compliance Copy

UI and API response should always include copy equivalent to:

- 僅供研究參考
- 非投資建議
- 不保證報酬
- 不進行真實下單
- 使用者需自行判斷
- 模擬交易不等於實際績效

## 9. Implementation Phases

- Phase W1:
  - docs-only design
- Phase W2:
  - pricing table copy/rows design
- Phase W3:
  - dashboard static mock page
- Phase W4:
  - connect to local/mock API
- Phase W5:
  - entitlement gating
- Phase W6:
  - usage/credits dry-run display
- Phase W7:
  - production integration only after backend gates (API/auth/billing/persistence) are approved

## 10. Explicit Non-Goals

- no UI implementation in this round
- no API proxy implementation
- no billing implementation
- no credits implementation
- no auth changes
- no DB migration
- no live trading
- no investment advice mode
- no backend deployment
- no tw-ai repository modification

## W4-H Local Entitlement Mock UI Note

- W4-H adds a local mock entitlement UI preview for Free / Developer / Pro / Team / Enterprise directly in `/dashboard/ai-research`.
- This is local preview only and does not read real subscription state, session plan, or billing records.
- Free is shown as blocked with upgrade guidance; Developer stays mock-preview-only; Pro/Team/Enterprise are shown as enabled tiers with descriptive capability copy.
- No real quota enforcement or credits deduction is implemented in W4-H.
- No production entitlement logic is changed in this phase.
