import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import TimetableEntry from "@/models/TimetableEntry";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const body = await request.json();
    body.updatedAt = new Date();
    
    const entry = await TimetableEntry.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );
    
    if (!entry) {
      return NextResponse.json(
        { success: false, error: "Entry not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: entry });
  } catch (error) {
    console.error("Error updating timetable entry:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update timetable entry" },
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
    
    const entry = await TimetableEntry.findByIdAndDelete(id);
    
    if (!entry) {
      return NextResponse.json(
        { success: false, error: "Entry not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: "Entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting timetable entry:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete timetable entry" },
      { status: 500 }
    );
  }
}
