import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET(request: NextRequest) {
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
    
    const students = await User.find(query).select("-password").sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: students });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { usn, name, mobile, room, email, password } = body;
    
    // Check if student already exists
    const existingStudent = await User.findOne({ usn });
    if (existingStudent) {
      return NextResponse.json(
        { success: false, error: "Student with this USN already exists" },
        { status: 400 }
      );
    }
    
    const student = await User.create({
      usn,
      name,
      mobile,
      room,
      email,
      password: password || "123456", // Default password
      role: "student",
    });
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...studentData } = student.toObject();
    
    return NextResponse.json({ success: true, data: studentData }, { status: 201 });
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create student" },
      { status: 500 }
    );
  }
}
