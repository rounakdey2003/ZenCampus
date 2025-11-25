import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      try {
        console.log("📋 JWT Callback started");
        if (user) {
          console.log("👤 User present in JWT callback:", user.usn);
          token.usn = user.usn as string;
          token.mobile = user.mobile as string;
          token.name = user.name;
          token.role = (user.role as string) || "student";
        }
        return token;
      } catch (error) {
        console.error("💥 Error in JWT callback:", error);
        return token;
      }
    },
    async session({ session, token }) {
      console.log("📋 Session callback - token:", {
        usn: token.usn,
        role: token.role,
      });
      if (token && session.user) {
        session.user.usn = token.usn as string;
        session.user.mobile = token.mobile as string;
        session.user.name = token.name as string;
        session.user.role = (token.role as string) || "student";
      }
      console.log("📋 Session created:", {
        usn: session.user?.usn,
        role: session.user?.role,
      });
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  basePath: "/api/auth",
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: false, // Debugging: Force non-secure to test if cookie gets set
      },
    },
  },
  debug: true, // Enable NextAuth debug mode
} satisfies NextAuthConfig;

console.log(
  "🔒 Auth Config loaded. Secret present:",
  !!process.env.NEXTAUTH_SECRET
);
