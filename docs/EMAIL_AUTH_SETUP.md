# TW Market Data Email Auth Setup

## Overview
This project supports Google OAuth and Email+Password authentication.

Email+Password signup requires a 6-digit verification code before account activation.

## Resend Setup
1. Create a Resend account and generate an API key.
2. Add these environment variables in Vercel:
   - `RESEND_API_KEY`
   - `EMAIL_FROM`
3. Recommended initial sender:
   - `EMAIL_FROM="TW Market Data <onboarding@resend.dev>"`
4. After domain sender verification:
   - `EMAIL_FROM="TW Market Data <no-reply@twmarketdata.com>"`

## Required Env (Auth)
- `DATABASE_URL`
- `AUTH_SECRET`
- `NEXTAUTH_URL=https://twmarketdata.com`
- `NEXT_PUBLIC_SITE_URL=https://twmarketdata.com`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `RESEND_API_KEY`
- `EMAIL_FROM`

## Local Development
1. Install dependencies and generate Prisma client:
   - `npm install`
   - `npx prisma generate`
2. Apply migrations to your local/dev database:
   - `npx prisma migrate deploy`
3. Run the app:
   - `npm run dev`
4. Test flow:
   - Register with email/password
   - Receive verification code by email
   - Verify code and ensure redirect to `/dashboard`

If `RESEND_API_KEY` is missing in production, registration/resend endpoints return `503`.

## Production Smoke Test
1. Open `/register`
2. Submit email + password
3. Confirm verification email is delivered
4. Open `/verify-email`, submit 6-digit code
5. Confirm redirect to `/dashboard`
6. Logout and test `/login` with email/password
7. Confirm unverified users cannot login (must verify first)

## Security Notes
- Passwords are stored as `passwordHash` only.
- Verification code is stored as `codeHash` only.
- Verification code expires in 10 minutes.
- Max attempts per code: 5.
- Used/expired code cannot be reused.
- Register/resend endpoints return generic responses to reduce account enumeration.
