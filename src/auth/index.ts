import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "@/src/lib/auth/prisma";
import { trackEventServer } from "@/src/lib/analytics/server";

const googleClientId = process.env.GOOGLE_CLIENT_ID ?? process.env.AUTH_GOOGLE_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET ?? process.env.AUTH_GOOGLE_SECRET;
const isProduction = process.env.NODE_ENV === "production";
const authDebug = process.env.AUTH_DEBUG === "true";

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
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role ?? "user";
      }
      return session;
    },
  },
});
