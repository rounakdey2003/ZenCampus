import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import TimetableEntry from "@/models/TimetableEntry";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");
    const isActive = searchParams.get("isActive");
    
    const query: Record<string, unknown> = {};
    
    if (type && type !== "all") {
      query.type = type;
    }
    
    if (isActive !== null && isActive !== undefined) {
      query.isActive = isActive === "true";
    }
    
    const entries = await TimetableEntry.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: entries });
  } catch (error) {
    console.error("Error fetching timetable entries:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch timetable entries" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const entry = await TimetableEntry.create(body);
    
    return NextResponse.json({ success: true, data: entry }, { status: 201 });
  } catch (error) {
    console.error("Error creating timetable entry:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create timetable entry" },
      { status: 500 }
    );
  }
}
