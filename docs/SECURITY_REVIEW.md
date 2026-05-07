# TW Market Data Security Review

## Scope
This review covers security controls in this repository only:
- Marketing site and docs pages
- Dashboard shell and account settings UI
- Auth flow (Google OAuth + Prisma session)

Out of scope for this round:
- `/v2` backend data API gateway implementation
- External backend services and infra controls
- Stripe/billing payment security

## Current Auth Architecture
- Authentication: Google OAuth via Auth.js / NextAuth v5
- Session persistence: Prisma adapter + PostgreSQL session tables
- Route protection: middleware/proxy guard on dashboard/account/billing/usage paths
- Server-side session checks in dashboard page shell and protected API routes

## Data Minimization Policy (Account Profile)
Stored profile fields are minimized for B2B API onboarding:
- `email` (read-only)
- `displayName` (optional)
- `companyName` (optional)
- `userRole` (optional enum)
- `useCase` (optional enum)
- `onboardingCompleted` (boolean)

Not collected in this batch:
- phone number
- address
- government ID
- company registration number
- personal investment preferences
- asset size

## API Key Status (Beta)
- API key issuance is not enabled for beta self-serve accounts.
- UI create button is disabled and includes explicit beta messaging.
- API POST create route returns disabled/beta response.

## Implemented Security Controls
- Production login no longer renders demo credentials.
- Build artifact scanning added to detect demo credential strings.
- Safe redirect helper added for login `next` / callback path handling.
- Auth runtime env checks return explicit error when required env is missing.
- Prisma-backed session persistence is enabled.
- Existing security headers remain in `next.config.ts`.

## Pending / Follow-up Hardening
- Real API key lifecycle (secure generation, hashing, rotation, revocation audit)
- Stripe billing and webhook verification hardening
- `/v2` gateway auth/rate-limit/policy enforcement
- OpenAPI / MCP inventory hardening and auth-aware exposure controls
