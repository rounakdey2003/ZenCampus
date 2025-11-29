import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/auth-middleware";
import Poll from "@/models/Poll";

export const GET = requireAuth(async (request: NextRequest) => {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    
    const query: Record<string, unknown> = {};
    
    if (search) {
      query.$or = [
        { question: { $regex: search, $options: "i" } },
        { createdBy: { $regex: search, $options: "i" } },
        { createdByName: { $regex: search, $options: "i" } },
      ];
    }
    
    if (status && status !== "all") {
      query.status = status;
    }
    
    const polls = await Poll.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: polls });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch polls" },
      { status: 500 }
    );
  }
});

export const POST = requireAuth(async (request: NextRequest) => {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const poll = await Poll.create(body);
    
    return NextResponse.json({ success: true, data: poll }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create poll" },
      { status: 500 }
    );
  }
});
