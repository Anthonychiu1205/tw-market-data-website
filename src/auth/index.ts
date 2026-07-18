import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
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

// SBX-63 dev-only login bypass — LOCAL SANDBOX ACCEPTANCE ONLY, never in production.
// Double-gated: NODE_ENV !== "production" AND ALLOW_DEV_LOGIN === "1". ALLOW_DEV_LOGIN must live
// ONLY in .env.local — never in .env.production or Vercel env. Depends on NO prod credentials
// (DB upsert only). NextAuth Credentials requires JWT sessions, so the strategy below switches to
// "jwt" when this is on (prod always stays database sessions). authorize() upserts the user by the
// GIVEN id, so session.user.id === that id (= the Polar sandbox subscription's externalCustomerId) —
// which solves the externalCustomerId mapping directly, no separate mapping fix needed.
const allowDevLogin = process.env.NODE_ENV !== "production" && process.env.ALLOW_DEV_LOGIN === "1";

const providers = [
  ...(googleClientId && googleClientSecret
    ? [Google({ clientId: googleClientId, clientSecret: googleClientSecret })]
    : []),
  ...(allowDevLogin
    ? [
        Credentials({
          id: "dev-login",
          name: "Dev Login（本機 sandbox 驗收）",
          credentials: {
            email: { label: "email", type: "text" },
            userId: { label: "userId（= sandbox sub externalId）", type: "text" },
          },
          async authorize(credentials) {
            const email = String(credentials?.email ?? "").trim().toLowerCase();
            const userId = String(credentials?.userId ?? "").trim();
            if (!email || !userId) return null;
            // Upsert by id so session.user.id is exactly the given id (= sandbox externalCustomerId).
            const record = await prisma.user.upsert({
              where: { id: userId },
              create: { id: userId, email },
              update: {},
              select: { id: true, email: true, role: true },
            });
            return { id: record.id, email: record.email, role: record.role };
          },
        }),
      ]
    : []),
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: {
    // Prod always uses database sessions; dev-login(Credentials) requires JWT, so switch only then.
    strategy: allowDevLogin ? "jwt" : "database",
  },
  // BM-9: only override the session cookie so it is sent to all first-party
  // subdomains. Do NOT touch csrfToken / any __Host- cookie (the __Host- spec forbids
  // a Domain attribute; adding one breaks sign-in). sameSite stays "lax" (subdomains
  // are same-site). In non-production, ssoCookieDomain is undefined → host-only.
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
  },
  trustHost,
  debug: isProduction ? authDebug : true,
  pages: {
    signIn: "/login",
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
    async jwt({ token, user }) {
      // Only invoked under the jwt strategy (dev-login). Persist id/role onto the token.
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "user";
      }
      return token;
    },
    session({ session, user, token }) {
      if (session.user) {
        // database strategy provides `user`; jwt strategy (dev-login) provides `token`.
        session.user.id = (user?.id ?? (token?.id as string | undefined) ?? token?.sub) as string;
        session.user.role = (user?.role ?? (token?.role as string | undefined) ?? "user") as string;
      }
      return session;
    },
  },
});
