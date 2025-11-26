"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Eye, Search, Loader2 } from "lucide-react";
import { useApi } from "@/hooks/useApi";

interface Complaint {
  _id: string;
  type: string;
  title?: string;
  description: string;
  roomNumber: string;
  studentName: string;
  studentUSN: string;
  isAnonymous: boolean;
  status: "Pending" | "In Progress" | "Completed";
  priority: string;
  submittedAt: string;
}

export default function ComplaintsManagementPage() {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);

  const { data: complaints, loading, error, refetch, put } = useApi<Complaint[]>("/api/maintenance");

  useEffect(() => {
    const params: Record<string, string> = { type: "warden" }; // Fetch only warden complaints
    if (searchQuery) params.search = searchQuery;
    if (statusFilter !== "all") params.status = statusFilter;
    refetch(params);
  }, [searchQuery, statusFilter, refetch]);

  const filteredComplaints = complaints || [];

  const handleUpdateStatus = async (complaintId: string, newStatus: string) => {
    try {
      await put(complaintId, { status: newStatus });
      toast.success(`Complaint status updated to ${newStatus}`);
      refetch();
      setShowModal(false);
    } catch (err) {
      toast.error("Failed to update status: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const stats = {
    total: filteredComplaints.length,
    pending: filteredComplaints.filter((c) => c.status === "Pending").length,
    inProgress: filteredComplaints.filter((c) => c.status === "In Progress").length,
    completed: filteredComplaints.filter((c) => c.status === "Completed").length,
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Warden Complaints Management</h1>
        <p className="text-gray-600 mt-1">View and manage student complaints to warden</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total Complaints</p>
            <p className="text-2xl font-bold">{loading ? "..." : stats.total}</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <p className="text-sm text-orange-700">Pending</p>
            <p className="text-2xl font-bold text-orange-600">{loading ? "..." : stats.pending}</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <p className="text-sm text-blue-700">In Progress</p>
            <p className="text-2xl font-bold text-blue-600">{loading ? "..." : stats.inProgress}</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <p className="text-sm text-green-700">Completed</p>
            <p className="text-2xl font-bold text-green-600">{loading ? "..." : stats.completed}</p>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      )}

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by type, room, or student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-auto"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Warden Complaints ({filteredComplaints.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-2">Loading complaints...</span>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No warden complaints found. {searchQuery && "Try adjusting your search."}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredComplaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm">{complaint.title || complaint.type}</h4>
                      {complaint.isAnonymous && (
                        <Badge variant="secondary" className="text-xs">Anonymous</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{complaint.description}</p>
                    <p className="text-sm text-gray-600">
                      Room: {complaint.roomNumber} • {complaint.isAnonymous ? "Anonymous Student" : `${complaint.studentName} (${complaint.studentUSN})`}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(complaint.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2 md:mt-0 md:ml-4">
                    <Badge
                      variant={
                        complaint.priority === "High" || complaint.priority === "Urgent"
                          ? "destructive"
                          : complaint.priority === "Medium"
                          ? "warning"
                          : "default"
                      }
                      className="text-xs"
                    >
                      {complaint.priority}
                    </Badge>
                    <Badge
                      variant={
                        complaint.status === "Completed"
                          ? "success"
                          : complaint.status === "In Progress"
                          ? "warning"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {complaint.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedComplaint(complaint);
                        setShowModal(true);
                      }}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Manage
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Manage Complaint</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Type</h4>
                  <p className="text-base">{selectedComplaint.type}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Priority</h4>
                  <Badge variant={selectedComplaint.priority === "High" || selectedComplaint.priority === "Urgent" ? "destructive" : "default"}>
                    {selectedComplaint.priority}
                  </Badge>
                </div>
              </div>
              {selectedComplaint.isAnonymous && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Anonymous Complaint</Badge>
                    <p className="text-sm text-gray-700">Student identity is protected. Only you can see this information.</p>
                  </div>
                </div>
              )}
              {selectedComplaint.title && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Title</h4>
                  <p className="text-base">{selectedComplaint.title}</p>
                </div>
              )}
              <div>
                <h4 className="font-semibold text-sm text-gray-600">Description</h4>
                <p className="text-base">{selectedComplaint.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Room</h4>
                  <p className="text-base">{selectedComplaint.roomNumber}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Student</h4>
                  {selectedComplaint.isAnonymous ? (
                    <div>
                      <p className="text-base text-gray-500">Anonymous Student</p>
                      <p className="text-sm text-gray-400">Identity hidden for privacy</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-base">{selectedComplaint.studentName}</p>
                      <p className="text-sm text-gray-600">{selectedComplaint.studentUSN}</p>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-600">Submitted On</h4>
                <p className="text-base">{new Date(selectedComplaint.submittedAt).toLocaleString()}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-600 mb-2">Update Status</h4>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={selectedComplaint.status === "Pending" ? "default" : "outline"}
                    onClick={() => handleUpdateStatus(selectedComplaint._id, "Pending")}
                  >
                    Pending
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedComplaint.status === "In Progress" ? "default" : "outline"}
                    onClick={() => handleUpdateStatus(selectedComplaint._id, "In Progress")}
                  >
                    In Progress
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedComplaint.status === "Completed" ? "default" : "outline"}
                    onClick={() => handleUpdateStatus(selectedComplaint._id, "Completed")}
                  >
                    Completed
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
