import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// POST - Verify USN and Mobile, then reset password
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { usn, mobile, newPassword } = body;

    if (!usn || !mobile || !newPassword) {
      return NextResponse.json(
        { success: false, error: "USN, mobile, and new password are required" },
        { status: 400 }
      );
    }

    // Find user by USN and mobile
    const user = await User.findOne({ 
      usn: usn.toUpperCase(), 
      mobile 
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid USN or mobile number" },
        { status: 404 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password directly without triggering pre-save hook
    await User.findByIdAndUpdate(user._id, { 
      $set: { password: hashedPassword } 
    });

    return NextResponse.json(
      { success: true, message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
