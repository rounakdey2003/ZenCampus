import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import CleaningRequest from "@/models/CleaningRequest";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const usn = searchParams.get("usn"); // Filter by student USN
    
    const query: Record<string, unknown> = {};
    
    if (search) {
      query.$or = [
        { studentName: { $regex: search, $options: "i" } },
        { studentUSN: { $regex: search, $options: "i" } },
        { roomNumber: { $regex: search, $options: "i" } },
      ];
    }
    
    if (status && status !== "all") {
      query.status = status;
    }
    
    if (type && type !== "all") {
      query.type = type;
    }
    
    // Filter by student USN if provided (for student views)
    if (usn) {
      query.studentUSN = usn;
    }
    
    const requests = await CleaningRequest.find(query).sort({ submittedAt: -1 });
    
    return NextResponse.json({ success: true, data: requests });
  } catch (error) {
    console.error("Error fetching cleaning requests:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cleaning requests" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const cleaningRequest = await CleaningRequest.create(body);
    
    return NextResponse.json({ success: true, data: cleaningRequest }, { status: 201 });
  } catch (error) {
    console.error("Error creating cleaning request:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create cleaning request" },
      { status: 500 }
    );
  }
}
