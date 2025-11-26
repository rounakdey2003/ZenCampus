import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { auth } from "@/auth";
import { WashingMachine, DryerMachine } from "@/models/Machine";

export const PATCH = async (
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
    const { type, status } = body;
    
    if (!type) {
      return NextResponse.json(
        { error: "Machine type is required" },
        { status: 400 }
      );
    }
    
    const Model = type === "washing" ? WashingMachine : DryerMachine;
    
    const machine = await Model.findByIdAndUpdate(
      id,
      { 
        status,
        lastUpdated: new Date()
      },
      { new: true }
    );
    
    if (!machine) {
      return NextResponse.json(
        { success: false, error: "Machine not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: machine });
  } catch (error) {
    console.error("Error updating machine:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update machine" },
      { status: 500 }
    );
  }
};

export const DELETE = async (
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
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");
    
    if (!type) {
      return NextResponse.json(
        { success: false, error: "Machine type is required" },
        { status: 400 }
      );
    }
    
    const Model = type === "washing" ? WashingMachine : DryerMachine;
    
    const machine = await Model.findByIdAndDelete(id);
    
    if (!machine) {
      return NextResponse.json(
        { success: false, error: "Machine not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: "Machine deleted successfully" });
  } catch (error) {
    console.error("Error deleting machine:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete machine" },
      { status: 500 }
    );
  }
};
