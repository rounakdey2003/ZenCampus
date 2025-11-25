import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Maintenance from "@/models/Maintenance";
import LaundryBooking from "@/models/LaundryBooking";
import CleaningRequest from "@/models/CleaningRequest";
import CanteenOrder from "@/models/CanteenOrder";
import ForumPost from "@/models/ForumPost";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const dateFilter = startDate && endDate ? {
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    } : {};

    // Total students - using mongoose connection to count users collection
    let totalStudents = 0;
    try {
      const User = mongoose.models.User || mongoose.model("User", new mongoose.Schema({}, { strict: false }));
      totalStudents = await User.countDocuments();
    } catch {
      // If User collection doesn't exist, use 0
      totalStudents = 0;
    }

    // Complaints stats
    const complaints = await Maintenance.find(dateFilter);
    const activeComplaints = complaints.filter(c => c.status !== "Completed").length;
    const completedComplaints = complaints.filter(c => c.status === "Completed").length;

    // Maintenance by type
    const maintenanceByType = {
      electrical: {
        total: complaints.filter(c => c.type === "Electrical").length,
        completed: complaints.filter(c => c.type === "Electrical" && c.status === "Completed").length,
        pending: complaints.filter(c => c.type === "Electrical" && c.status !== "Completed").length,
      },
      plumbing: {
        total: complaints.filter(c => c.type === "Plumbing").length,
        completed: complaints.filter(c => c.type === "Plumbing" && c.status === "Completed").length,
        pending: complaints.filter(c => c.type === "Plumbing" && c.status !== "Completed").length,
      },
      carpentry: {
        total: complaints.filter(c => c.type === "Carpentry").length,
        completed: complaints.filter(c => c.type === "Carpentry" && c.status === "Completed").length,
        pending: complaints.filter(c => c.type === "Carpentry" && c.status !== "Completed").length,
      },
      general: {
        total: complaints.filter(c => c.type === "General").length,
        completed: complaints.filter(c => c.type === "General" && c.status === "Completed").length,
        pending: complaints.filter(c => c.type === "General" && c.status !== "Completed").length,
      },
    };

    // Laundry stats
    const laundryBookings = await LaundryBooking.find(dateFilter);
    const laundryStats = {
      washingMachine: laundryBookings.filter(b => b.machineType === "Washing Machine").length,
      dryer: laundryBookings.filter(b => b.machineType === "Dryer").length,
    };

    // Canteen stats
    const canteenOrders = await CanteenOrder.find(dateFilter);
    const canteenRevenue = canteenOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    
    // Popular items
    const itemCounts: { [key: string]: { orders: number; revenue: number } } = {};
    canteenOrders.forEach(order => {
      order.items.forEach((item: { name: string; quantity: number; price: number }) => {
        if (!itemCounts[item.name]) {
          itemCounts[item.name] = { orders: 0, revenue: 0 };
        }
        itemCounts[item.name].orders += item.quantity;
        itemCounts[item.name].revenue += item.price * item.quantity;
      });
    });

    const popularItems = Object.entries(itemCounts)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5);

    // Cleaning stats
    const cleaningRequests = await CleaningRequest.find(dateFilter);
    const cleaningStats = {
      roomCleaning: {
        completed: cleaningRequests.filter(r => r.type === "Room" && r.status === "Completed").length,
        pending: cleaningRequests.filter(r => r.type === "Room" && r.status !== "Completed").length,
      },
      bathroomCleaning: {
        completed: cleaningRequests.filter(r => r.type === "Bathroom" && r.status === "Completed").length,
        pending: cleaningRequests.filter(r => r.type === "Bathroom" && r.status !== "Completed").length,
      },
      commonArea: {
        completed: cleaningRequests.filter(r => r.type === "Common Area" && r.status === "Completed").length,
        pending: cleaningRequests.filter(r => r.type === "Common Area" && r.status !== "Completed").length,
      },
    };

    // Forum posts
    const forumPosts = await ForumPost.countDocuments(dateFilter);

    return NextResponse.json({
      success: true,
      data: {
        totalStudents,
        activeComplaints,
        completedComplaints,
        laundryBookings: laundryBookings.length,
        canteenRevenue,
        forumPosts,
        maintenanceByType,
        laundryStats,
        canteenStats: {
          totalOrders: canteenOrders.length,
          revenue: canteenRevenue,
          popularItems,
        },
        cleaningStats,
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
