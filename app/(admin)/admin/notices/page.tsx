"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { toast } from "sonner";

interface Notice {
  _id: string;
  title: string;
  content: string;
  category: "General" | "Academic" | "Event" | "Urgent" | "Maintenance";
  priority: "Low" | "Medium" | "High";
  status: "Active" | "Archived";
  createdBy: string;
  createdAt: string;
  expiresAt: string;
  views?: number;
}

export default function NoticesManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("Active");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "General",
    priority: "Medium",
    expiresAt: "",
  });

  const { data: notices, loading, error, refetch, post, put, del } = useApi<Notice[]>("/api/notices");

  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchQuery) params.search = searchQuery;
    if (filterCategory !== "All") params.category = filterCategory;
    if (filterStatus !== "All") params.status = filterStatus;
    refetch(params);
  }, [searchQuery, filterCategory, filterStatus, refetch]);

  const filteredNotices = notices || [];

  const handleAddNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await post({ ...formData, createdBy: "Admin", status: "Active" });
      toast.success("Notice added successfully!");
      refetch();
      setShowAddModal(false);
      setFormData({ title: "", content: "", category: "General", priority: "Medium", expiresAt: "" });
    } catch (err) {
      toast.error("Failed to add notice: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const handleEditNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNotice) return;
    try {
      await put(selectedNotice._id, formData);
      toast.success("Notice updated successfully!");
      refetch();
      setShowEditModal(false);
      setSelectedNotice(null);
    } catch (err) {
      toast.error("Failed to update notice: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const handleDeleteNotice = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notice?")) return;
    try {
      await del(id);
      toast.success("Notice deleted successfully!");
      refetch();
    } catch (err) {
      toast.error("Failed to delete notice: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const handleArchiveNotice = async (id: string, archive: boolean) => {
    try {
      await put(id, { status: archive ? "Archived" : "Active" });
      toast.success(archive ? "Notice archived!" : "Notice activated!");
      refetch();
    } catch (err) {
      toast.error("Failed to update notice: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const stats = {
    total: filteredNotices.length,
    active: filteredNotices.filter(n => n.status === "Active").length,
    urgent: filteredNotices.filter(n => n.priority === "High" && n.status === "Active").length,
    archived: filteredNotices.filter(n => n.status === "Archived").length,
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Notices Management</h1>
          <p className="text-gray-600 mt-1">Create and manage campus notices</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="w-full md:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Notice
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total Notices</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Active Notices</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Urgent Notices</p>
            <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Archived</p>
            <p className="text-2xl font-bold text-gray-600">{stats.archived}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search notices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border rounded-lg w-full sm:w-auto"
              >
                <option value="All">All Categories</option>
                <option value="General">General</option>
                <option value="Academic">Academic</option>
                <option value="Event">Event</option>
                <option value="Urgent">Urgent</option>
                <option value="Maintenance">Maintenance</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border rounded-lg w-full sm:w-auto"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Notices ({filteredNotices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-2">Loading notices...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">Error: {error}</div>
          ) : filteredNotices.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No notices found.</div>
          ) : (
            <div className="space-y-3">
              {filteredNotices.map((notice) => (
                <div key={notice._id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-semibold">{notice.title}</h4>
                        <Badge variant="outline" className="text-xs">{notice.category}</Badge>
                        <Badge variant={
                          notice.priority === "High" ? "destructive" :
                          notice.priority === "Medium" ? "warning" : "default"
                        } className="text-xs">
                          {notice.priority}
                        </Badge>
                        <Badge variant={notice.status === "Active" ? "success" : "secondary"} className="text-xs">
                          {notice.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notice.content}</p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        <span>Created: {new Date(notice.createdAt).toLocaleDateString()}</span>
                        <span>Expires: {new Date(notice.expiresAt).toLocaleDateString()}</span>
                        {notice.views !== undefined && <span>Views: {notice.views}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedNotice(notice);
                          setFormData({
                            title: notice.title,
                            content: notice.content,
                            category: notice.category,
                            priority: notice.priority,
                            expiresAt: notice.expiresAt.split('T')[0],
                          });
                          setShowEditModal(true);
                        }}
                        className="flex-1 md:flex-none"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleArchiveNotice(notice._id, notice.status === "Active")}
                        className="flex-1 md:flex-none"
                      >
                        {notice.status === "Active" ? "Archive" : "Activate"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteNotice(notice._id)}
                        className="flex-1 md:flex-none"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">Add Notice</h2>
            <form onSubmit={handleAddNotice} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={4}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value as any})} className="w-full px-3 py-2 border rounded-lg">
                    <option value="General">General</option>
                    <option value="Academic">Academic</option>
                    <option value="Event">Event</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value as any})} className="w-full px-3 py-2 border rounded-lg">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Expires At</label>
                <Input type="date" value={formData.expiresAt} onChange={(e) => setFormData({...formData, expiresAt: e.target.value})} required />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button type="submit">Add Notice</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && selectedNotice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">Edit Notice</h2>
            <form onSubmit={handleEditNotice} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={4}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value as any})} className="w-full px-3 py-2 border rounded-lg">
                    <option value="General">General</option>
                    <option value="Academic">Academic</option>
                    <option value="Event">Event</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value as any})} className="w-full px-3 py-2 border rounded-lg">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Expires At</label>
                <Input type="date" value={formData.expiresAt} onChange={(e) => setFormData({...formData, expiresAt: e.target.value})} required />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
                <Button type="submit">Update Notice</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
