import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/auth-middleware";
import LaundryBooking from "@/models/LaundryBooking";

function parseDateTime(dateStr: string, timeStr: string): Date {
  const [time, period] = timeStr.split(" ");
  const timeParts = time.split(":").map(Number);
  let hours = timeParts[0];
  const minutes = timeParts[1];
  
  if (period === "PM" && hours !== 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }
  
  const date = new Date(dateStr);
  date.setHours(hours, minutes, 0, 0);
  
  return date;
}

export const POST = requireAuth(async () => {
  try {
    await connectDB();
    
    const currentTime = new Date();
    let updatedCount = 0;
    
    const activeBookings = await LaundryBooking.find({
      status: { $in: ["Scheduled", "In Progress"] }
    });
    
    for (const booking of activeBookings) {
      const [startTimeStr, endTimeStr] = booking.timeSlot.split(" - ");
      
      const startDateTime = parseDateTime(booking.scheduledDate, startTimeStr);
      const endDateTime = parseDateTime(booking.scheduledDate, endTimeStr);
      
      if (booking.status === "Scheduled" && currentTime >= startDateTime) {
        await LaundryBooking.findByIdAndUpdate(booking._id, {
          status: "In Progress",
          updatedAt: new Date()
        });
        updatedCount++;
      }
      
      if (booking.status === "In Progress" && currentTime >= endDateTime) {
        await LaundryBooking.findByIdAndUpdate(booking._id, {
          status: "Completed",
          updatedAt: new Date()
        });
        updatedCount++;
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Updated ${updatedCount} bookings`,
      updatedCount 
    });
  } catch (error) {
    console.error("Error checking booking statuses:", error);
    return NextResponse.json(
      { success: false, error: "Failed to check booking statuses" },
      { status: 500 }
    );
  }
});
