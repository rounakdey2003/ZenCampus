import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/auth-middleware";
import ForumPost from "@/models/ForumPost";

export const GET = requireAuth(async (request: NextRequest, session: unknown) => {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    
    const query: Record<string, unknown> = {};
    
    if (category && category !== "all") {
      query.category = category;
    }
    
    if (status && status !== "all") {
      query.status = status;
    }
    
    const posts = await ForumPost.find(query).sort({ lastActivity: -1 });
    
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    console.error("Error fetching forum posts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch forum posts" },
      { status: 500 }
    );
  }
});

export const POST = requireAuth(async (request: NextRequest, session: unknown) => {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const post = await ForumPost.create(body);
    
    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    console.error("Error creating forum post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create forum post" },
      { status: 500 }
    );
  }
});
