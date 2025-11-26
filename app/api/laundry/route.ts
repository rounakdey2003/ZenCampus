import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import LaundryBooking from "@/models/LaundryBooking";
import { requireAuth } from "@/lib/auth-middleware";
import mongoose from "mongoose";

export const GET = requireAuth(async (request: NextRequest, session: unknown) => {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const machineType = searchParams.get("machineType");
    const usn = searchParams.get("usn");
    
    const query: Record<string, unknown> = {};
    
    if (search) {
      query.$or = [
        { studentName: { $regex: search, $options: "i" } },
        { studentUSN: { $regex: search, $options: "i" } },
        { roomNumber: { $regex: search, $options: "i" } },
      ];
    }
    
    if (status && status !== "all") {
      query.status = status;
    }
    
    if (machineType && machineType !== "all") {
      query.machineType = machineType;
    }
    
    if (usn) {
      query.studentUSN = usn;
    }
    
    const bookings = await LaundryBooking.find(query).sort({ createdAt: -1 });
    
    const transformedBookings = bookings.map(booking => ({
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
    }));
    
    return NextResponse.json({ success: true, data: transformedBookings });
  } catch (error) {
    console.error("Error fetching laundry bookings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch laundry bookings" },
      { status: 500 }
    );
  }
});

function checkTimeSlotOverlap(slot1: string, slot2: string): boolean {
  const [start1, end1] = slot1.split(" - ");
  const [start2, end2] = slot2.split(" - ");
  
  return (
    (start1 >= start2 && start1 < end2) ||
    (end1 > start2 && end1 <= end2) ||
    (start1 <= start2 && end1 >= end2)
  );
}

export const POST = requireAuth(async (request: NextRequest, session: unknown) => {
  try {
    await connectDB();
    
    const body = await request.json();
    const { machineType, machineNumber, scheduledDate, timeSlot, studentUSN } = body;
    
    const SystemSettings = mongoose.models.SystemSettings || mongoose.model("SystemSettings", new mongoose.Schema({
      maxBookingsPerStudent: { type: Number, default: 2 },
    }));
    
    const settings = await SystemSettings.findOne();
    const maxBookingsPerStudent = settings?.maxBookingsPerStudent || 2;
    
    const studentActiveBookings = await LaundryBooking.find({
      studentUSN,
      status: { $in: ["Scheduled", "In Progress"] }
    });
    
    if (studentActiveBookings.length >= maxBookingsPerStudent) {
      return NextResponse.json(
        { 
          success: false, 
          error: `You have reached the maximum of ${maxBookingsPerStudent} concurrent bookings. Please wait for a booking to complete.`
        },
        { status: 400 }
      );
    }
    
    const conflictingBookings = await LaundryBooking.find({
      machineType,
      machineNumber,
      scheduledDate,
      status: { $in: ["Scheduled", "In Progress"] },
    });
    
    for (const existingBooking of conflictingBookings) {
      if (checkTimeSlotOverlap(timeSlot, existingBooking.timeSlot)) {
        return NextResponse.json(
          { 
            success: false, 
            error: "This time slot is already booked. Please select a different time slot.",
            conflict: true 
          },
          { status: 409 }
        );
      }
    }
    
    const booking = await LaundryBooking.create(body);
    
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
    
    return NextResponse.json({ success: true, data: transformedBooking }, { status: 201 });
  } catch (error) {
    console.error("Error creating laundry booking:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create laundry booking" },
      { status: 500 }
    );
  }
});
