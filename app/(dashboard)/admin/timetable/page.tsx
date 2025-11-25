"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Calendar, Loader2 } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { toast } from "sonner";

interface TimetableEntry {
  _id: string;
  name: string;
  timing: string;
  type: string;
  day: string;
  isActive: boolean;
}

export default function AdminTimetablePage() {
  const { data: entries, loading, refetch, post, del } = useApi<TimetableEntry[]>("/api/timetable");
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    timing: "",
    type: "General",
    day: "All Days",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.timing) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await post({
        ...formData,
        isActive: true,
      });
      toast.success("Timetable entry added successfully!");
      setFormData({ name: "", timing: "", type: "General", day: "All Days" });
      setShowAddModal(false);
      refetch();
    } catch {
      toast.error("Failed to add entry");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      await del(id);
      toast.success("Entry deleted successfully!");
      refetch();
    } catch {
      toast.error("Failed to delete entry");
    }
  };

  return (
    <div>
      <DashboardHeader title="Timetable Management" />

      <div className="p-8 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-6 h-6 text-primary" />
                Manage Timetable Entries
              </CardTitle>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Entry
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : !entries || entries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No timetable entries yet. Add your first entry!
              </div>
            ) : (
              <div className="space-y-3">
                {entries.map((entry) => (
                  <div
                    key={entry._id}
                    className="p-4 border rounded-lg flex items-center justify-between hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-foreground">{entry.name}</h4>
                        <Badge variant="outline">{entry.type}</Badge>
                        {entry.day !== "All Days" && (
                          <Badge variant="secondary" className="text-xs">
                            {entry.day}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{entry.timing}</p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(entry._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Entry Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowAddModal(false)}
        >
          <Card className="w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>Add Timetable Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Breakfast Time"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timing">Timing</Label>
                  <Input
                    id="timing"
                    placeholder="e.g. 7:00 AM - 9:00 AM"
                    value={formData.timing}
                    onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <select
                    id="type"
                    className="w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="General">General</option>
                    <option value="Washing">Washing</option>
                    <option value="Dryer">Dryer</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="day">Day</Label>
                  <select
                    id="day"
                    className="w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                  >
                    <option value="All Days">All Days</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Entry</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
