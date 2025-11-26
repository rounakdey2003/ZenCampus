import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { requireAdmin } from "@/lib/auth-middleware";

export const GET = requireAdmin(async (request: NextRequest) => {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");

    let query: Record<string, unknown> = { role: "student" };

    if (search) {
      query = {
        ...query,
        $or: [
          { name: { $regex: search, $options: "i" } },
          { usn: { $regex: search, $options: "i" } },
          { room: { $regex: search, $options: "i" } },
        ],
      };
    }

    const students = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: students });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch students" },
      { status: 500 }
    );
  }
});

export const POST = requireAdmin(async (request: NextRequest) => {
  try {
    await connectDB();

    const body = await request.json();
    const { usn, name, mobile, room, email, password } = body;

    const existingStudent = await User.findOne({ usn });
    if (existingStudent) {
      return NextResponse.json(
        { success: false, error: "Student with this USN already exists" },
        { status: 400 }
      );
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password is required and must be at least 8 characters" },
        { status: 400 }
      );
    }

    const student = await User.create({
      usn,
      name,
      mobile,
      room,
      email,
      password,
      role: "student",
    });

    const { password: _, ...studentData } = student.toObject();

    return NextResponse.json(
      { success: true, data: studentData },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create student" },
      { status: 500 }
    );
  }
});
