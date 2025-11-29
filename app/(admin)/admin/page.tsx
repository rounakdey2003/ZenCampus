"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { 
  Users, 
  AlertTriangle,
  Droplet,
  Wind,
  Coffee,
  MessageSquare,
  ArrowRight,
  Loader2,
  Wrench,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { useApi } from "@/hooks/useApi";
import { useEffect, useState } from "react";

interface Student {
  _id: string;
  usn: string;
  name: string;
  mobile: string;
  room?: string;
}

interface Complaint {
  _id: string;
  type: string;
  status: "Pending" | "In Progress" | "Completed";
  priority: string;
  roomNumber: string;
}

interface MaintenanceRequest {
  _id: string;
  type: "Electrical" | "Plumbing" | "Carpentry" | "General";
  status: "Pending" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High" | "Urgent";
}

interface LaundryBooking {
  _id: string;
  machineType: "Washing Machine" | "Dryer";
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
}

interface Machine {
  _id: string;
  machineNumber: number;
  status: "Available" | "Faulty" | "Repairing" | "In Use";
}

interface MachinesResponse {
  washing: Machine[];
  dryer: Machine[];
}

interface CleaningRequest {
  _id: string;
  type: "Room" | "Bathroom" | "Common Area";
  status: "Pending" | "Scheduled" | "In Progress" | "Completed";
  priority: "Normal" | "High" | "Urgent";
}

interface MenuItem {
  _id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
}

interface Order {
  _id: string;
  total: number;
  status: "Pending" | "Preparing" | "Ready" | "Delivered";
  createdAt: string;
}

interface ForumPost {
  _id: string;
  status: "Active" | "Flagged" | "Resolved" | "Deleted";
  likes: number;
  comments: number;
}

interface Poll {
  _id: string;
  totalVotes: number;
  status: "Active" | "Closed";
}

interface Notice {
  _id: string;
  category: "General" | "Academic" | "Event" | "Urgent" | "Maintenance";
  priority: "Low" | "Medium" | "High";
  status: "Active" | "Archived";
  expiresAt: string;
}

export default function AdminDashboard() {
  const [refreshInterval, setRefreshInterval] = useState(30);

  const { data: students, loading: studentsLoading, refetch: refetchStudents } = useApi<Student[]>("/api/students");
  const { data: complaints, loading: complaintsLoading, refetch: refetchComplaints } = useApi<Complaint[]>("/api/maintenance", { params: { type: "warden" } });
  const { data: maintenance, loading: maintenanceLoading, refetch: refetchMaintenance } = useApi<MaintenanceRequest[]>("/api/maintenance");
  const { data: laundry, loading: laundryLoading, refetch: refetchLaundry } = useApi<LaundryBooking[]>("/api/laundry");
  const { data: machines, loading: machinesLoading, refetch: refetchMachines } = useApi<MachinesResponse>("/api/machines");
  const { data: cleaning, loading: cleaningLoading, refetch: refetchCleaning } = useApi<CleaningRequest[]>("/api/cleaning");
  const { data: menuItems, loading: menuLoading, refetch: refetchMenu } = useApi<MenuItem[]>("/api/canteen/menu");
  const { data: orders, loading: ordersLoading, refetch: refetchOrders } = useApi<Order[]>("/api/canteen/orders");
  const { data: forumPosts, loading: forumLoading, refetch: refetchForum } = useApi<ForumPost[]>("/api/forum/posts");
  const { data: polls, loading: pollsLoading, refetch: refetchPolls } = useApi<Poll[]>("/api/forum/polls");
  const { data: notices, loading: noticesLoading, refetch: refetchNotices } = useApi<Notice[]>("/api/notices");

  const loading = studentsLoading || complaintsLoading || maintenanceLoading || laundryLoading || 
                   machinesLoading || cleaningLoading || menuLoading || ordersLoading || 
                   forumLoading || pollsLoading || noticesLoading;

  useEffect(() => {
    const interval = setInterval(() => {
      refetchStudents();
      refetchComplaints();
      refetchMaintenance();
      refetchLaundry();
      refetchMachines();
      refetchCleaning();
      refetchMenu();
      refetchOrders();
      refetchForum();
      refetchPolls();
      refetchNotices();
      setRefreshInterval(30);
    }, 30000);

    return () => clearInterval(interval);
  }, [refetchStudents, refetchComplaints, refetchMaintenance, refetchLaundry, refetchMachines, 
      refetchCleaning, refetchMenu, refetchOrders, refetchForum, refetchPolls, refetchNotices]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setRefreshInterval(prev => prev > 0 ? prev - 1 : 30);
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const studentsData = students || [];
  const complaintsData = complaints || [];
  const maintenanceData = (maintenance || []).filter(m => m.type !== "General");
  const laundryData = laundry || [];
  const washingMachines = machines?.washing || [];
  const dryerMachines = machines?.dryer || [];
  const cleaningData = cleaning || [];
  const menuData = menuItems || [];
  const ordersData = orders || [];
  const forumData = forumPosts || [];
  const pollsData = polls || [];
  const noticesData = notices || [];

  const totalStudents = studentsData.length;
  const studentsWithRooms = studentsData.filter(s => s.room).length;
  const studentsWithoutRooms = totalStudents - studentsWithRooms;

  const totalComplaints = complaintsData.length;
  const pendingComplaints = complaintsData.filter(c => c.status === "Pending").length;
  const completedComplaints = complaintsData.filter(c => c.status === "Completed").length;

  const totalMaintenance = maintenanceData.length;
  const pendingMaintenance = maintenanceData.filter(m => m.status === "Pending").length;
  const inProgressMaintenance = maintenanceData.filter(m => m.status === "In Progress").length;
  const urgentMaintenance = maintenanceData.filter(m => m.priority === "High" || m.priority === "Urgent").length;

  const totalBookings = laundryData.length;
  const activeBookings = laundryData.filter(l => l.status === "Scheduled" || l.status === "In Progress").length;
  const washingAvailable = washingMachines.filter(m => m.status === "Available").length;
  const dryerAvailable = dryerMachines.filter(m => m.status === "Available").length;
  const faultyMachines = [...washingMachines, ...dryerMachines].filter(m => m.status === "Faulty" || m.status === "Repairing").length;

  const totalCleaning = cleaningData.length;
  const pendingCleaning = cleaningData.filter(c => c.status === "Pending").length;
  const urgentCleaning = cleaningData.filter(c => c.priority === "High" || c.priority === "Urgent").length;

  const totalMenu = menuData.length;
  const availableItems = menuData.filter(m => m.available).length;
  const totalOrders = ordersData.length;
  const todayRevenue = ordersData.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = ordersData.filter(o => o.status === "Pending" || o.status === "Preparing").length;

  const totalPosts = forumData.length;
  const activePosts = forumData.filter(f => f.status === "Active").length;
  const flaggedPosts = forumData.filter(f => f.status === "Flagged").length;
  const totalLikes = forumData.reduce((sum, f) => sum + f.likes, 0);
  const activePolls = pollsData.filter(p => p.status === "Active").length;
  const totalVotes = pollsData.reduce((sum, p) => sum + p.totalVotes, 0);

  const totalNotices = noticesData.length;
  const activeNotices = noticesData.filter(n => n.status === "Active" && new Date(n.expiresAt) > new Date()).length;
  const urgentNotices = noticesData.filter(n => n.priority === "High" && n.status === "Active").length;

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campus Management Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time insights from all management modules</p>
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
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Students Management</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Student registration and room allocation</p>
                  </div>
                </div>
                <Link href="/admin/students">
                  <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Details <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{totalStudents}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">With Rooms</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{studentsWithRooms}</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Without Rooms</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">{studentsWithoutRooms}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Occupancy Rate</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">
                    {totalStudents > 0 ? Math.round((studentsWithRooms / totalStudents) * 100) : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle>Warden Complaints</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Student complaints and issues</p>
                  </div>
                </div>
                <Link href="/admin/complaints">
                  <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Details <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Complaints</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{totalComplaints}</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">{pendingComplaints}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{completedComplaints}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Resolution Rate</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">
                    {totalComplaints > 0 ? Math.round((completedComplaints / totalComplaints) * 100) : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Wrench className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle>Maintenance Management</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Electrical, Plumbing, and Carpentry requests</p>
                  </div>
                </div>
                <Link href="/admin/maintenance">
                  <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Details <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{totalMaintenance}</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">{pendingMaintenance}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">{inProgressMaintenance}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">High Priority</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">{urgentMaintenance}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {totalMaintenance > 0 
                      ? Math.round((maintenanceData.filter(m => m.status === "Completed").length / totalMaintenance) * 100) 
                      : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-100 rounded-lg">
                    <Droplet className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <CardTitle>Laundry Management</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Washing and dryer bookings</p>
                  </div>
                </div>
                <Link href="/admin/laundry">
                  <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Details <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <p className="text-sm font-medium text-gray-900">Booking Statistics</p>
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Total Bookings</p>
                      <p className="text-xl font-bold text-gray-900 mt-1">{totalBookings}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Active Bookings</p>
                      <p className="text-xl font-bold text-blue-600 mt-1">{activeBookings}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-sm font-medium text-gray-900">Washing Machines</p>
                  <div className="space-y-3">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Available</p>
                      <p className="text-xl font-bold text-green-600 mt-1">{washingAvailable}/{washingMachines.length}</p>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">In Use</p>
                      <p className="text-xl font-bold text-amber-600 mt-1">
                        {washingMachines.filter(m => m.status === "In Use").length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-sm font-medium text-gray-900">Dryers</p>
                  <div className="space-y-3">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Available</p>
                      <p className="text-xl font-bold text-green-600 mt-1">{dryerAvailable}/{dryerMachines.length}</p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Faulty/Repairing</p>
                      <p className="text-xl font-bold text-red-600 mt-1">{faultyMachines}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <Wind className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <CardTitle>Cleaning Management</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Room, Bathroom, and Common Area cleaning</p>
                  </div>
                </div>
                <Link href="/admin/cleaning">
                  <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Details <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{totalCleaning}</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">{pendingCleaning}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Urgent</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">{urgentCleaning}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {totalCleaning > 0 
                      ? Math.round((cleaningData.filter(c => c.status === "Completed").length / totalCleaning) * 100) 
                      : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <Coffee className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <CardTitle>Canteen Management</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Menu items and order management</p>
                  </div>
                </div>
                <Link href="/admin/canteen">
                  <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Details <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">₹{todayRevenue.toFixed(0)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{totalOrders}</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Pending Orders</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">{pendingOrders}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Menu Items</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">{totalMenu}</p>
                </div>
                <div className="bg-teal-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Available Items</p>
                  <p className="text-2xl font-bold text-teal-600 mt-1">{availableItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle>Student Forum</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Community posts and polls</p>
                  </div>
                </div>
                <Link href="/admin/forum">
                  <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Details <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="text-sm font-medium text-gray-900">Forum Posts</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Total Posts</p>
                      <p className="text-xl font-bold text-gray-900 mt-1">{totalPosts}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Active</p>
                      <p className="text-xl font-bold text-green-600 mt-1">{activePosts}</p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Flagged</p>
                      <p className="text-xl font-bold text-red-600 mt-1">{flaggedPosts}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Total Likes</p>
                      <p className="text-xl font-bold text-blue-600 mt-1">{totalLikes}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-sm font-medium text-gray-900">Polls</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Total Polls</p>
                      <p className="text-xl font-bold text-gray-900 mt-1">{pollsData.length}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Active Polls</p>
                      <p className="text-xl font-bold text-green-600 mt-1">{activePolls}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg col-span-2">
                      <p className="text-sm text-gray-600">Total Votes</p>
                      <p className="text-xl font-bold text-purple-600 mt-1">{totalVotes}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Bell className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <CardTitle>Notices Management</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Campus announcements and notices</p>
                  </div>
                </div>
                <Link href="/admin/notices">
                  <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Details <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Notices</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{totalNotices}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{activeNotices}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Urgent</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">{urgentNotices}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Archived</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">
                    {noticesData.filter(n => n.status === "Archived").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
