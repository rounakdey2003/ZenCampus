"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Plus, 
  Loader2, 
  Trash2,
  Eye,
  Lock,
  Unlock,
} from "lucide-react";
import { useApi } from "@/hooks/useApi";

interface Poll {
  _id: string;
  question: string;
  options: { text: string; votes: number }[];
  createdBy: string;
  createdByName: string;
  createdByRole: string;
  votedBy: { usn: string; optionIndex: number; votedAt: string }[];
  totalVotes: number;
  status: "Active" | "Closed";
  createdAt: string;
  expiresAt: string;
}

export default function PollsManagementPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [pollForm, setPollForm] = useState({
    question: "",
    options: ["", ""],
    expiresAt: "",
  });

  const { data: polls, loading, error, refetch, post, put, del } = useApi<Poll[]>("/api/forum/polls");

  useEffect(() => {
    refetch({});
  }, [refetch]);

  const handleCreatePoll = async () => {
    if (!pollForm.question || !pollForm.expiresAt || pollForm.options.some(opt => !opt.trim())) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await post({
        question: pollForm.question,
        options: pollForm.options.map(text => ({ text, votes: 0 })),
        createdBy: "ADMIN",
        createdByName: "Admin",
        createdByRole: "admin",
        expiresAt: new Date(pollForm.expiresAt).toISOString(),
        status: "Active",
        totalVotes: 0,
        votedBy: [],
      });
      
      toast.success("Poll created successfully!");
      setShowCreateModal(false);
      setPollForm({ question: "", options: ["", ""], expiresAt: "" });
      refetch({});
    } catch (err) {
      toast.error("Failed to create poll: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const handleToggleStatus = async (pollId: string, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "Closed" : "Active";
    try {
      await put(pollId, { status: newStatus });
      toast.success(`Poll ${newStatus.toLowerCase()} successfully!`);
      refetch({});
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDeletePoll = async (pollId: string) => {
    if (!confirm("Are you sure you want to delete this poll?")) return;
    
    try {
      await del(pollId);
      toast.success("Poll deleted successfully!");
      refetch({});
      if (showDetailsModal) setShowDetailsModal(false);
    } catch {
      toast.error("Failed to delete poll");
    }
  };

  const addOption = () => {
    setPollForm({ ...pollForm, options: [...pollForm.options, ""] });
  };

  const removeOption = (index: number) => {
    if (pollForm.options.length <= 2) {
      toast.error("Poll must have at least 2 options");
      return;
    }
    const newOptions = pollForm.options.filter((_, i) => i !== index);
    setPollForm({ ...pollForm, options: newOptions });
  };

  const stats = {
    total: polls?.length || 0,
    active: polls?.filter(p => p.status === "Active").length || 0,
    closed: polls?.filter(p => p.status === "Closed").length || 0,
    byStudents: polls?.filter(p => p.createdByRole === "student").length || 0,
    byAdmin: polls?.filter(p => p.createdByRole === "admin").length || 0,
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Polls Management</h1>
          <p className="text-gray-600 mt-1">Create and manage student polls</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Poll
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total Polls</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <p className="text-sm text-green-700">Active</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="p-4">
            <p className="text-sm text-gray-700">Closed</p>
            <p className="text-2xl font-bold text-gray-600">{stats.closed}</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <p className="text-sm text-blue-700">By Students</p>
            <p className="text-2xl font-bold text-blue-600">{stats.byStudents}</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <p className="text-sm text-purple-700">By Admin</p>
            <p className="text-2xl font-bold text-purple-600">{stats.byAdmin}</p>
          </CardContent>
        </Card>
      </div>

      {/* Polls List */}
      <Card>
        <CardHeader>
          <CardTitle>All Polls ({polls?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">Error: {error}</div>
          ) : !polls || polls.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg">No polls yet</p>
              <p className="text-sm mt-2">Create your first poll to engage students</p>
            </div>
          ) : (
            <div className="space-y-4">
              {polls.map((poll) => (
                <div key={poll._id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{poll.question}</h3>
                        <Badge variant={poll.status === "Active" ? "default" : "secondary"}>
                          {poll.status}
                        </Badge>
                        <Badge variant="outline">
                          {poll.createdByRole === "admin" ? "Admin" : "Student"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span>Created by: {poll.createdByName}</span>
                        <span>•</span>
                        <span>Total Votes: {poll.totalVotes}</span>
                        <span>•</span>
                        <span>Expires: {new Date(poll.expiresAt).toLocaleDateString()}</span>
                      </div>
                      <div className="space-y-2">
                        {poll.options.map((option, idx) => {
                          const percentage = poll.totalVotes > 0 
                            ? Math.round((option.votes / poll.totalVotes) * 100) 
                            : 0;
                          return (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="text-sm min-w-[200px]">{option.text}</span>
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full transition-all" 
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600 min-w-[80px]">
                                {option.votes} ({percentage}%)
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedPoll(poll);
                          setShowDetailsModal(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleStatus(poll._id, poll.status)}
                      >
                        {poll.status === "Active" ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          <Unlock className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeletePoll(poll._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Poll Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCreateModal(false)}>
          <Card className="w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>Create New Poll</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="question">Question</Label>
                  <Input
                    id="question"
                    placeholder="Enter poll question"
                    value={pollForm.question}
                    onChange={(e) => setPollForm({ ...pollForm, question: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Options</Label>
                    <Button size="sm" variant="outline" onClick={addOption}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add Option
                    </Button>
                  </div>
                  {pollForm.options.map((option, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input
                        placeholder={`Option ${idx + 1}`}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...pollForm.options];
                          newOptions[idx] = e.target.value;
                          setPollForm({ ...pollForm, options: newOptions });
                        }}
                      />
                      {pollForm.options.length > 2 && (
                        <Button size="sm" variant="outline" onClick={() => removeOption(idx)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expires">Expires On</Label>
                  <Input
                    id="expires"
                    type="datetime-local"
                    value={pollForm.expiresAt}
                    onChange={(e) => setPollForm({ ...pollForm, expiresAt: e.target.value })}
                  />
                </div>

                <div className="flex gap-2 justify-end pt-4">
                  <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreatePoll}>Create Poll</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedPoll && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDetailsModal(false)}>
          <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>Poll Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{selectedPoll.question}</h3>
                  <div className="flex gap-2">
                    <Badge variant={selectedPoll.status === "Active" ? "default" : "secondary"}>
                      {selectedPoll.status}
                    </Badge>
                    <Badge variant="outline">
                      {selectedPoll.createdByRole === "admin" ? "Admin" : "Student"}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-600">Created By</p>
                    <p className="font-medium">{selectedPoll.createdByName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Votes</p>
                    <p className="font-medium">{selectedPoll.totalVotes}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Created At</p>
                    <p className="font-medium text-sm">{new Date(selectedPoll.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Expires At</p>
                    <p className="font-medium text-sm">{new Date(selectedPoll.expiresAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3">Vote Distribution</h4>
                  <div className="space-y-3">
                    {selectedPoll.options.map((option, idx) => {
                      const percentage = selectedPoll.totalVotes > 0 
                        ? Math.round((option.votes / selectedPoll.totalVotes) * 100) 
                        : 0;
                      return (
                        <div key={idx}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{option.text}</span>
                            <span className="text-sm text-gray-600">{option.votes} votes ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-primary h-3 rounded-full transition-all" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {selectedPoll.votedBy.length > 0 && (
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-3">Voting History ({selectedPoll.votedBy.length})</h4>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {selectedPoll.votedBy.map((vote, idx) => (
                        <div key={idx} className="text-sm p-2 bg-gray-50 rounded flex justify-between">
                          <span>{vote.usn}</span>
                          <span className="text-gray-600">
                            {selectedPoll.options[vote.optionIndex]?.text} - {new Date(vote.votedAt).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 justify-end pt-4 border-t">
                  <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                    Close
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleToggleStatus(selectedPoll._id, selectedPoll.status)}
                  >
                    {selectedPoll.status === "Active" ? "Close Poll" : "Reopen Poll"}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeletePoll(selectedPoll._id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Poll
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
