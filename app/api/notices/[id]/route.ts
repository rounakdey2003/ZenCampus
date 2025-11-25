import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Notice from "@/models/Notice";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const body = await request.json();
    
    const notice = await Notice.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );
    
    if (!notice) {
      return NextResponse.json(
        { success: false, error: "Notice not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: notice });
  } catch (error) {
    console.error("Error updating notice:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update notice" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const notice = await Notice.findByIdAndDelete(id);
    
    if (!notice) {
      return NextResponse.json(
        { success: false, error: "Notice not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: "Notice deleted successfully" });
  } catch (error) {
    console.error("Error deleting notice:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete notice" },
      { status: 500 }
    );
  }
}
