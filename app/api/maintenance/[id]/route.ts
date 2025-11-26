import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { auth } from "@/auth";
import Maintenance from "@/models/Maintenance";

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

    const maintenanceRequest = await Maintenance.findByIdAndUpdate(id, body, {
      new: true,
    });

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
};
