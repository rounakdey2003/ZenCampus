"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Home, Bath, Loader2 } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";

interface Maintenance {
  _id: string;
  type: string;
  title: string;
  description: string;
  roomNumber: string;
  status: string;
  priority: string;
  submittedAt: string;
}

interface Maintenance {
  _id: string;
  type: string;
  title: string;
  description: string;
  roomNumber: string;
  studentUSN: string;
  status: string;
  priority: string;
  submittedAt: string;
}

interface CleaningRequest {
  _id: string;
  type: string;
  description: string;
  roomNumber: string;
  studentUSN: string;
  status: string;
  priority: string;
  submittedAt: string;
}



function RoomContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "room";
  const { user } = useUser();
  
  const studentUSN = user?.usn || "";
  const studentName = user?.name || "";
  const [formData, setFormData] = useState({
    location: "",
    description: "",
    priority: "Normal",
  });

  const { data: roomComplaints, loading: roomLoading, refetch: refetchRoom, post: postRoom } = useApi<Maintenance[]>("/api/maintenance");
  const { data: cleaningRequests, loading: cleaningLoading, refetch: refetchCleaning, post: postCleaning } = useApi<CleaningRequest[]>("/api/cleaning");

  useEffect(() => {
    if (activeTab === "room") {
      refetchRoom({ type: "room", usn: studentUSN });
    } else {
      refetchCleaning({ type: "Bathroom", usn: studentUSN });
    }
  }, [activeTab, refetchRoom, refetchCleaning, studentUSN]);

  // APIs now return user-specific data, only filter by type for safety
  const myRoomComplaints = (roomComplaints || []).filter(r => r.type === "room");
  const myCleaningRequests = (cleaningRequests || []).filter(r => r.type === "Bathroom");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.location || !formData.description) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      if (activeTab === "room") {
        await postRoom({
          studentUSN,
          studentName,
          roomNumber: formData.location,
          type: "room",
          title: "Room Issue",
          description: formData.description,
          priority: formData.priority,
          status: "Pending",
        });
        refetchRoom({ type: "room", usn: studentUSN });
      } else {
        await postCleaning({
          studentUSN,
          studentName,
          roomNumber: formData.location,
          type: "Bathroom",
          description: formData.description,
          priority: formData.priority,
          status: "Pending",
        });
        refetchCleaning({ type: "Bathroom", usn: studentUSN });
      }
      toast.success(activeTab === "room" ? "Complaint submitted successfully!" : "Request submitted successfully!");
      setFormData({ location: "", description: "", priority: "Normal" });
    } catch (err) {
      toast.error("Failed to submit: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  return (
    <div>
      <DashboardHeader title="ZenCleaning" />
      
      <div className="p-8 space-y-6">
        {/* Tab Navigation */}
        <div className="flex gap-4 border-b pb-2">
          <Link href="/room?tab=room" className={`px-4 py-2 font-medium cursor-pointer transition-colors ${
            activeTab === "room" 
              ? "text-primary border-b-2 border-primary" 
              : "text-gray-600 hover:text-gray-900"
          }`}>
            <Home className="w-4 h-4 inline mr-2" />
            Room
          </Link>
          <Link href="/room?tab=bathroom" className={`px-4 py-2 font-medium cursor-pointer transition-colors ${
            activeTab === "bathroom" 
              ? "text-primary border-b-2 border-primary" 
              : "text-gray-600 hover:text-gray-900"
          }`}>
            <Bath className="w-4 h-4 inline mr-2" />
            Bathroom
          </Link>
        </div>

        {/* Insights Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-1">Total {activeTab === "room" ? "Complaints" : "Requests"}</p>
              <p className="text-2xl font-bold text-gray-900">
                {activeTab === "room" ? myRoomComplaints.length : myCleaningRequests.length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-2xl font-bold text-amber-600">
                {activeTab === "room" 
                  ? myRoomComplaints.filter(r => r.status === "Pending").length
                  : myCleaningRequests.filter(r => r.status === "Pending").length
                }
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-1">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">
                {activeTab === "room" 
                  ? myRoomComplaints.filter(r => r.status === "In Progress").length
                  : myCleaningRequests.filter(r => r.status === "In Progress" || r.status === "Scheduled").length
                }
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {activeTab === "room" 
                  ? myRoomComplaints.filter(r => r.status === "Completed").length
                  : myCleaningRequests.filter(r => r.status === "Completed").length
                }
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {activeTab === "room" ? (
                <><Home className="w-6 h-6 text-primary" /> Report Room Issue</>
              ) : (
                <><Bath className="w-6 h-6 text-primary" /> Request Bathroom Cleaning</>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="room">
                  {activeTab === "room" ? "Room Number" : "Location (Room/Area)"}
                </Label>
                <Input
                  id="room"
                  placeholder={activeTab === "room" ? "e.g. D-404" : "e.g. E-505 Bathroom"}
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="issue">
                  {activeTab === "room" ? "Issue Description" : "Additional Details"}
                </Label>
                <textarea
                  id="issue"
                  className="flex min-h-[120px] w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base transition-all placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10"
                  placeholder={activeTab === "room" ? "Describe the room issue in detail..." : "Any specific cleaning requirements..."}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
              <Button type="submit" className="w-full">
                {activeTab === "room" ? "Submit Complaint" : "Submit Request"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{activeTab === "room" ? "My Complaint History" : "My Request History"}</CardTitle>
          </CardHeader>
          <CardContent>
            {(activeTab === "room" ? roomLoading : cleaningLoading) ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : activeTab === "room" ? (
              !myRoomComplaints || myRoomComplaints.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No complaints yet
                </div>
              ) : (
                <div className="space-y-3">
                  {myRoomComplaints.map((complaint) => (
                    <div key={complaint._id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex flex-col md:flex-row justify-between items-start mb-2 gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold">{complaint.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{complaint.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                            <span>Room: {complaint.roomNumber}</span>
                            <span>•</span>
                            <span>{new Date(complaint.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2 md:mt-0 md:ml-4">
                          <Badge variant={
                            complaint.priority === "High" ? "destructive" :
                            complaint.priority === "Medium" ? "secondary" :
                            "outline"
                          }>
                            {complaint.priority}
                          </Badge>
                          <Badge variant={
                            complaint.status === "Completed" 
                              ? "success" 
                              : complaint.status === "In Progress" 
                              ? "secondary" 
                              : "outline"
                          }>
                            {complaint.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              !myCleaningRequests || myCleaningRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No requests yet
                </div>
              ) : (
                <div className="space-y-3">
                  {myCleaningRequests.map((request) => (
                    <div key={request._id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex flex-col md:flex-row justify-between items-start mb-2 gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold">Bathroom Cleaning Request</h4>
                          <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                            <span>Room: {request.roomNumber}</span>
                            <span>•</span>
                            <span>{new Date(request.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2 md:mt-0 md:ml-4">
                          <Badge variant={
                            request.priority === "High" ? "destructive" :
                            request.priority === "Medium" ? "secondary" :
                            "outline"
                          }>
                            {request.priority}
                          </Badge>
                          <Badge variant={
                            request.status === "Completed" 
                              ? "success" 
                              : request.status === "In Progress" 
                              ? "secondary" 
                              : "outline"
                          }>
                            {request.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function RoomPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="animate-spin w-8 h-8" /></div>}>
      <RoomContent />
    </Suspense>
  );
}
