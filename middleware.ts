import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === "/" || path === "/login" || path === "/api/auth/signin" || path === "/api/auth/callback/credentials" || path.startsWith("/api/auth") || path.startsWith("/api/users/");

  // Get the session
  const session = await auth();
  
  // Check if path is admin route
  const isAdminPath = path.startsWith("/admin");

  // Redirect to dashboard if user is authenticated and tries to access login page
  if ((path === "/" || path === "/login") && session) {
    // Redirect admin to admin panel, regular users to dashboard
    if (session.user?.role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.nextUrl));
    }
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  // Redirect to login if user is not authenticated and tries to access protected routes
  if (!isPublicPath && !session) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // Protect admin routes - only admin users can access
  if (isAdminPath && session?.user?.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/health).*)",
  ],
};
