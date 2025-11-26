import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export const GET = auth(async (request) => {
  try {
    const session = request.auth;

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    await connectDB();
    const user = await User.findOne({ usn: session.user.usn }).select("-password");

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        usn: user.usn,
        name: user.name,
        email: user.email || "",
        roomNumber: user.room || "",
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("/api/auth/me", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
});
