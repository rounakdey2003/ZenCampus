"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import { 
  Search, 
  Package,
  Home,
  Bath,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Calendar,
  User,
  Filter
} from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { toast } from "sonner";
import { getPriorityColor as getPriorityColorUtils } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface CleaningRequest {
  _id: string;
  type: "Room" | "Bathroom" | "Common Area";
  studentName: string;
  studentUSN: string;
  roomNumber: string;
  description: string;
  status: "Pending" | "Scheduled" | "In Progress" | "Completed";
  priority: "Normal" | "High" | "Urgent";
  submittedAt: string;
  scheduledDate?: string;
  assignedTo?: string;
}

interface RoomComplaint {
  _id: string;
  type: string;
  title: string;
  description: string;
  studentName: string;
  studentUSN: string;
  roomNumber: string;
  status: string;
  priority: string;
  submittedAt: string;
}

export default function CleaningManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterType, setFilterType] = useState<string>("All");
  const [selectedRequest, setSelectedRequest] = useState<CleaningRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [assignedStaff, setAssignedStaff] = useState("");

  const { data: cleaningData, loading: cleaningLoading, error: cleaningError, refetch: refetchCleaning, put: putCleaning } = useApi<CleaningRequest[]>("/api/cleaning");
  const { data: roomData, loading: roomLoading, error: roomError, refetch: refetchRoom, put: putRoom } = useApi<RoomComplaint[]>("/api/maintenance");

  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchQuery) params.search = searchQuery;
    if (filterStatus !== "All") params.status = filterStatus;
    if (filterType !== "All") params.type = filterType;
    refetchCleaning(params);
    refetchRoom({ ...params, type: "room" }); // Fetch room complaints from maintenance API
  }, [searchQuery, filterStatus, filterType, refetchCleaning, refetchRoom]);

  // Combine bathroom cleaning requests and room complaints
  const allRequests: CleaningRequest[] = [
    ...(cleaningData || []),
    ...((roomData || []).map(r => ({
      _id: r._id,
      type: "Room" as const,
      studentName: r.studentName,
      studentUSN: r.studentUSN,
      roomNumber: r.roomNumber,
      description: r.description,
      status: r.status as any,
      priority: r.priority as any,
      submittedAt: r.submittedAt,
    })))
  ];

  const filteredRequests = allRequests.filter(req => {
    if (filterStatus !== "All" && req.status !== filterStatus) return false;
    if (filterType !== "All" && req.type !== filterType) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        req.studentName?.toLowerCase().includes(query) ||
        req.roomNumber?.toLowerCase().includes(query) ||
        req.studentUSN?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const loading = cleaningLoading || roomLoading;
  const error = cleaningError || roomError;

  const stats = {
    total: filteredRequests.length,
    pending: filteredRequests.filter((r) => r.status === "Pending").length,
    scheduled: filteredRequests.filter((r) => r.status === "Scheduled").length,
    inProgress: filteredRequests.filter((r) => r.status === "In Progress").length,
    completed: filteredRequests.filter((r) => r.status === "Completed").length,
  };

  const updateStatus = async (id: string, newStatus: CleaningRequest["status"]) => {
    try {
      const request = filteredRequests.find(r => r._id === id);
      if (!request) return;
      
      // Update in the appropriate API based on type
      if (request.type === "Room") {
        await putRoom(id, { status: newStatus });
      } else {
        await putCleaning(id, { status: newStatus });
      }
      
      toast.success("Status updated successfully!");
      refetchCleaning();
      refetchRoom({ type: "room" });
      setShowDetailsModal(false);
    } catch (err) {
      toast.error("Failed to update: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const scheduleRequest = async () => {
    if (selectedRequest && scheduleDate && assignedStaff) {
      try {
        // Update in the appropriate API based on type
        if (selectedRequest.type === "Room") {
          await putRoom(selectedRequest._id, { 
            status: "Scheduled" as any,
            scheduledDate: scheduleDate, 
            assignedTo: assignedStaff 
          });
        } else {
          await putCleaning(selectedRequest._id, { 
            status: "Scheduled", 
            scheduledDate: scheduleDate, 
            assignedTo: assignedStaff 
          });
        }
        
        toast.success("Request scheduled successfully!");
        refetchCleaning();
        refetchRoom({ type: "room" });
        setShowScheduleModal(false);
        setScheduleDate("");
        setAssignedStaff("");
      } catch (err) {
        toast.error("Failed to schedule: " + (err instanceof Error ? err.message : "Unknown error"));
      }
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Room": return <Home className="w-5 h-5 text-primary" />;
      case "Bathroom": return <Bath className="w-5 h-5 text-purple-500" />;
      default: return <Package className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    return getPriorityColorUtils(priority.toLowerCase());
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Cleaning Management</h1>
        <p className="text-muted-foreground text-lg">Manage room and bathroom cleaning requests efficiently.</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Requests", value: stats.total, icon: Package, color: "text-foreground", bg: "bg-secondary/50" },
          { label: "Pending", value: stats.pending, icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
          { label: "Scheduled", value: stats.scheduled, icon: Calendar, color: "text-blue-600", bg: "bg-blue-500/10" },
          { label: "In Progress", value: stats.inProgress, icon: Clock, color: "text-warning", bg: "bg-warning/10" },
          { label: "Completed", value: stats.completed, icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
        ].map((stat, index) => (
          <Card key={index} className="border-none shadow-soft hover:shadow-medium transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <h3 className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants}>
        <Card className="border-none shadow-soft">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 relative w-full">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by ID, student name, or room..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base bg-secondary/30 border-transparent focus:bg-background transition-colors"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative">
                  <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-10 pr-8 py-3 h-12 border-none rounded-xl bg-secondary/30 focus:ring-2 focus:ring-primary w-full sm:w-48 appearance-none cursor-pointer font-medium text-sm"
                  >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div className="relative">
                  <Home className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="pl-10 pr-8 py-3 h-12 border-none rounded-xl bg-secondary/30 focus:ring-2 focus:ring-primary w-full sm:w-48 appearance-none cursor-pointer font-medium text-sm"
                  >
                    <option value="All">All Types</option>
                    <option value="Room">Room</option>
                    <option value="Bathroom">Bathroom</option>
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Requests Table */}
      <motion.div variants={itemVariants}>
        <Card className="border-none shadow-medium overflow-hidden">
          <CardHeader className="bg-secondary/30 border-b border-border/50">
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Cleaning Requests 
              <Badge variant="secondary" className="ml-2 rounded-full px-3">{filteredRequests.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
                </div>
                <span className="text-muted-foreground font-medium animate-pulse">Loading requests...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-16 text-destructive space-y-2">
                <AlertTriangle className="w-10 h-10" />
                <span className="font-medium">Error: {error}</span>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-4">
                <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center">
                  <Search className="w-8 h-8 opacity-50" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium text-foreground">No requests found</p>
                  <p className="text-sm mt-1">{searchQuery ? "Try adjusting your search filters." : "There are no cleaning requests at the moment."}</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                <AnimatePresence>
                  {filteredRequests.map((request) => (
                    <motion.div 
                      key={request._id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-6 hover:bg-secondary/20 transition-colors group"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex gap-5 flex-1">
                          <div className="mt-1 p-3 rounded-xl bg-secondary/30 h-fit group-hover:scale-110 transition-transform duration-300">
                            {getTypeIcon(request.type)}
                          </div>
                          <div className="flex-1 space-y-3">
                            <div className="flex flex-wrap items-center gap-3">
                              <h4 className="font-bold text-lg text-foreground">{request.type} Cleaning</h4>
                              <Badge className={`${getPriorityBadgeColor(request.priority)} shadow-sm`}>
                                {request.priority}
                              </Badge>
                              <Badge variant="outline" className={`
                                ${request.status === "Completed" ? "border-success text-success bg-success/5" : 
                                  request.status === "In Progress" ? "border-warning text-warning bg-warning/5" : 
                                  request.status === "Scheduled" ? "border-blue-500 text-blue-600 bg-blue-50" : 
                                  "border-destructive text-destructive bg-destructive/5"}
                                font-medium
                              `}>
                                {request.status}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">{request.description}</p>
                            
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Home className="w-4 h-4" />
                                <span className="font-medium text-foreground/80">{request.roomNumber}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>{request.studentName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{new Date(request.submittedAt).toLocaleDateString()}</span>
                              </div>
                              {request.scheduledDate && (
                                <div className="flex items-center gap-2 text-blue-600 font-medium">
                                  <Calendar className="w-4 h-4" />
                                  <span>Scheduled: {new Date(request.scheduledDate).toLocaleDateString()}</span>
                                </div>
                              )}
                              {request.assignedTo && (
                                <div className="flex items-center gap-2 text-success font-medium">
                                  <User className="w-4 h-4" />
                                  <span>Assigned: {request.assignedTo}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto self-start md:self-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowDetailsModal(true);
                            }}
                            className="flex-1 md:flex-none"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          {request.status === "Pending" && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowScheduleModal(true);
                              }}
                              className="flex-1 md:flex-none shadow-sm"
                            >
                              <Calendar className="w-4 h-4 mr-2" />
                              Schedule
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Details Modal */}
      <Modal 
        isOpen={showDetailsModal} 
        onClose={() => setShowDetailsModal(false)}
        className="max-w-2xl"
      >
        {selectedRequest && (
          <>
            <ModalHeader onClose={() => setShowDetailsModal(false)}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  {getTypeIcon(selectedRequest.type)}
                </div>
                <span className="text-xl font-bold">{selectedRequest.type} Cleaning Request</span>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6 p-4 bg-secondary/20 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Current Status</p>
                    <Badge variant="outline" className={`text-base py-1 px-3
                      ${selectedRequest.status === "Completed" ? "border-success text-success bg-success/5" : 
                        selectedRequest.status === "In Progress" ? "border-warning text-warning bg-warning/5" : 
                        selectedRequest.status === "Scheduled" ? "border-blue-500 text-blue-600 bg-blue-50" : 
                        "border-destructive text-destructive bg-destructive/5"}
                    `}>
                      {selectedRequest.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Priority Level</p>
                    <Badge className={`${getPriorityBadgeColor(selectedRequest.priority)} text-base py-1 px-3`}>
                      {selectedRequest.priority}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Request Details</h4>
                  <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Room Number</p>
                        <p className="font-semibold text-lg">{selectedRequest.roomNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Submitted At</p>
                        <p className="font-medium">{new Date(selectedRequest.submittedAt).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Student Name</p>
                        <p className="font-medium">{selectedRequest.studentName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Student USN</p>
                        <p className="font-medium">{selectedRequest.studentUSN}</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-border/50">
                      <p className="text-sm text-muted-foreground mb-1">Description</p>
                      <p className="text-foreground leading-relaxed">{selectedRequest.description}</p>
                    </div>
                  </div>
                </div>

                {(selectedRequest.scheduledDate || selectedRequest.assignedTo) && (
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Schedule Information</h4>
                    <div className="bg-blue-50/50 border border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30 rounded-xl p-5">
                      <div className="grid grid-cols-2 gap-4">
                        {selectedRequest.scheduledDate && (
                          <div>
                            <p className="text-sm text-blue-600/80 dark:text-blue-400 mb-1">Scheduled Date</p>
                            <div className="flex items-center gap-2 font-semibold text-blue-700 dark:text-blue-300">
                              <Calendar className="w-4 h-4" />
                              {selectedRequest.scheduledDate}
                            </div>
                          </div>
                        )}
                        {selectedRequest.assignedTo && (
                          <div>
                            <p className="text-sm text-blue-600/80 dark:text-blue-400 mb-1">Assigned Staff</p>
                            <div className="flex items-center gap-2 font-semibold text-blue-700 dark:text-blue-300">
                              <User className="w-4 h-4" />
                              {selectedRequest.assignedTo}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
               {selectedRequest.status !== "Completed" && (
                  <div className="flex gap-3 w-full justify-end">
                    {selectedRequest.status === "Scheduled" && (
                      <Button onClick={() => updateStatus(selectedRequest._id, "In Progress")} className="bg-warning hover:bg-warning/90 text-warning-foreground">
                        <Clock className="w-4 h-4 mr-2" />
                        Start Cleaning
                      </Button>
                    )}
                    {selectedRequest.status === "In Progress" && (
                      <Button onClick={() => updateStatus(selectedRequest._id, "Completed")} className="bg-success hover:bg-success/90 text-success-foreground">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark Completed
                      </Button>
                    )}
                  </div>
               )}
               <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </Modal>

      {/* Schedule Modal */}
      <Modal 
        isOpen={showScheduleModal} 
        onClose={() => setShowScheduleModal(false)}
        className="max-w-md"
      >
        <ModalHeader onClose={() => setShowScheduleModal(false)}>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span>Schedule Cleaning</span>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <div className="bg-secondary/30 p-4 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-muted-foreground">Request Type</span>
                <span className="font-semibold">{selectedRequest?.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Room</span>
                <span className="font-semibold">{selectedRequest?.roomNumber}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Schedule Date</label>
                <Input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Assign Staff</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <select
                    value={assignedStaff}
                    onChange={(e) => setAssignedStaff(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background appearance-none"
                  >
                    <option value="">Select staff member</option>
                    <option value="Cleaning Staff A">Cleaning Staff A</option>
                    <option value="Cleaning Staff B">Cleaning Staff B</option>
                    <option value="Cleaning Staff C">Cleaning Staff C</option>
                    <option value="Cleaning Staff D">Cleaning Staff D</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => {
            setShowScheduleModal(false);
            setScheduleDate("");
            setAssignedStaff("");
          }}>
            Cancel
          </Button>
          <Button onClick={scheduleRequest} disabled={!scheduleDate || !assignedStaff} className="min-w-[120px]">
            Confirm Schedule
          </Button>
        </ModalFooter>
      </Modal>
    </motion.div>
  );
}
