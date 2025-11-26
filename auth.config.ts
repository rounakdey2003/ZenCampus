import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          token.usn = user.usn as string;
          token.mobile = user.mobile as string;
          token.name = user.name;
          token.role = (user.role as string) || "student";
        }
        return token;
      } catch {
        return token;
      }
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.usn = token.usn as string;
        session.user.mobile = token.mobile as string;
        session.user.name = token.name as string;
        session.user.role = (token.role as string) || "student";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  basePath: "/api/auth",
  debug: process.env.NODE_ENV === "development",
} satisfies NextAuthConfig;
