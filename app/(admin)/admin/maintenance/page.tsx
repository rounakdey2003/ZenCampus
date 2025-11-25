"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  Wrench,
  Zap,
  Droplet,
  Hammer,
  Loader2,
} from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { toast } from "sonner";

interface MaintenanceRequest {
  _id: string;
  type: "Electrical" | "Plumbing" | "Carpentry" | "room" | "warden" | "General";
  title: string;
  description: string;
  studentName: string;
  studentUSN: string;
  roomNumber: string;
  status: "Pending" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High" | "Urgent";
  submittedAt: string;
  assignedTo?: string;
}

export default function MaintenanceManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterType, setFilterType] = useState<string>("All");
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignedPerson, setAssignedPerson] = useState("");

  const { data: requests, loading, error, refetch, put } = useApi<MaintenanceRequest[]>("/api/maintenance");

  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchQuery) params.search = searchQuery;
    if (filterStatus !== "All") params.status = filterStatus;
    if (filterType !== "All") params.type = filterType;
    refetch(params);
  }, [searchQuery, filterStatus, filterType, refetch]);

  // Filter out only "General" and "warden" types - include room, electrical, plumbing, carpentry
  const filteredRequests = (requests || []).filter(r => r.type !== "General" && r.type !== "warden" && r.type !== "room");

  const stats = {
    total: filteredRequests.length,
    pending: filteredRequests.filter((r) => r.status === "Pending").length,
    inProgress: filteredRequests.filter((r) => r.status === "In Progress").length,
    completed: filteredRequests.filter((r) => r.status === "Completed").length,
  };

  const updateStatus = async (id: string, newStatus: "Pending" | "In Progress" | "Completed") => {
    try {
      await put(id, { status: newStatus });
      toast.success("Status updated successfully!");
      refetch();
      setShowDetailsModal(false);
    } catch (err) {
      toast.error("Failed to update: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const assignRequest = async () => {
    if (selectedRequest && assignedPerson) {
      try {
        await put(selectedRequest._id, { assignedTo: assignedPerson, status: "In Progress" });
        toast.success("Request assigned successfully!");
        refetch();
        setShowAssignModal(false);
        setAssignedPerson("");
      } catch (err) {
        toast.error("Failed to assign: " + (err instanceof Error ? err.message : "Unknown error"));
      }
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Electrical": return <Zap className="w-5 h-5 text-yellow-500" />;
      case "Plumbing": return <Droplet className="w-5 h-5 text-blue-500" />;
      case "Carpentry": return <Hammer className="w-5 h-5 text-orange-500" />;
      default: return <Wrench className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent": return "bg-red-500/10 text-red-600 border-red-500/20";
      case "High": return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case "Medium": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "Low": return "bg-green-500/10 text-green-600 border-green-500/20";
      default: return "bg-secondary text-secondary-foreground border-secondary";
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Maintenance Management</h1>
        <p className="text-gray-600 mt-1">Manage and track all maintenance requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Requests</p>
                <h3 className="text-2xl font-bold text-foreground">{stats.total}</h3>
              </div>
              <Wrench className="w-8 h-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <h3 className="text-2xl font-bold text-orange-600">{stats.pending}</h3>
              </div>
              <Clock className="w-8 h-8 text-orange-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <h3 className="text-2xl font-bold text-blue-600">{stats.inProgress}</h3>
              </div>
              <AlertTriangle className="w-8 h-8 text-blue-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <h3 className="text-2xl font-bold text-green-600">{stats.completed}</h3>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by ID, title, room, or student name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background w-full sm:w-auto"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background w-full sm:w-auto"
              >
                <option value="All">All Types</option>
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Carpentry">Carpentry</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Requests ({filteredRequests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-2">Loading requests...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              Error: {error}
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No maintenance requests found. {searchQuery && "Try adjusting your search."}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredRequests.map((request) => (
                <div key={request._id} className="p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex gap-4 flex-1">
                      <div className="mt-1 shrink-0">
                        {getTypeIcon(request.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="font-semibold">{request.title}</h4>
                          <Badge className={getPriorityColor(request.priority)}>
                            {request.priority}
                          </Badge>
                          <Badge variant={request.status === "Completed" ? "default" : request.status === "In Progress" ? "secondary" : "outline"}>
                            {request.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{request.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span>Type: {request.type}</span>
                          <span>Room: {request.roomNumber}</span>
                          <span>Student: {request.studentName}</span>
                          <span>Submitted: {new Date(request.submittedAt).toLocaleDateString()} {new Date(request.submittedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          {request.assignedTo && <span className="text-primary">Assigned to: {request.assignedTo}</span>}
                        </div>
                      </div>
                    </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowDetailsModal(true);
                      }}
                      className="flex-1 md:flex-none"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    {request.status === "Pending" && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowAssignModal(true);
                        }}
                        className="flex-1 md:flex-none"
                      >
                        Assign
                      </Button>
                    )}
                  </div>
                </div>
                </div>
              ))}
          </div>
          )}
        </CardContent>
      </Card>

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Request Details</h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {getTypeIcon(selectedRequest.type)}
                <div>
                  <h3 className="font-semibold text-lg">{selectedRequest.title}</h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium">{selectedRequest.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Priority</p>
                  <Badge className={getPriorityColor(selectedRequest.priority)}>
                    {selectedRequest.priority}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={selectedRequest.status === "Completed" ? "default" : selectedRequest.status === "In Progress" ? "secondary" : "outline"}>
                    {selectedRequest.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submitted</p>
                  <p className="font-medium text-sm">{new Date(selectedRequest.submittedAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-foreground">{selectedRequest.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Student Name</p>
                  <p className="font-medium">{selectedRequest.studentName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">USN</p>
                  <p className="font-medium">{selectedRequest.studentUSN}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Room Number</p>
                  <p className="font-medium">{selectedRequest.roomNumber}</p>
                </div>
                {selectedRequest.assignedTo && (
                  <div>
                    <p className="text-sm text-muted-foreground">Assigned To</p>
                    <p className="font-medium text-primary">{selectedRequest.assignedTo}</p>
                  </div>
                )}
              </div>

              {selectedRequest.status !== "Completed" && (
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3">Update Status</h4>
                  <div className="flex gap-2">
                    {selectedRequest.status === "Pending" && (
                      <Button onClick={() => updateStatus(selectedRequest._id, "In Progress")}>
                        Mark In Progress
                      </Button>
                    )}
                    {selectedRequest.status === "In Progress" && (
                      <Button onClick={() => updateStatus(selectedRequest._id, "Completed")} variant="default">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark Completed
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Assign Request</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Request: {selectedRequest.title}</p>
                <p className="text-sm text-gray-600">Type: {selectedRequest.type}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Assign To</label>
                <Input
                  placeholder="Enter technician/staff name"
                  value={assignedPerson}
                  onChange={(e) => setAssignedPerson(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => {
                setShowAssignModal(false);
                setAssignedPerson("");
              }}>
                Cancel
              </Button>
              <Button onClick={assignRequest} disabled={!assignedPerson}>
                Assign Request
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
