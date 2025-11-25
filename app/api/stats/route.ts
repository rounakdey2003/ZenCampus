import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Maintenance from "@/models/Maintenance";
import LaundryBooking from "@/models/LaundryBooking";
import CleaningRequest from "@/models/CleaningRequest";
import CanteenOrder from "@/models/CanteenOrder";
import ForumPost from "@/models/ForumPost";
import Notice from "@/models/Notice";
import { WashingMachine, DryerMachine } from "@/models/Machine";
import Poll from "@/models/Poll";
import Complaint from "@/models/Complaint";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await connectDB();
    
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(todayStart);
    monthStart.setMonth(monthStart.getMonth() - 1);
    
    // Parallel fetch all data
    // Parallel fetch all data
    const [
      // Students
      totalStudents,
      studentsThisMonth,
      studentsWithRooms,
      
      // Maintenance
      maintenanceCompleted,
      maintenancePending,
      maintenanceInProgress,
      urgentMaintenance,
      maintenanceByPriority,
      maintenanceByType,
      
      // Cleaning
      cleaningCompleted,
      cleaningPending,
      cleaningInProgress,
      cleaningCompletedToday,
      cleaningByPriority,
      
      // Laundry
      todayBookings,
      yesterdayBookings,
      weekBookings,
      activeBookings,
      cancelledBookings,
      
      // Canteen
      todayOrders,
      yesterdayOrders,
      pendingOrders,
      completedOrders,
      topMenuItems,
      
      // Forum
      activeDiscussions,
      flaggedPosts,
      totalPosts,
      postsThisWeek,
      
      // Notices
      activeNotices,
      urgentNotices,
      expiringSoon,
      noticesByCategory,
      
      // Polls
      activePolls,
      totalVotes,
      
      // Complaints
      totalComplaints,
      pendingComplaints,
      completedComplaints,
      complaintsByCategory,
      
      // Machines
      washingMachines,
      dryerMachines,
      
      // Time-series data
      weekMaintenanceData,
      weekCanteenData,
      weekLaundryData,
      weekCleaningData
    ] = await Promise.all([
      // Students
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "student", createdAt: { $gte: monthStart } }),
      User.countDocuments({ role: "student", room: { $ne: null, $exists: true } }),
      
      // Maintenance
      Maintenance.countDocuments({ status: "Completed" }),
      Maintenance.countDocuments({ status: "Pending" }),
      Maintenance.countDocuments({ status: "In Progress" }),
      Maintenance.countDocuments({ priority: "High", status: { $ne: "Completed" } }),
      Maintenance.aggregate([
        { $group: { _id: "$priority", count: { $sum: 1 } } }
      ]),
      Maintenance.aggregate([
        { $group: { _id: "$type", count: { $sum: 1 } } }
      ]),
      
      // Cleaning
      CleaningRequest.countDocuments({ status: "Completed" }),
      CleaningRequest.countDocuments({ status: "Pending" }),
      CleaningRequest.countDocuments({ status: "In Progress" }),
      CleaningRequest.countDocuments({ 
        status: "Completed",
        updatedAt: { $gte: todayStart }
      }),
      CleaningRequest.aggregate([
        { $group: { _id: "$priority", count: { $sum: 1 } } }
      ]),
      
      // Laundry
      LaundryBooking.countDocuments({ 
        scheduledDate: now.toISOString().split('T')[0],
        status: { $ne: 'Cancelled' }
      }),
      LaundryBooking.countDocuments({ 
        scheduledDate: yesterdayStart.toISOString().split('T')[0],
        status: { $ne: 'Cancelled' }
      }),
      LaundryBooking.countDocuments({ 
        createdAt: { $gte: weekStart },
        status: { $ne: 'Cancelled' }
      }),
      LaundryBooking.countDocuments({ 
        status: 'Active'
      }),
      LaundryBooking.countDocuments({ 
        status: 'Cancelled'
      }),
      
      // Canteen
      CanteenOrder.countDocuments({ createdAt: { $gte: todayStart } }),
      CanteenOrder.countDocuments({ createdAt: { $gte: yesterdayStart, $lt: todayStart } }),
      CanteenOrder.countDocuments({ status: "Pending" }),
      CanteenOrder.countDocuments({ status: "Completed" }),
      CanteenOrder.aggregate([
        { $match: { createdAt: { $gte: weekStart } } },
        { $unwind: "$items" },
        { 
          $group: { 
            _id: "$items.name", 
            totalOrders: { $sum: "$items.quantity" },
            revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
          } 
        },
        { $sort: { totalOrders: -1 } },
        { $limit: 5 }
      ]),
      
      // Forum
      ForumPost.countDocuments({ status: "Active" }),
      ForumPost.countDocuments({ status: "Flagged" }),
      ForumPost.countDocuments({}),
      ForumPost.countDocuments({ createdAt: { $gte: weekStart } }),
      
      // Notices
      Notice.countDocuments({ status: "Active", expiresAt: { $gte: now } }),
      Notice.countDocuments({ status: "Active", priority: "High", expiresAt: { $gte: now } }),
      Notice.countDocuments({ 
        status: "Active", 
        expiresAt: { $gte: now, $lte: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000) }
      }),
      Notice.aggregate([
        { $match: { status: "Active", expiresAt: { $gte: now } } },
        { $group: { _id: "$category", count: { $sum: 1 } } }
      ]),
      
      // Polls
      Poll.countDocuments({ expiresAt: { $gte: now } }),
      Poll.aggregate([
        { $match: { expiresAt: { $gte: now } } },
        { $group: { _id: null, total: { $sum: "$totalVotes" } } }
      ]),
      
      // Complaints
      Complaint.countDocuments({}),
      Complaint.countDocuments({ status: "pending" }),
      Complaint.countDocuments({ status: "completed" }),
      Complaint.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } }
      ]),
      
      // Machines
      WashingMachine.find({}),
      DryerMachine.find({}),
      
      // Time-series data
      Maintenance.aggregate([
        { $match: { createdAt: { $gte: weekStart } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      CanteenOrder.aggregate([
        { $match: { createdAt: { $gte: weekStart } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            revenue: { $sum: "$total" },
            orders: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      LaundryBooking.aggregate([
        { $match: { createdAt: { $gte: weekStart }, status: { $ne: 'Cancelled' } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      CleaningRequest.aggregate([
        { $match: { createdAt: { $gte: weekStart } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);
    
    const completedTasks = maintenanceCompleted + cleaningCompleted;
    const pendingRequests = maintenancePending + cleaningPending;
    const inProgressTasks = maintenanceInProgress + cleaningInProgress;
    
    const todayRevenue = await CanteenOrder.aggregate([
      { $match: { createdAt: { $gte: todayStart } } },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);
    
    const yesterdayRevenue = await CanteenOrder.aggregate([
      { $match: { createdAt: { $gte: yesterdayStart, $lt: todayStart } } },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);
    
    const yesterdayCleaningCompleted = await CleaningRequest.countDocuments({ 
      status: "Completed",
      updatedAt: { $gte: yesterdayStart, $lt: todayStart }
    });
    
    // Calculate machine availability
    const washingAvailable = washingMachines.filter((m: { status: string }) => m.status === 'Available').length;
    const washingInUse = washingMachines.filter((m: { status: string }) => m.status === 'In Use').length;
    const washingFaulty = washingMachines.filter((m: { status: string }) => m.status === 'Faulty' || m.status === 'Repairing').length;
    
    const dryerAvailable = dryerMachines.filter((m: { status: string }) => m.status === 'Available').length;
    const dryerInUse = dryerMachines.filter((m: { status: string }) => m.status === 'In Use').length;
    const dryerFaulty = dryerMachines.filter((m: { status: string }) => m.status === 'Faulty' || m.status === 'Repairing').length;
    
    // Calculate trends
    const bookingsTrend = yesterdayBookings > 0 
      ? ((todayBookings - yesterdayBookings) / yesterdayBookings * 100).toFixed(1)
      : todayBookings > 0 ? '100' : '0';
    
    const ordersTrend = yesterdayOrders > 0
      ? ((todayOrders - yesterdayOrders) / yesterdayOrders * 100).toFixed(1)
      : todayOrders > 0 ? '100' : '0';
    
    const revenueTrend = (yesterdayRevenue[0]?.total || 0) > 0
      ? (((todayRevenue[0]?.total || 0) - (yesterdayRevenue[0]?.total || 0)) / (yesterdayRevenue[0]?.total || 0) * 100).toFixed(1)
      : (todayRevenue[0]?.total || 0) > 0 ? '100' : '0';
    
    const cleaningTrend = yesterdayCleaningCompleted > 0
      ? ((cleaningCompletedToday - yesterdayCleaningCompleted) / yesterdayCleaningCompleted * 100).toFixed(1)
      : cleaningCompletedToday > 0 ? '100' : '0';
    
    // Calculate rates and percentages
    const maintenanceCompletionRate = (maintenanceCompleted + maintenancePending + maintenanceInProgress) > 0
      ? ((maintenanceCompleted / (maintenanceCompleted + maintenancePending + maintenanceInProgress)) * 100).toFixed(1)
      : '0';
    
    const cleaningCompletionRate = (cleaningCompleted + cleaningPending + cleaningInProgress) > 0
      ? ((cleaningCompleted / (cleaningCompleted + cleaningPending + cleaningInProgress)) * 100).toFixed(1)
      : '0';
    
    const complaintResolutionRate = totalComplaints > 0
      ? ((completedComplaints / totalComplaints) * 100).toFixed(1)
      : '0';
    
    const orderFulfillmentRate = (completedOrders + pendingOrders) > 0
      ? ((completedOrders / (completedOrders + pendingOrders)) * 100).toFixed(1)
      : '0';
    
    const bookingCancellationRate = (weekBookings + cancelledBookings) > 0
      ? ((cancelledBookings / (weekBookings + cancelledBookings)) * 100).toFixed(1)
      : '0';
    
    return NextResponse.json({ 
      success: true, 
      data: {
        overview: {
          totalStudents,
          completedTasks,
          pendingRequests,
          inProgressTasks,
          urgentIssues: urgentMaintenance,
        },
        students: {
          total: totalStudents,
          newThisMonth: studentsThisMonth,
          withRooms: studentsWithRooms,
          withoutRooms: totalStudents - studentsWithRooms,
          occupancyRate: totalStudents > 0 ? ((studentsWithRooms / totalStudents) * 100).toFixed(1) : '0',
        },
        complaints: {
          total: totalComplaints,
          pending: pendingComplaints,
          completed: completedComplaints,
          resolutionRate: complaintResolutionRate,
          byCategory: complaintsByCategory.reduce((acc: Record<string, number>, item: { _id: string; count: number }) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
        },
        maintenance: {
          total: maintenanceCompleted + maintenancePending + maintenanceInProgress,
          pending: maintenancePending,
          inProgress: maintenanceInProgress,
          completed: maintenanceCompleted,
          urgent: urgentMaintenance,
          completionRate: maintenanceCompletionRate,
          byPriority: maintenanceByPriority.reduce((acc: Record<string, number>, item: { _id: string; count: number }) => {
            acc[item._id || 'None'] = item.count;
            return acc;
          }, {}),
          byType: maintenanceByType.reduce((acc: Record<string, number>, item: { _id: string; count: number }) => {
            acc[item._id || 'General'] = item.count;
            return acc;
          }, {}),
          weeklyData: weekMaintenanceData,
        },
        laundry: {
          todayBookings,
          weeklyBookings: weekBookings,
          activeBookings,
          cancelledBookings,
          cancellationRate: bookingCancellationRate,
          weeklyTrend: bookingsTrend,
          weeklyData: weekLaundryData,
          machines: {
            washing: {
              total: washingMachines.length,
              available: washingAvailable,
              inUse: washingInUse,
              faulty: washingFaulty,
              utilizationRate: washingMachines.length > 0 
                ? ((washingInUse / washingMachines.length) * 100).toFixed(1)
                : '0'
            },
            dryer: {
              total: dryerMachines.length,
              available: dryerAvailable,
              inUse: dryerInUse,
              faulty: dryerFaulty,
              utilizationRate: dryerMachines.length > 0
                ? ((dryerInUse / dryerMachines.length) * 100).toFixed(1)
                : '0'
            }
          }
        },
        cleaning: {
          total: cleaningCompleted + cleaningPending + cleaningInProgress,
          pending: cleaningPending,
          inProgress: cleaningInProgress,
          completed: cleaningCompleted,
          completedToday: cleaningCompletedToday,
          completionRate: cleaningCompletionRate,
          trend: cleaningTrend,
          byPriority: cleaningByPriority.reduce((acc: Record<string, number>, item: { _id: string; count: number }) => {
            acc[item._id || 'Medium'] = item.count;
            return acc;
          }, {}),
          weeklyData: weekCleaningData,
        },
        canteen: {
          todayOrders,
          todayRevenue: todayRevenue[0]?.total || 0,
          pendingOrders,
          completedOrders,
          fulfillmentRate: orderFulfillmentRate,
          trend: ordersTrend,
          revenueTrend,
          weeklyData: weekCanteenData,
          avgOrderValue: todayOrders > 0 
            ? ((todayRevenue[0]?.total || 0) / todayOrders).toFixed(2)
            : '0',
          topItems: topMenuItems.map((item: { _id: string; totalOrders: number; revenue: number }) => ({
            name: item._id,
            orders: item.totalOrders,
            revenue: item.revenue
          }))
        },
        forum: {
          activeDiscussions,
          flaggedPosts,
          totalPosts,
          postsThisWeek,
          activePolls,
          totalVotes: totalVotes[0]?.total || 0,
          engagementRate: totalStudents > 0
            ? ((activeDiscussions / totalStudents) * 100).toFixed(1)
            : '0',
          avgVotesPerPoll: activePolls > 0
            ? ((totalVotes[0]?.total || 0) / activePolls).toFixed(1)
            : '0',
        },
        notices: {
          active: activeNotices,
          urgent: urgentNotices,
          expiringSoon,
          byCategory: noticesByCategory.reduce((acc: Record<string, number>, item: { _id: string; count: number }) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
        },
        trends: {
          bookings: { value: todayBookings, change: bookingsTrend, previous: yesterdayBookings },
          orders: { value: todayOrders, change: ordersTrend, previous: yesterdayOrders },
          revenue: { value: todayRevenue[0]?.total || 0, change: revenueTrend, previous: yesterdayRevenue[0]?.total || 0 },
          cleaning: { value: cleaningCompletedToday, change: cleaningTrend, previous: yesterdayCleaningCompleted },
        },
        timestamp: now.toISOString(),
      }
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
