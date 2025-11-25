"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Loader2 } from "lucide-react";
import { useApi } from "@/hooks/useApi";

export const dynamic = "force-dynamic";

interface Notice {
  _id: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  expiresAt: string;
}

export default function NoticePage() {
  const [filterCategory, setFilterCategory] = useState("All");

  const { data: notices, loading, error, refetch } = useApi<Notice[]>("/api/notices");

  useEffect(() => {
    const params: Record<string, string> = { status: "Active" };
    if (filterCategory !== "All") params.category = filterCategory;
    refetch(params);
  }, [filterCategory, refetch]);

  return (
    <div>
      <DashboardHeader title="Notices" />
      
      <div className="p-4 md:p-8 space-y-6">
        {/* Insights Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-1">Total Notices</p>
              <p className="text-2xl font-bold text-gray-900">{(notices || []).length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-1">Urgent</p>
              <p className="text-2xl font-bold text-red-600">
                {(notices || []).filter(n => n.priority === "High").length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-1">Expiring Soon</p>
              <p className="text-2xl font-bold text-amber-600">
                {(notices || []).filter(n => {
                  const daysLeft = Math.ceil((new Date(n.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  return daysLeft <= 3 && daysLeft > 0;
                }).length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-1">Categories</p>
              <p className="text-2xl font-bold text-blue-600">
                {new Set((notices || []).map(n => n.category)).size}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2 flex-wrap">
          {["All", "General", "Academic", "Event", "Urgent", "Maintenance"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium ${
                filterCategory === cat
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-6 h-6 text-primary" />
              Campus Notices
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">Error: {error}</div>
            ) : (notices || []).length === 0 ? (
              <div className="text-center py-8 text-gray-500">No notices available</div>
            ) : (
              <div className="space-y-4">
                {(notices || []).map((notice) => (
                  <div key={notice._id} className="p-4 md:p-6 border rounded-lg hover:bg-gray-50">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3 gap-3">
                      <h3 className="text-lg md:text-xl font-bold">{notice.title}</h3>
                      <div className="flex gap-2">
                        <Badge variant="outline">{notice.category}</Badge>
                        <Badge variant={
                          notice.priority === "High" ? "destructive" :
                          notice.priority === "Medium" ? "warning" : "default"
                        }>
                          {notice.priority}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{notice.content}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span>Posted: {new Date(notice.createdAt).toLocaleDateString()}</span>
                      <span>Expires: {new Date(notice.expiresAt).toLocaleDateString()}</span>
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
