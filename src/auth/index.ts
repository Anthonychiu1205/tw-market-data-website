import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "@/src/lib/auth/prisma";

const googleClientId = process.env.GOOGLE_CLIENT_ID ?? process.env.AUTH_GOOGLE_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET ?? process.env.AUTH_GOOGLE_SECRET;
const isProduction = process.env.NODE_ENV === "production";
const authDebug = process.env.AUTH_DEBUG === "true";
const trustHost = process.env.AUTH_TRUST_HOST === "true" || Boolean(process.env.VERCEL);

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
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role ?? "user";
      }
      return session;
    },
  },
});
