import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Maintenance from "@/models/Maintenance";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const body = await request.json();
    
    const maintenanceRequest = await Maintenance.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );
    
    if (!maintenanceRequest) {
      return NextResponse.json(
        { success: false, error: "Maintenance request not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: maintenanceRequest });
  } catch (error) {
    console.error("Error updating maintenance request:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update maintenance request" },
      { status: 500 }
    );
  }
}
