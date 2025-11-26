import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { auth } from "@/auth";
import LaundryBooking from "@/models/LaundryBooking";

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
    
    const booking = await LaundryBooking.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true }
    );
    
    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }
    
    const transformedBooking = {
      _id: booking._id,
      studentName: booking.studentName,
      studentUSN: booking.studentUSN,
      roomNumber: booking.roomNumber,
      machineType: booking.machineType,
      machineNumber: booking.machineNumber,
      cycleType: booking.cycleType,
      scheduledDate: booking.scheduledDate,
      timeSlot: booking.timeSlot,
      status: booking.status,
    };
    
    return NextResponse.json({ success: true, data: transformedBooking });
  } catch (error) {
    console.error("Error updating laundry booking:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update laundry booking" },
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
    
    const booking = await LaundryBooking.findByIdAndDelete(id);
    
    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Error deleting laundry booking:", error);
    return NextResponse.json(
      { success: false, error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
};
