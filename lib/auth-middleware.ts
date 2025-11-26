import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { Session } from "next-auth";

export type AuthenticatedHandler<T = unknown> = (
  request: NextRequest,
  session: Session,
  context?: T
) => Promise<NextResponse>;

export function requireAuth<T = unknown>(handler: AuthenticatedHandler<T>) {
  return async (request: NextRequest, context?: T) => {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Authentication required" },
        { status: 401 }
      );
    }

    return handler(request, session, context);
  };
}

export function requireAdmin<T = unknown>(handler: AuthenticatedHandler<T>) {
  return async (request: NextRequest, context?: T) => {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Authentication required" },
        { status: 401 }
      );
    }

    if (session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    return handler(request, session, context);
  };
}
