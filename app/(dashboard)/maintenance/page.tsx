"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Badge } from "@/components/ui";
import { Zap, Hammer, Droplets, Loader2, Upload, X, ImageIcon } from "lucide-react";
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
  photoUrl?: string;
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
    priority: "Medium",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const getMaintenanceType = useCallback(() => {
    if (activeTab === "electrical") return "Electrical";
    if (activeTab === "carpentry") return "Carpentry";
    return "Plumbing";
  }, [activeTab]);

  const { data: allRequests, loading, refetch, post } = useApi<Maintenance[]>("/api/maintenance");

  useEffect(() => {
    refetch({ type: getMaintenanceType(), usn: studentUSN });
  }, [getMaintenanceType, activeTab, refetch, studentUSN]);

  const myRequests = (allRequests || []).filter(r => r.type === getMaintenanceType());

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.");
        return;
      }      
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large. Maximum size is 5MB.");
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.location || !formData.description) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setUploading(true);
      let photoUrl: string | undefined;
      
      if (photoFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", photoFile);

        const uploadRes = await fetch("/api/maintenance/upload", {
          method: "POST",
          body: uploadFormData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadData.success) {
          throw new Error(uploadData.error || "Failed to upload photo");
        }
        photoUrl = uploadData.url;
      }

      await post({
        studentUSN,
        studentName,
        roomNumber: formData.location,
        type: getMaintenanceType(),
        title: `${getMaintenanceType()} Issue`,
        description: formData.description,
        priority: formData.priority,
        status: "Pending",
        photoUrl,
      });
      toast.success("Complaint submitted successfully!");
      setFormData({ location: "", description: "", priority: "Medium" });
      removePhoto();
      refetch({ type: getMaintenanceType(), usn: studentUSN });
    } catch (err) {
      toast.error("Failed to submit: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <DashboardHeader title="ZenMaintenance" />
      
      <div className="p-4 md:p-8 space-y-6">        
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
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="photo">Photo Proof (Optional)</Label>
                {photoPreview ? (
                  <div className="relative inline-block">
                    <Image
                      src={photoPreview}
                      alt="Preview"
                      width={200}
                      height={200}
                      className="rounded-lg object-cover border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <label
                      htmlFor="photo"
                      className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      <Upload className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-600">Upload Photo</span>
                      <input
                        type="file"
                        id="photo"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                    <span className="text-sm text-gray-500">Max 5MB (JPEG, PNG, GIF, WebP)</span>
                  </div>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={uploading}>
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Complaint"
                )}
              </Button>
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
                        {request.photoUrl && (
                          <div className="mt-3">
                            <a href={request.photoUrl} target="_blank" rel="noopener noreferrer">
                              <Image
                                src={request.photoUrl}
                                alt="Issue photo"
                                width={100}
                                height={100}
                                className="rounded-lg object-cover border border-gray-200 hover:opacity-80 transition-opacity"
                              />
                            </a>
                          </div>
                        )}
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
