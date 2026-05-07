# Security Fixes (Batch-1)

## Summary of Changes
1. Navbar auth surface minimized (no username/email/logout in top nav).
2. Account settings profile model reduced to onboarding-safe fields.
3. Added strict profile API validation with zod (`GET/PATCH /api/account/profile`).
4. Added safe redirect helper for login callback targets.
5. Added build scan script for demo credential strings in public build artifacts.
6. API key issuance explicitly disabled for beta self-serve UI/API route.
7. Added Email+Password registration flow with 6-digit email verification code.
8. Added secure password hashing and verification code hashing.
9. Added rate limits for verification code resend/attempt windows.
10. Added email-auth security verification script for schema/build checks.

## Risk Levels
- High: Open redirect risk from untrusted `next/callback` params → mitigated via allowlisted safe redirect helper.
- Medium: Over-collection risk in account settings → mitigated by minimized profile schema.
- Medium: Demo credential leakage in production assets → mitigated by production gating + build scanner.
- Medium: Misleading API key issuance claims → mitigated by disabled CTA + explicit beta message.

## Validation Performed
- `npm run lint`
- `npm run build`
- `npm run check:safe-redirect`
- `npm run check:public-secrets`
- `npm run check:email-auth-security`
- Prisma client generation with updated schema/migrations

## Not Addressed in Batch-1
- Stripe and billing security controls
- External `/v2` API gateway auth/rate-limits
- Production-grade API key issuance lifecycle
- External infrastructure security scanning
