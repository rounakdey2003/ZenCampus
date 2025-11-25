"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Zap, Hammer, Droplets, Loader2 } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";

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

function ElectricalContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "electrical";
  const { user } = useUser();
  
  const studentUSN = user?.usn || "";
  const studentName = user?.name || "";
  const [formData, setFormData] = useState({
    location: "",
    description: "",
  });

  const getMaintenanceType = useCallback(() => {
    if (activeTab === "electrical") return "Electrical";
    if (activeTab === "carpentry") return "Carpentry";
    return "Plumbing";
  }, [activeTab]);

  const { data: allRequests, loading, refetch, post } = useApi<Maintenance[]>("/api/maintenance");

  useEffect(() => {
    refetch({ type: getMaintenanceType(), usn: studentUSN });
  }, [getMaintenanceType, activeTab, refetch, studentUSN]);

  // API now returns user-specific data, only filter by type for safety
  const myRequests = (allRequests || []).filter(r => r.type === getMaintenanceType());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.location || !formData.description) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await post({
        studentUSN,
        studentName,
        roomNumber: formData.location,
        type: getMaintenanceType(),
        title: `${getMaintenanceType()} Issue`,
        description: formData.description,
        priority: "Medium",
        status: "Pending",
      });
      toast.success("Complaint submitted successfully!");
      setFormData({ location: "", description: "" });
      refetch({ type: getMaintenanceType(), usn: studentUSN });
    } catch (err) {
      toast.error("Failed to submit: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  return (
    <div>
      <DashboardHeader title="ZenMaintenance" />
      
      <div className="p-4 md:p-8 space-y-6">
        {/* Tab Navigation */}
        <div className="flex gap-2 md:gap-4 border-b pb-2 overflow-x-auto">
          <Link href="/maintenance?tab=electrical" className={`px-3 md:px-4 py-2 font-medium cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === "electrical" 
              ? "text-primary border-b-2 border-primary" 
              : "text-gray-600 hover:text-gray-900"
          }`}>
            <Zap className="w-4 h-4 inline mr-2" />
            Electrical
          </Link>
          <Link href="/maintenance?tab=carpentry" className={`px-3 md:px-4 py-2 font-medium cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === "carpentry" 
              ? "text-primary border-b-2 border-primary" 
              : "text-gray-600 hover:text-gray-900"
          }`}>
            <Hammer className="w-4 h-4 inline mr-2" />
            Carpentry
          </Link>
          <Link href="/maintenance?tab=plumbing" className={`px-3 md:px-4 py-2 font-medium cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === "plumbing" 
              ? "text-primary border-b-2 border-primary" 
              : "text-gray-600 hover:text-gray-900"
          }`}>
            <Droplets className="w-4 h-4 inline mr-2" />
            Plumbing
          </Link>
        </div>

        {/* Insights Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-1">My Complaints</p>
              <p className="text-2xl font-bold text-gray-900">{myRequests.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-2xl font-bold text-amber-600">
                {myRequests.filter(r => r.status === "Pending").length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-1">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">
                {myRequests.filter(r => r.status === "In Progress").length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {myRequests.filter(r => r.status === "Completed").length}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {activeTab === "electrical" && <><Zap className="w-6 h-6 text-primary" /> Report Electrical Issue</>}
              {activeTab === "carpentry" && <><Hammer className="w-6 h-6 text-primary" /> Report Carpentry Issue</>}
              {activeTab === "plumbing" && <><Droplets className="w-6 h-6 text-primary" /> Report Plumbing Issue</>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="room">
                  {activeTab === "plumbing" ? "Location (Room/Area)" : "Location (Room Number)"}
                </Label>
                <Input
                  id="room"
                  placeholder={
                    activeTab === "electrical" ? "e.g. A-101" :
                    activeTab === "carpentry" ? "e.g. C-303" :
                    "e.g. B-202"
                  }
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="issue">Issue Description</Label>
                <textarea
                  id="issue"
                  className="flex min-h-[120px] w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base transition-all placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10"
                  placeholder={
                    activeTab === "electrical" ? "Describe the electrical issue in detail..." :
                    activeTab === "carpentry" ? "Describe the carpentry issue in detail..." :
                    "Describe the plumbing issue in detail..."
                  }
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">Submit Complaint</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Complaint History</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : !myRequests || myRequests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No complaints yet
              </div>
            ) : (
              <div className="space-y-3">
                {myRequests.map((request) => (
                  <div key={request._id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2 gap-3">
                      <div className="flex-1">
                        <h4 className="font-semibold">{request.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-2">
                          <span>Room: {request.roomNumber}</span>
                          <span>•</span>
                          <span>{new Date(request.submittedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={
                          request.priority === "High" || request.priority === "Urgent" 
                            ? "destructive" 
                            : request.priority === "Medium" 
                            ? "secondary" 
                            : "outline"
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ElectricalPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="animate-spin w-8 h-8" /></div>}>
      <ElectricalContent />
    </Suspense>
  );
}
