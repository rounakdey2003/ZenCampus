"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent } from "@/components/ui";
import { Users, Loader2, Droplet, Home, Coffee, MessageSquare, Bell } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { useUser } from "@/hooks/useUser";

export const dynamic = "force-dynamic";

interface Maintenance {
  _id: string;
  status: string;
  type: string;
  studentUSN: string;
}

interface LaundryBooking {
  _id: string;
  status: string;
  studentUSN: string;
  machineType: string;
}

interface CleaningRequest {
  _id: string;
  status: string;
  studentUSN: string;
  type: string;
}

interface Order {
  _id: string;
  status: string;
  studentUSN: string;
  total: number;
}

interface MenuItem {
  _id: string;
  available: boolean;
}

interface ForumPost {
  _id: string;
  authorUSN: string;
  status: string;
}

interface Poll {
  _id: string;
  status: string;
}

interface Notice {
  _id: string;
  status: string;
  priority: string;
  expiresAt: string;
  category: string;
}

export default function DashboardPage() {
  const { user } = useUser();
  const studentUSN = user?.usn || "";
  const [refreshInterval, setRefreshInterval] = useState(30);
  
  const { data: washingBookings, loading: washingLoading, refetch: refetchWashing } = useApi<LaundryBooking[]>(
    "/api/laundry",
    { autoFetch: false }
  );
  const { data: dryerBookings, loading: dryerLoading, refetch: refetchDryer } = useApi<LaundryBooking[]>(
    "/api/laundry",
    { autoFetch: false }
  );
  
  const { data: electricalRequests, loading: electricalLoading, refetch: refetchElectrical } = useApi<Maintenance[]>(
    "/api/maintenance",
    { autoFetch: false }
  );
  const { data: carpentryRequests, loading: carpentryLoading, refetch: refetchCarpentry } = useApi<Maintenance[]>(
    "/api/maintenance",
    { autoFetch: false }
  );
  const { data: plumbingRequests, loading: plumbingLoading, refetch: refetchPlumbing } = useApi<Maintenance[]>(
    "/api/maintenance",
    { autoFetch: false }
  );
  
  const { data: roomRequests, loading: roomLoading, refetch: refetchRoom } = useApi<Maintenance[]>(
    "/api/maintenance",
    { autoFetch: false }
  );
  const { data: bathroomRequests, loading: bathroomLoading, refetch: refetchBathroom } = useApi<CleaningRequest[]>(
    "/api/cleaning",
    { autoFetch: false }
  );
  
  const { data: menuItems, loading: menuLoading, refetch: refetchMenu } = useApi<MenuItem[]>(
    "/api/canteen/menu",
    { autoFetch: false }
  );
  const { data: orders, loading: ordersLoading, refetch: refetchOrders } = useApi<Order[]>(
    "/api/canteen/orders",
    { autoFetch: false }
  );
  
  const { data: forumPosts, loading: forumLoading, refetch: refetchPosts } = useApi<ForumPost[]>(
    "/api/forum/posts",
    { autoFetch: false }
  );
  const { data: wardenComplaints, loading: wardenLoading, refetch: refetchWarden } = useApi<Maintenance[]>(
    "/api/maintenance",
    { autoFetch: false }
  );
  const { data: polls, loading: pollsLoading, refetch: refetchPolls } = useApi<Poll[]>(
    "/api/forum/polls",
    { autoFetch: false }
  );
  
  const { data: notices, loading: noticesLoading, refetch: refetchNotices } = useApi<Notice[]>(
    "/api/notices",
    { autoFetch: false }
  );

  const loading = washingLoading || dryerLoading || electricalLoading || carpentryLoading || 
                   plumbingLoading || roomLoading || bathroomLoading || menuLoading || 
                   ordersLoading || forumLoading || wardenLoading || pollsLoading || noticesLoading;
  
  useEffect(() => {
    if (studentUSN) {
      refetchWashing({ machineType: "Washing Machine", usn: studentUSN });
      refetchDryer({ machineType: "Dryer", usn: studentUSN });
      refetchElectrical({ type: "Electrical", usn: studentUSN });
      refetchCarpentry({ type: "Carpentry", usn: studentUSN });
      refetchPlumbing({ type: "Plumbing", usn: studentUSN });
      refetchRoom({ type: "room", usn: studentUSN });
      refetchBathroom({ type: "Bathroom", usn: studentUSN });
      refetchOrders({ usn: studentUSN });
      refetchWarden({ type: "warden", usn: studentUSN });
    }
    
    refetchPosts({});
    refetchPolls({});
    refetchNotices({ status: "Active" });
  }, [studentUSN, refetchWashing, refetchDryer, refetchElectrical, refetchCarpentry, refetchPlumbing, refetchRoom, refetchBathroom, refetchOrders, refetchWarden, refetchMenu, refetchPosts, refetchPolls, refetchNotices]);

  useEffect(() => {
    if (!studentUSN) return;
    
    const interval = setInterval(() => {
      refetchWashing({ machineType: "Washing Machine", usn: studentUSN });
      refetchDryer({ machineType: "Dryer", usn: studentUSN });
      refetchElectrical({ type: "Electrical", usn: studentUSN });
      refetchCarpentry({ type: "Carpentry", usn: studentUSN });
      refetchPlumbing({ type: "Plumbing", usn: studentUSN });
      refetchRoom({ type: "room", usn: studentUSN });
      refetchBathroom({ type: "Bathroom", usn: studentUSN });
      refetchOrders({ usn: studentUSN });
      refetchWarden({ type: "warden", usn: studentUSN });
      
      refetchMenu({ available: "true" });
      refetchPolls({});
      refetchNotices({ status: "Active" });
      setRefreshInterval(30);
    }, 30000);

    return () => clearInterval(interval);
  }, [studentUSN, refetchWashing, refetchDryer, refetchElectrical, refetchCarpentry, refetchPlumbing, refetchRoom, refetchBathroom, refetchOrders, refetchWarden, refetchMenu, refetchPosts, refetchPolls, refetchNotices]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setRefreshInterval(prev => prev > 0 ? prev - 1 : 30);
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const myWashingBookings = (washingBookings || []).filter(b => b.machineType === "Washing Machine");
  const myDryerBookings = (dryerBookings || []).filter(b => b.machineType === "Dryer");
  const myElectricalRequests = (electricalRequests || []).filter(r => r.type === "Electrical");
  const myCarpentryRequests = (carpentryRequests || []).filter(r => r.type === "Carpentry");
  const myPlumbingRequests = (plumbingRequests || []).filter(r => r.type === "Plumbing");
  const myRoomRequests = (roomRequests || []).filter(r => r.type === "room");
  const myBathroomRequests = (bathroomRequests || []).filter(r => r.type === "Bathroom");
  
  const myOrders = orders || [];
  const availableMenuItems = (menuItems || []).filter(m => m.available).length;
  const totalSpent = myOrders.reduce((sum, o) => sum + o.total, 0);
  
  const myDiscussions = (forumPosts || [])
    .filter(p => (p.status === "Active" || p.status === "Resolved") && p.authorUSN === studentUSN).length;
  const myWardenComplaints = (wardenComplaints || []).length;
  const activePolls = (polls || []).filter(p => p.status === "Active").length;
  const activeNotices = (notices || []).filter(n => n.status === "Active").length;
  const urgentNotices = (notices || []).filter(n => n.priority === "High").length;
  const expiringSoonNotices = (notices || []).filter(n => {
    const daysLeft = Math.ceil((new Date(n.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 3 && daysLeft > 0;
  }).length;

  return (
    <div>
      <DashboardHeader title="Dashboard" />
      
      <div className="p-4 md:p-8 space-y-6 md:space-y-8">
        {/* Header with Live Data Indicator */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold">My Campus Services</h3>
            <p className="text-gray-600 mt-1">Real-time updates on your campus activities</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-green-700">Live Data</span>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg border">
              Next update: {refreshInterval}s
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            {/* Module Insights */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* ZenWash */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Droplet className="w-6 h-6 text-blue-600" />
                  </div>
                  {(washingLoading || dryerLoading) && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                </div>
                <h4 className="text-lg font-semibold mb-3">ZenWash</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-500 uppercase">My Washing</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">My Bookings</span>
                      <span className="text-lg font-bold text-blue-600">{myWashingBookings.length}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                      <span>Active: {myWashingBookings.filter(b => b.status === "Scheduled" || b.status === "In Progress").length}</span>
                      <span>Completed: {myWashingBookings.filter(b => b.status === "Completed").length}</span>
                    </div>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-500 uppercase">My Dryer</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">My Bookings</span>
                      <span className="text-lg font-bold text-blue-600">{myDryerBookings.length}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                      <span>Active: {myDryerBookings.filter(b => b.status === "Scheduled" || b.status === "In Progress").length}</span>
                      <span>Completed: {myDryerBookings.filter(b => b.status === "Completed").length}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ZenMaintenance */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-amber-100 p-3 rounded-lg">
                    <Users className="w-6 h-6 text-amber-600" />
                  </div>
                  {(electricalLoading || carpentryLoading || plumbingLoading) && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                </div>
                <h4 className="text-lg font-semibold mb-3">ZenMaintenance</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-500 uppercase">My Electrical</span>
                      <span className="text-lg font-bold text-amber-600">{myElectricalRequests.length}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Pending: {myElectricalRequests.filter(r => r.status === "Pending").length}</span>
                      <span>Completed: {myElectricalRequests.filter(r => r.status === "Completed").length}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-500 uppercase">My Carpentry</span>
                      <span className="text-lg font-bold text-amber-600">{myCarpentryRequests.length}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Pending: {myCarpentryRequests.filter(r => r.status === "Pending").length}</span>
                      <span>Completed: {myCarpentryRequests.filter(r => r.status === "Completed").length}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-500 uppercase">My Plumbing</span>
                      <span className="text-lg font-bold text-amber-600">{myPlumbingRequests.length}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Pending: {myPlumbingRequests.filter(r => r.status === "Pending").length}</span>
                      <span>Completed: {myPlumbingRequests.filter(r => r.status === "Completed").length}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ZenCleaning */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Home className="w-6 h-6 text-green-600" />
                  </div>
                  {(roomLoading || bathroomLoading) && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                </div>
                <h4 className="text-lg font-semibold mb-3">ZenCleaning</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-500 uppercase">My Room</span>
                      <span className="text-lg font-bold text-green-600">{myRoomRequests.length}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Pending: {myRoomRequests.filter(r => r.status === "Pending").length}</span>
                      <span>Completed: {myRoomRequests.filter(r => r.status === "Completed").length}</span>
                    </div>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-500 uppercase">My Bathroom</span>
                      <span className="text-lg font-bold text-green-600">{myBathroomRequests.length}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Pending: {myBathroomRequests.filter(r => r.status === "Pending").length}</span>
                      <span>Completed: {myBathroomRequests.filter(r => r.status === "Completed").length}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ZenCanteen */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Coffee className="w-6 h-6 text-orange-600" />
                  </div>
                  {(menuLoading || ordersLoading) && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                </div>
                <h4 className="text-lg font-semibold mb-3">ZenCanteen</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-500 uppercase">Menu Items</span>
                      <span className="text-lg font-bold text-orange-600">{availableMenuItems}</span>
                    </div>
                    <div className="text-xs text-gray-500">Available to order now</div>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-500 uppercase">My Orders</span>
                      <span className="text-lg font-bold text-orange-600">{myOrders.length}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Pending: {myOrders.filter(o => o.status === "Pending" || o.status === "Preparing").length}</span>
                      <span>My Spending: ₹{totalSpent}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ZenStudent */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-purple-600" />
                  </div>
                  {(forumLoading || wardenLoading || pollsLoading) && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                </div>
                <h4 className="text-lg font-semibold mb-3">ZenStudent</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-500 uppercase">My Discussions</span>
                      <span className="text-lg font-bold text-purple-600">{myDiscussions}</span>
                    </div>
                    <div className="text-xs text-gray-500">Forum posts created by me</div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-500 uppercase">Warden Complaints</span>
                      <span className="text-lg font-bold text-orange-600">{myWardenComplaints}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Pending: {(wardenComplaints || []).filter(c => c.status === "Pending").length}
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-500 uppercase">Active Polls</span>
                      <span className="text-lg font-bold text-purple-600">{activePolls}</span>
                    </div>
                    <div className="text-xs text-gray-500">Available to vote</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ZenNotice */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <Bell className="w-6 h-6 text-red-600" />
                  </div>
                  {noticesLoading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                </div>
                <h4 className="text-lg font-semibold mb-3">ZenNotice</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">My Notices</span>
                    <span className="text-xl font-bold text-gray-900">{activeNotices}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Urgent</span>
                    <span className="text-sm font-medium text-red-600">{urgentNotices}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Expiring Soon</span>
                    <span className="text-sm font-medium text-amber-600">{expiringSoonNotices}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-foreground mb-4 tracking-tight">
                  Welcome to ZenCampus
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Manage your campus services efficiently with our new streamlined interface.
                </p>
              </div>
              <div className="flex-1 max-w-2xl opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
                <svg viewBox="0 0 720 480" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <rect width="100%" height="100%" rx="20" fill="hsl(var(--muted))" />
                  <g transform="translate(180,80)">
                    <rect x="0" y="0" width="360" height="240" rx="16" fill="hsl(var(--card))" stroke="hsl(var(--border) / 0.6)" />
                    <rect x="0" y="0" width="360" height="48" rx="12" fill="hsl(var(--primary))" />
                    <text x="180" y="34" textAnchor="middle" fill="hsl(var(--primary-foreground))" fontSize="16" fontWeight="700">Slot Scheduler</text>
                    <g transform="translate(24,72)" fill="hsl(var(--popover))">
                      <rect x="0" y="0" width="72" height="40" rx="8" />
                      <rect x="88" y="0" width="72" height="40" rx="8" />
                      <rect x="176" y="0" width="72" height="40" rx="8" />
                      <rect x="264" y="0" width="72" height="40" rx="8" />
                    </g>
                    <rect x="88" y="72" width="72" height="40" rx="8" fill="hsl(var(--primary))" />
                  </g>
                </svg>
              </div>
            </div>
         
          </>
        )}
      </div>
    </div>
  );
}
