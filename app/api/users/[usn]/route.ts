import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { auth } from "@/auth";
import User from "@/models/User";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ usn: string }> }
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
    const { usn } = await params;

    const user = await User.findOne({ usn }).select("-password");
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
};

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ usn: string }> }
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
    const { usn } = await params;
    const body = await request.json();

    const { password, role, _id, ...updateData } = body;

    if (updateData.bloodGroup) {
      const validBloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
      if (!validBloodGroups.includes(updateData.bloodGroup)) {
        return NextResponse.json(
          { success: false, error: "Invalid blood group" },
          { status: 400 }
        );
      }
    }

    if (updateData.emergencyContact?.phone) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(updateData.emergencyContact.phone)) {
        return NextResponse.json(
          { success: false, error: "Emergency contact phone must be 10 digits" },
          { status: 400 }
        );
      }
    }

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
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update user profile" },
      { status: 500 }
    );
  }
};
