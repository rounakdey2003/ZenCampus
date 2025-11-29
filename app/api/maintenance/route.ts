import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Maintenance from "@/models/Maintenance";
import { requireAuth } from "@/lib/auth-middleware";

export const GET = requireAuth(async (request: NextRequest) => {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const usn = searchParams.get("usn");

    const query: Record<string, unknown> = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { roomNumber: { $regex: search, $options: "i" } },
        { studentName: { $regex: search, $options: "i" } },
      ];
    }

    if (status && status !== "all") {
      query.status = status;
    }

    if (type && type !== "all") {
      query.type = type;
    }

    if (usn) {
      query.studentUSN = usn;
    }

    const requests = await Maintenance.find(query).sort({ submittedAt: -1 });

    return NextResponse.json({ success: true, data: requests });
  } catch (error) {
    console.error("Error fetching maintenance requests:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch maintenance requests" },
      { status: 500 }
    );
  }
});

export const POST = requireAuth(async (request: NextRequest) => {
  try {
    await connectDB();

    const body = await request.json();

    const maintenanceRequest = await Maintenance.create(body);

    return NextResponse.json(
      { success: true, data: maintenanceRequest },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating maintenance request:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create maintenance request" },
      { status: 500 }
    );
  }
});
