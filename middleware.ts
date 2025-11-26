import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath =
    path === "/" ||
    path === "/login" ||
    path === "/api/auth/signin" ||
    path === "/api/auth/callback/credentials" ||
    path.startsWith("/api/auth") ||
    path.startsWith("/api/users/");

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const session = token
    ? {
        user: {
          role: (token.role as string) || "student",
        },
      }
    : null;

  const isAdminPath = path.startsWith("/admin");

  if ((path === "/" || path === "/login") && session) {
    if (session.user?.role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.nextUrl));
    }
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  if (!isPublicPath && !session) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  if (isAdminPath && session?.user?.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/health).*)",
  ],
};
