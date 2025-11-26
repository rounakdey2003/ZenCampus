"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Clock, Calendar } from "lucide-react";
import { useApi } from "@/hooks/useApi";

interface TimetableEntry {
  _id: string;
  name: string;
  timing: string;
  type: string;
  day: string;
  isActive: boolean;
}

interface TimetableDisplayProps {
  type: "Washing" | "Dryer";
}

export function TimetableDisplay({ type }: TimetableDisplayProps) {
  const { data: allEntries, loading } = useApi<TimetableEntry[]>("/api/timetable", { autoFetch: true });
  
  const entries = (allEntries || []).filter(
    (entry) => entry.isActive && (entry.type === type || entry.type === "General")
  );

  if (loading) {
    return null;
  }

  if (!entries || entries.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Schedule Timetable
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {entries.map((entry) => (
            <div
              key={entry._id}
              className="p-4 border rounded-lg hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{entry.name}</h4>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{entry.timing}</span>
                  </div>
                  {entry.day !== "All Days" && (
                    <div className="mt-1 text-xs text-primary">
                      {entry.day}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
