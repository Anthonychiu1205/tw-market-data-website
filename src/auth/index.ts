import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "@/src/lib/auth/prisma";
import { trackEventServer } from "@/src/lib/analytics/server";

const googleClientId = process.env.GOOGLE_CLIENT_ID ?? process.env.AUTH_GOOGLE_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET ?? process.env.AUTH_GOOGLE_SECRET;
const isProduction = process.env.NODE_ENV === "production";
const authDebug = process.env.AUTH_DEBUG === "true";

// BM-9: let first-party subdomains (terminal. etc.) share the apex login state by
// scoping the session cookie to the whole zone instead of host-only. Production only;
// local/preview stays host-only (domain undefined).
// Security precondition: every *.twmarketdata.com must be a first-party trusted host,
// since they all receive this cookie. The cookie is httpOnly (subdomain JS can't read
// it) but subdomain *servers* do receive it — so no untrusted subdomain may exist.
const useSecureCookies = isProduction;
const ssoCookieDomain = isProduction ? ".twmarketdata.com" : undefined;

function isLocalhostUrl(url: string | undefined) {
  if (!url) return false;

  const normalizedUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  try {
    const hostname = new URL(normalizedUrl).hostname;
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
  } catch {
    return false;
  }
}

const authUrlCandidate = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_SITE_URL;
const trustHost =
  process.env.AUTH_TRUST_HOST === "true" ||
  Boolean(process.env.VERCEL) ||
  process.env.NODE_ENV !== "production" ||
  isLocalhostUrl(authUrlCandidate);

// SBX-63 dev-login is NOT a NextAuth provider: Credentials is incompatible with this app's
// database session strategy (+ PrismaAdapter) and produced `error=Configuration`. Instead the
// dev-only route app/api/dev-login/route.ts creates a real DB Session directly (same mechanism as
// prod), double-gated by NODE_ENV !== "production" && ALLOW_DEV_LOGIN === "1". Auth config stays
// clean/database-only here.
const providers =
  googleClientId && googleClientSecret
    ? [
        Google({
          clientId: googleClientId,
          clientSecret: googleClientSecret,
        }),
      ]
    : [];

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "database",
  },
  // BM-9: only override the session cookie so it is sent to all first-party
  // subdomains. Do NOT touch csrfToken / any __Host- cookie (the __Host- spec forbids
  // a Domain attribute; adding one breaks sign-in). sameSite stays "lax" (subdomains
  // are same-site). In non-production, ssoCookieDomain is undefined → host-only.
  //
  // AUTH-FIX: the OAuth handshake cookies need the same zone scope as the session.
  // Symptom this fixes — a sign-in started on www.twmarketdata.com wrote a HOST-ONLY
  // `__Secure-authjs.pkce.code_verifier` on www, while the redirect_uri sent to Google is
  // always the apex (AUTH_URL). Google then returned the browser to the APEX callback,
  // which never received the www-scoped cookie:
  //     InvalidCheck: pkceCodeVerifier value could not be parsed
  //   → CallbackRouteError → /api/auth/error → the "server configuration" screen.
  // Scoping them to the zone makes a handshake started on ANY first-party host complete on
  // the apex, so login no longer depends on a www→apex redirect existing.
  //
  // Only `domain` is specified: @auth/core deep-merges over its defaults (lib/utils/cookie.js),
  // and merge() skips undefined — so names, httpOnly/sameSite/path/secure and the 15-minute
  // maxAge are preserved, and non-production stays host-only.
  cookies: {
    sessionToken: {
      name: `${useSecureCookies ? "__Secure-" : ""}authjs.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        domain: ssoCookieDomain,
      },
    },
    pkceCodeVerifier: { options: { domain: ssoCookieDomain } },
    state: { options: { domain: ssoCookieDomain } },
    nonce: { options: { domain: ssoCookieDomain } },
  },
  trustHost,
  debug: isProduction ? authDebug : true,
  pages: {
    signIn: "/login",
    // AUTH-FIX: without this, a failed handshake fell through to @auth/core's built-in error
    // page, which was answering `GET /api/auth/error` with a 500 — so a recoverable sign-in
    // failure looked like a server crash ("There is a problem with the server configuration").
    // /login already renders a localized error notice from ?error=, and is the page the user
    // needs anyway: retry is one click away.
    error: "/login",
  },
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (!user?.id) return true;
      void trackEventServer({
        event: "auth_login_success",
        context: {
          source: "server",
          userId: user.id,
          page: "/login",
        },
        properties: {
          method: account?.provider ?? "unknown",
        },
      });
      return true;
    },
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role ?? "user";
      }
      return session;
    },
  },
});
