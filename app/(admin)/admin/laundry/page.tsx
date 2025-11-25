"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Droplet,
  Wind,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Settings,
  Wrench,
  Info,
} from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { useSettings } from "@/hooks/useSettings";
import { cn } from "@/lib/utils";

interface LaundryBooking {
  _id: string;
  studentName: string;
  studentUSN: string;
  roomNumber: string;
  machineType: "Washing Machine" | "Dryer";
  machineNumber: number;
  scheduledDate: string;
  timeSlot: string;
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
  duration?: string;
}

interface Machine {
  _id: string;
  machineNumber: number;
  status: "Available" | "Faulty" | "Repairing" | "In Use";
  userUSN?: string | null;
  userName?: string | null;
  startTime?: Date | null;
  endTime?: Date | null;
  repairEndTime?: Date | null;
  lastUpdated: Date;
}

interface MachinesResponse {
  washing: Machine[];
  dryer: Machine[];
}

export default function LaundryManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterType, setFilterType] = useState<string>("All");
  const [selectedBooking, setSelectedBooking] = useState<LaundryBooking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showMachineModal, setShowMachineModal] = useState(false);
  
  const { settings } = useSettings();

  const { data: bookings, loading, error, refetch } = useApi<LaundryBooking[]>("/api/laundry");
  const { 
    data: machinesData, 
    loading: machinesLoading, 
    refetch: refetchMachines
  } = useApi<MachinesResponse>("/api/machines");

  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchQuery) params.search = searchQuery;
    if (filterStatus !== "All") params.status = filterStatus;
    if (filterType !== "All") params.machineType = filterType;
    refetch(params);
  }, [searchQuery, filterStatus, filterType, refetch]);

  // Automatic status checking - runs every 30 seconds
  useEffect(() => {
    const checkStatuses = async () => {
      try {
        await fetch("/api/laundry/check-status", { method: "POST" });
        // Refetch bookings after status check
        const params: Record<string, string> = {};
        if (searchQuery) params.search = searchQuery;
        if (filterStatus !== "All") params.status = filterStatus;
        if (filterType !== "All") params.machineType = filterType;
        refetch(params);
      } catch (err) {
        console.error("Failed to check booking statuses:", err);
      }
    };

    // Check immediately on mount
    checkStatuses();

    // Then check every 30 seconds
    const interval = setInterval(checkStatuses, 30000);

    return () => clearInterval(interval);
  }, [searchQuery, filterStatus, filterType, refetch]);

  const filteredBookings = bookings || [];
  const washingMachines = machinesData?.washing || [];
  const dryers = machinesData?.dryer || [];

  const stats = {
    totalBookings: filteredBookings.length,
    scheduled: filteredBookings.filter((b) => b.status === "Scheduled").length,
    inProgress: filteredBookings.filter((b) => b.status === "In Progress").length,
    completed: filteredBookings.filter((b) => b.status === "Completed").length,
    washingAvailable: washingMachines.filter(m => m.status === "Available").length,
    washingFaulty: washingMachines.filter(m => m.status === "Faulty").length,
    washingRepairing: washingMachines.filter(m => m.status === "Repairing").length,
    dryerAvailable: dryers.filter(m => m.status === "Available").length,
    dryerFaulty: dryers.filter(m => m.status === "Faulty").length,
    dryerRepairing: dryers.filter(m => m.status === "Repairing").length,
  };

  const updateMachineStatus = async (machineId: string, machineType: "washing" | "dryer", newStatus: "Available" | "Faulty" | "Repairing") => {
    try {
      await fetch(`/api/machines/${machineId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: machineType, status: newStatus })
      });
      refetchMachines();
    } catch (err) {
      toast.error("Failed to update machine status: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Laundry Management</h1>
          <p className="text-gray-600 mt-1">Manage washing machine and dryer bookings</p>
        </div>
        <Button onClick={() => setShowMachineModal(true)} className="w-full md:w-auto">
          <Settings className="w-4 h-4 mr-2" />
          Machine Settings
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Calendar className="w-6 h-6 mx-auto text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Total Bookings</p>
              <h3 className="text-2xl font-bold text-foreground">{stats.totalBookings}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Clock className="w-6 h-6 mx-auto text-yellow-500/80 mb-2" />
              <p className="text-sm text-muted-foreground">Scheduled</p>
              <h3 className="text-2xl font-bold text-yellow-600">{stats.scheduled}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <AlertCircle className="w-6 h-6 mx-auto text-orange-500/80 mb-2" />
              <p className="text-sm text-muted-foreground">In Progress</p>
              <h3 className="text-2xl font-bold text-orange-600">{stats.inProgress}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <CheckCircle className="w-6 h-6 mx-auto text-green-500/80 mb-2" />
              <p className="text-sm text-muted-foreground">Completed</p>
              <h3 className="text-2xl font-bold text-green-600">{stats.completed}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary/30">
          <CardContent className="p-4">
            <div className="text-center">
              <Droplet className="w-6 h-6 mx-auto text-blue-500 mb-2" />
              <p className="text-sm text-muted-foreground">Washing Available</p>
              <h3 className="text-2xl font-bold text-foreground">{stats.washingAvailable}/{washingMachines.length}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary/30">
          <CardContent className="p-4">
            <div className="text-center">
              <Wind className="w-6 h-6 mx-auto text-purple-500 mb-2" />
              <p className="text-sm text-muted-foreground">Dryer Available</p>
              <h3 className="text-2xl font-bold text-foreground">{stats.dryerAvailable}/{dryers.length}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Machine Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplet className="w-5 h-5 text-cyan-500" />
              Washing Machines Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {machinesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {washingMachines.map((machine) => (
                  <div key={`washing-${machine._id}`} className="relative">
                    <div className={cn(
                      "p-4 border rounded-lg text-center transition-colors",
                      machine.status === "Available" ? "bg-green-500/5 border-green-500/20" :
                      machine.status === "Faulty" ? "bg-red-500/5 border-red-500/20" :
                      machine.status === "In Use" ? "bg-blue-500/5 border-blue-500/20" :
                      "bg-yellow-500/5 border-yellow-500/20"
                    )}>
                      <Droplet className={cn(
                        "w-8 h-8 mx-auto mb-2",
                        machine.status === "Available" ? "text-green-500" :
                        machine.status === "Faulty" ? "text-red-500" :
                        machine.status === "In Use" ? "text-blue-500" :
                        "text-yellow-500"
                      )} />
                      <p className="font-bold">WM-{machine.machineNumber}</p>
                      <Badge variant={
                        machine.status === "Available" ? "success" :
                        machine.status === "Faulty" ? "destructive" :
                        machine.status === "In Use" ? "default" :
                        "warning"
                      } className="text-xs mt-1">
                        {machine.status}
                      </Badge>
                    </div>
                    <div className="mt-2 flex gap-1">
                      <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => updateMachineStatus(machine._id, "washing", "Available")}>
                        <CheckCircle className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => updateMachineStatus(machine._id, "washing", "Faulty")}>
                        <XCircle className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => updateMachineStatus(machine._id, "washing", "Repairing")}>
                        <Wrench className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-purple-500" />
              Dryers Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {machinesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {dryers.map((machine) => (
                  <div key={`dryer-${machine._id}`} className="relative">
                    <div className={cn(
                      "p-4 border rounded-lg text-center transition-colors",
                      machine.status === "Available" ? "bg-green-500/5 border-green-500/20" :
                      machine.status === "Faulty" ? "bg-red-500/5 border-red-500/20" :
                      machine.status === "In Use" ? "bg-blue-500/5 border-blue-500/20" :
                      "bg-yellow-500/5 border-yellow-500/20"
                    )}>
                      <Wind className={cn(
                        "w-8 h-8 mx-auto mb-2",
                        machine.status === "Available" ? "text-green-500" :
                        machine.status === "Faulty" ? "text-red-500" :
                        machine.status === "In Use" ? "text-blue-500" :
                        "text-yellow-500"
                      )} />
                      <p className="font-bold">D-{machine.machineNumber}</p>
                      <Badge variant={
                        machine.status === "Available" ? "success" :
                        machine.status === "Faulty" ? "destructive" :
                        machine.status === "In Use" ? "default" :
                        "warning"
                      } className="text-xs mt-1">
                        {machine.status}
                      </Badge>
                    </div>
                    <div className="mt-2 flex gap-1">
                      <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => updateMachineStatus(machine._id, "dryer", "Available")}>
                        <CheckCircle className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => updateMachineStatus(machine._id, "dryer", "Faulty")}>
                        <XCircle className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => updateMachineStatus(machine._id, "dryer", "Repairing")}>
                        <Wrench className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by student name or USN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border-2 rounded-lg w-full sm:w-auto"
              >
                <option value="All">All Types</option>
                <option value="Washing Machine">Washing Machine</option>
                <option value="Dryer">Dryer</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border-2 rounded-lg w-full sm:w-auto"
              >
                <option value="All">All Status</option>
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bookings ({filteredBookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-2">Loading bookings...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              Error: {error}
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No bookings found. {searchQuery && "Try adjusting your search."}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredBookings.map((booking) => (
                <div key={booking._id} className="p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex gap-4 flex-1">
                      <div className="mt-1">
                        {booking.machineType === "Washing Machine" ? (
                          <Droplet className="w-6 h-6 text-blue-500" />
                        ) : (
                          <Wind className="w-6 h-6 text-purple-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{booking.studentName}</h4>
                          <Badge variant={
                            booking.status === "Completed" ? "success" :
                            booking.status === "In Progress" ? "warning" :
                            booking.status === "Cancelled" ? "secondary" :
                            "default"
                          }>
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span>{booking.machineType} {booking.machineNumber}</span>
                          <span>Room: {booking.roomNumber}</span>
                          <span>{new Date(booking.scheduledDate).toLocaleDateString()}</span>
                          <span>{booking.timeSlot}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowDetailsModal(true);
                      }}
                      className="w-full md:w-auto"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Machine Settings Modal */}
      {showMachineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold">Laundry System Configuration</h2>
            </div>

            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">Managed from System Settings</p>
                  <p>Machine counts and laundry settings are configured in the System Settings page.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Washing Machines
                </label>
                <div className="p-3 bg-gray-100 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {settings?.washingMachines || machinesData?.washing.length || 0}
                  </p>
                  <p className="text-sm text-gray-600">Total configured machines</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Dryers
                </label>
                <div className="p-3 bg-gray-100 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {settings?.dryers || machinesData?.dryer.length || 0}
                  </p>
                  <p className="text-sm text-gray-600">Total configured machines</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Slot Duration
                </label>
                <div className="p-3 bg-gray-100 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {settings?.slotDuration || 60} minutes
                  </p>
                  <p className="text-sm text-gray-600">Per booking</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Max Bookings Per Student
                </label>
                <div className="p-3 bg-gray-100 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {settings?.maxBookingsPerStudent || 2}
                  </p>
                  <p className="text-sm text-gray-600">Concurrent bookings allowed</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowMachineModal(false)} className="flex-1">
                Close
              </Button>
              <Button 
                onClick={() => window.location.href = '/admin/settings'} 
                className="flex-1"
              >
                <Settings className="w-4 h-4 mr-2" />
                Go to Settings
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {selectedBooking.machineType === "Washing Machine" ? (
                  <Droplet className="w-8 h-8 text-cyan-500" />
                ) : (
                  <Wind className="w-8 h-8 text-purple-500" />
                )}
                <div>
                  <h3 className="font-semibold text-lg">{selectedBooking.machineType} Booking</h3>
                  <p className="text-sm text-gray-600">Booking ID: {selectedBooking._id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Machine Number</p>
                  <p className="font-medium">{selectedBooking.machineNumber}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge variant={
                    selectedBooking.status === "Completed" ? "success" :
                    selectedBooking.status === "In Progress" ? "warning" :
                    selectedBooking.status === "Cancelled" ? "secondary" :
                    "default"
                  }>
                    {selectedBooking.status}
                  </Badge>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">{new Date(selectedBooking.scheduledDate).toLocaleDateString()}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Time Slot</p>
                  <p className="font-medium">{selectedBooking.timeSlot}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Student Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{selectedBooking.studentName}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">USN</p>
                    <p className="font-medium">{selectedBooking.studentUSN}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Room Number</p>
                    <p className="font-medium">{selectedBooking.roomNumber}</p>
                  </div>
                </div>
              </div>


              <div className="border-t pt-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">Automatic Status Transitions</p>
                      <p>
                        Bookings automatically transition:<br />
                        • <strong>Scheduled → In Progress</strong> at the scheduled start time<br />
                        • <strong>In Progress → Completed</strong> at the scheduled end time
                      </p>
                      <p className="mt-2 text-xs text-blue-700">
                        The system checks and updates booking statuses every 30 seconds.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="flex gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowDetailsModal(false)} className="flex-1">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
