import { NextResponse } from "next/server";

// Temporary debug endpoint - DELETE after testing
export async function GET() {
  return NextResponse.json({
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    hasMongoUri: !!process.env.MONGODB_URI,
    nextAuthUrl: process.env.NEXTAUTH_URL, // Safe to show URL
    nodeEnv: process.env.NODE_ENV,
  });
}
