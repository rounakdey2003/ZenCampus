"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { Droplet, Wind, Loader2 } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { useUser } from "@/hooks/useUser";
import { useSettings } from "@/hooks/useSettings";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { TimetableDisplay } from "@/components/TimetableDisplay";

interface LaundryBooking {
  _id: string;
  machineType: string;
  machineNumber: number;
  cycleType?: string;
  scheduledDate: string;
  timeSlot: string;
  status: string;
}



function WashingContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "washing";
  const { user } = useUser();
  
  const studentUSN = user?.usn || "";
  const studentName = user?.name || "";
  const roomNumber = user?.roomNumber || "";
  const [selectedMachine, setSelectedMachine] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [machineStatuses, setMachineStatuses] = useState<Record<number, string>>({});

  const { data: bookings, loading, error, refetch, post } = useApi<LaundryBooking[]>("/api/laundry");
  const { settings } = useSettings();

  useEffect(() => {
    const fetchMachineStatuses = async () => {
      try {
        const response = await fetch(`/api/machines?type=${activeTab === "washing" ? "washing" : "dryer"}`);
        const machines = await response.json();
        
        if (Array.isArray(machines)) {
          const statusMap: Record<number, string> = {};
          machines.forEach((machine: { machineNumber: number; status: string }) => {
            statusMap[machine.machineNumber] = machine.status;
          });
          setMachineStatuses(statusMap);
        }
      } catch (err) {
        console.error("Failed to fetch machine statuses:", err);
      }
    };
    
    fetchMachineStatuses();
  }, [activeTab]);

  useEffect(() => {
    refetch({ machineType: activeTab === "washing" ? "Washing Machine" : "Dryer", usn: studentUSN });
  }, [refetch, activeTab, studentUSN]);

  useEffect(() => {
    const checkStatuses = async () => {
      try {
        await fetch("/api/laundry/check-status", { method: "POST" });
        refetch({ machineType: activeTab === "washing" ? "Washing Machine" : "Dryer", usn: studentUSN });
      } catch (err) {
        console.error("Failed to check booking statuses:", err);
      }
    };

    checkStatuses();

    const interval = setInterval(checkStatuses, 30000);

    return () => clearInterval(interval);
  }, [activeTab, studentUSN, refetch]);

  const myBookings = (bookings || []).filter(b => 
    b.machineType === (activeTab === "washing" ? "Washing Machine" : "Dryer")
  );



  const isSlotAvailable = (machineNum: number, date: string, startTime: string, endTime: string): boolean => {
    if (!date || !startTime || !endTime) return true;
    
    const conflictingBookings = (bookings || []).filter(b => 
      b.machineNumber === machineNum &&
      b.machineType === (activeTab === "washing" ? "Washing Machine" : "Dryer") &&
      b.scheduledDate === date &&
      b.status !== "Completed" &&
      b.status !== "Cancelled"
    );

    for (const booking of conflictingBookings) {
      const [bookingStart, bookingEnd] = booking.timeSlot.split(" - ");
      if (
        (startTime >= bookingStart && startTime < bookingEnd) ||
        (endTime > bookingStart && endTime <= bookingEnd) ||
        (startTime <= bookingStart && endTime >= bookingEnd)
      ) {
        return false;
      }
    }
    return true;
  };

  const calculatedTimeSlot = selectedStartTime && selectedEndTime 
    ? `${selectedStartTime} - ${selectedEndTime}`
    : "";

  const slotAvailable = selectedMachine && selectedDate && selectedStartTime && selectedEndTime
    ? isSlotAvailable(selectedMachine, selectedDate, selectedStartTime, selectedEndTime)
    : true;

  const handleBooking = async () => {
    if (!selectedMachine || !selectedDate || !selectedStartTime || !selectedEndTime) {
      toast.error("Please select machine, date, start time and end time");
      return;
    }

    if (!slotAvailable) {
      toast.error("This time slot is not available. Please choose a different time.");
      return;
    }

    const activeBookingsCount = myBookings.filter(b => 
      b.status === "Scheduled" || b.status === "In Progress"
    ).length;
    
    const maxBookings = settings?.maxBookingsPerStudent || 2;
    if (activeBookingsCount >= maxBookings) {
      toast.error(`You have reached the maximum of ${maxBookings} concurrent bookings. Please wait for a booking to complete.`);
      return;
    }

    try {
      setBookingLoading(true);
      await post({
        studentUSN,
        studentName,
        roomNumber,
        machineType: activeTab === "washing" ? "Washing Machine" : "Dryer",
        machineNumber: selectedMachine,
        scheduledDate: selectedDate,
        timeSlot: calculatedTimeSlot,
        status: "Scheduled",
      });
      toast.success("Booking successful!");
      refetch({ machineType: activeTab === "washing" ? "Washing Machine" : "Dryer", usn: studentUSN });
      setSelectedMachine(null);
      setSelectedDate("");
      setSelectedStartTime("");
      setSelectedEndTime("");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      
      if (errorMessage.includes("already booked")) {
        toast.error("Someone else just booked this slot. Please select a different time.");
        refetch({ machineType: activeTab === "washing" ? "Washing Machine" : "Dryer", usn: studentUSN });
      } else if (errorMessage.includes("maximum")) {
        toast.error(errorMessage);
      } else {
        toast.error("Booking failed: " + errorMessage);
      }
    } finally {
      setBookingLoading(false);
    }
  };

  const timeSlots = [
    "07:00 AM",
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
    "08:00 PM",
    "09:00 PM",
  ];

  return (
    <div>
      <DashboardHeader title="ZenWash" />
      
      <div className="p-8 space-y-6">
        {/* Admin Notice Message */}
        {settings?.laundryNotice && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Droplet className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 mb-1">Important Notice</h4>
                  <p className="text-sm text-blue-800 whitespace-pre-wrap">{settings.laundryNotice}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-4 border-b pb-2">
          <Link href="/washing?tab=washing" className={cn(
            "px-4 py-2 font-medium cursor-pointer transition-colors",
            activeTab === "washing" 
              ? "text-primary border-b-2 border-primary" 
              : "text-muted-foreground hover:text-foreground"
          )}>
            <Droplet className="w-4 h-4 inline mr-2" />
            Washing Machine
          </Link>
          <Link href="/washing?tab=dryer" className={cn(
            "px-4 py-2 font-medium cursor-pointer transition-colors",
            activeTab === "dryer" 
              ? "text-primary border-b-2 border-primary" 
              : "text-muted-foreground hover:text-foreground"
          )}>
            <Wind className="w-4 h-4 inline mr-2" />
            Dryer
          </Link>
        </div>

        {/* Insights Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-1">My Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{myBookings.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-1">Active</p>
              <p className="text-2xl font-bold text-blue-600">
                {myBookings.filter(b => b.status === "Scheduled" || b.status === "In Progress").length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-1">Available {activeTab === "washing" ? "Machines" : "Dryers"}</p>
              <p className="text-2xl font-bold text-green-600">
                {Object.values(machineStatuses).filter(s => s === "Available").length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {myBookings.filter(b => b.status === "Completed").length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Timetable Section */}
        <TimetableDisplay type={activeTab === "washing" ? "Washing" : "Dryer"} />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {activeTab === "washing" ? (
                  <><Droplet className="w-6 h-6 text-primary" /> Book Washing Machine</>
                ) : (
                  <><Wind className="w-6 h-6 text-primary" /> Book Dryer</>
                )}
              </div>
              <Badge variant={
                myBookings.filter(b => b.status === "Scheduled" || b.status === "In Progress").length >= (settings?.maxBookingsPerStudent || 2)
                  ? "destructive"
                  : "secondary"
              } className="text-xs">
                {myBookings.filter(b => b.status === "Scheduled" || b.status === "In Progress").length} / {settings?.maxBookingsPerStudent || 2} Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {activeTab === "washing" ? "Select Machine" : "Select Dryer"}
                </label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {(activeTab === "washing" ? [1, 2, 3, 4, 5, 6] : [1, 2, 3]).map((machine) => {
                    const status = machineStatuses[machine] || "Available";
                    const isDisabled = status === "Faulty" || status === "Repairing";
                    
                    const isSlotUnavailable = selectedDate && selectedStartTime && selectedEndTime 
                      ? !isSlotAvailable(machine, selectedDate, selectedStartTime, selectedEndTime)
                      : false;
                    
                    return (
                      <button
                        key={machine}
                        onClick={() => !isDisabled && setSelectedMachine(machine)}
                        disabled={isDisabled}
                        className={cn(
                          "p-4 border rounded-lg text-center font-semibold transition-all relative",
                          isDisabled
                            ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                            : selectedMachine === machine
                            ? "border-primary bg-primary text-primary-foreground shadow-md"
                            : "border-input hover:border-primary hover:bg-secondary/50"
                        )}
                      >
                        {activeTab === "washing" ? `M${machine}` : `D${machine}`}
                        {isDisabled && (
                          <span className="absolute top-1 right-1 text-xs bg-red-500 text-white px-1 rounded">
                            {status}
                          </span>
                        )}
                        {!isDisabled && isSlotUnavailable && (
                          <span className="absolute top-1 right-1 text-xs bg-orange-500 text-white px-1 rounded">
                            Booked
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Start Time</label>
                  <select
                    value={selectedStartTime}
                    onChange={(e) => setSelectedStartTime(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    <option value="">Choose start time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End Time</label>
                  <select
                    value={selectedEndTime}
                    onChange={(e) => setSelectedEndTime(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    <option value="">Choose end time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {calculatedTimeSlot && (
                <div className="p-4 bg-secondary/30 border border-border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Selected Time Slot</p>
                      <p className="text-lg font-bold text-foreground">{calculatedTimeSlot}</p>
                    </div>
                    <div>
                      {!slotAvailable && (
                        <Badge variant="destructive" className="text-xs">
                          Slot Unavailable
                        </Badge>
                      )}
                      {slotAvailable && selectedMachine && (
                        <Badge variant="success" className="text-xs">
                          Available
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <Button onClick={handleBooking} className="w-full" disabled={!slotAvailable || bookingLoading}>
                {bookingLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Booking...
                  </>
                ) : !slotAvailable ? (
                  "Time Slot Not Available"
                ) : (
                  "Book Now"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-8 text-destructive">Error: {error}</div>
            ) : myBookings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No bookings yet</div>
            ) : (
              <div className="space-y-3">
                {myBookings.map((booking) => (
                  <div key={booking._id} className="p-4 border rounded-lg flex items-center justify-between hover:bg-secondary/50 transition-colors">
                    <div>
                      <p className="font-semibold text-foreground">
                        {activeTab === "washing" ? "Machine" : "Dryer"} {booking.machineNumber}
                        {booking.cycleType && <span className="text-sm text-muted-foreground ml-2">({booking.cycleType})</span>}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(booking.scheduledDate).toLocaleDateString()} • {booking.timeSlot}
                      </p>
                    </div>
                    <Badge variant={
                      booking.status === "Completed" ? "success" :
                      booking.status === "In Progress" ? "warning" : "default"
                    }>
                      {booking.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function WashingPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="animate-spin w-8 h-8" /></div>}>
      <WashingContent />
    </Suspense>
  );
}
