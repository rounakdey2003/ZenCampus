import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

// GET - Fetch user profile by USN
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ usn: string }> }
) {
  try {
    await dbConnect();
    const { usn } = await params;

    const user = await User.findOne({ usn }).select("-password");
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ usn: string }> }
) {
  try {
    await dbConnect();
    const { usn } = await params;
    const body = await request.json();

    // Remove fields that shouldn't be updated via this endpoint
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, role, _id, ...updateData } = body;

    // Validate blood group if provided
    if (updateData.bloodGroup) {
      const validBloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
      if (!validBloodGroups.includes(updateData.bloodGroup)) {
        return NextResponse.json(
          { success: false, error: "Invalid blood group" },
          { status: 400 }
        );
      }
    }

    // Validate emergency contact phone if provided
    if (updateData.emergencyContact?.phone) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(updateData.emergencyContact.phone)) {
        return NextResponse.json(
          { success: false, error: "Emergency contact phone must be 10 digits" },
          { status: 400 }
        );
      }
    }

    // Validate mobile if being updated
    if (updateData.mobile) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(updateData.mobile)) {
        return NextResponse.json(
          { success: false, error: "Mobile number must be 10 digits" },
          { status: 400 }
        );
      }
    }

    const updatedUser = await User.findOneAndUpdate(
      { usn },
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user profile" },
      { status: 500 }
    );
  }
}
