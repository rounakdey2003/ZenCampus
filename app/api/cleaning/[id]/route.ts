import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { auth } from "@/auth";
import CleaningRequest from "@/models/CleaningRequest";

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Authentication required" },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;
    
    const body = await request.json();
    
    const cleaningRequest = await CleaningRequest.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );
    
    if (!cleaningRequest) {
      return NextResponse.json(
        { success: false, error: "Cleaning request not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: cleaningRequest });
  } catch (error) {
    console.error("Error updating cleaning request:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update cleaning request" },
      { status: 500 }
    );
  }
};
