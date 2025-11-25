import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Notice from "@/models/Notice";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    
    const query: Record<string, unknown> = {};
    
    if (category && category !== "all" && category !== "All") {
      query.category = category;
    }
    
    if (status && status !== "all" && status !== "All") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }
    
    const notices = await Notice.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: notices });
  } catch (error) {
    console.error("Error fetching notices:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch notices";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const notice = await Notice.create(body);
    
    return NextResponse.json({ success: true, data: notice }, { status: 201 });
  } catch (error) {
    console.error("Error creating notice:", error);
    const message = error instanceof Error ? error.message : "Failed to create notice";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
