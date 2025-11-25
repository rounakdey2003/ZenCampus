"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ThumbsUp, MessageCircle, Trash2, Flag, Loader2 } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { toast } from "sonner";

interface ForumPost {
  _id: string;
  title: string;
  content: string;
  author: string;
  authorUSN: string;
  category: "General" | "Complaint" | "Suggestion" | "Question" | "Announcement";
  likes: number;
  comments: number;
  status: "Active" | "Flagged" | "Resolved" | "Deleted";
  createdAt: string;
}

interface Poll {
  _id: string;
  question: string;
  options: { text: string; votes: number }[];
  createdBy: string;
  totalVotes: number;
  status: "Active" | "Closed";
  createdAt: string;
  expiresAt: string;
}

export default function ForumManagementPage() {
  const [activeTab, setActiveTab] = useState<"posts" | "polls">("posts");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const { data: posts, loading: postsLoading, error: postsError, refetch: refetchPosts, put: putPost, del: delPost } = useApi<ForumPost[]>("/api/forum/posts");
  const { data: polls, loading: pollsLoading, error: pollsError, refetch: refetchPolls, put: putPoll, del: delPoll } = useApi<Poll[]>("/api/forum/polls");

  useEffect(() => {
    if (activeTab === "posts") {
      const params: Record<string, string> = {};
      if (searchQuery) params.search = searchQuery;
      if (filterCategory !== "All") params.category = filterCategory;
      if (filterStatus !== "All") params.status = filterStatus;
      refetchPosts(params);
    } else {
      const params: Record<string, string> = {};
      if (searchQuery) params.search = searchQuery;
      if (filterStatus !== "All") params.status = filterStatus;
      refetchPolls(params);
    }
  }, [activeTab, searchQuery, filterCategory, filterStatus, refetchPosts, refetchPolls]);

  const filteredPosts = posts || [];
  const filteredPolls = polls || [];

  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await delPost(id);
      toast.success("Post deleted successfully!");
      refetchPosts();
    } catch (err) {
      toast.error("Failed to delete post: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const handleFlagPost = async (id: string, flag: boolean) => {
    try {
      await putPost(id, { status: flag ? "Flagged" : "Active" });
      toast.success(flag ? "Post flagged!" : "Post unflagged!");
      refetchPosts();
    } catch (err) {
      toast.error("Failed to update post: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const handleClosePoll = async (id: string, close: boolean) => {
    try {
      await putPoll(id, { status: close ? "Closed" : "Active" });
      toast.success(close ? "Poll closed!" : "Poll reopened!");
      refetchPolls();
    } catch (err) {
      toast.error("Failed to update poll: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const handleDeletePoll = async (id: string) => {
    if (!confirm("Are you sure you want to delete this poll?")) return;
    try {
      await delPoll(id);
      toast.success("Poll deleted successfully!");
      refetchPolls();
    } catch (err) {
      toast.error("Failed to delete poll: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const stats = {
    totalPosts: filteredPosts.length,
    activePosts: filteredPosts.filter(p => p.status === "Active").length,
    flaggedPosts: filteredPosts.filter(p => p.status === "Flagged").length,
    totalPolls: filteredPolls.length,
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Student Forum Management</h1>
        <p className="text-gray-600 mt-1">Moderate discussions and manage polls</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total Posts</p>
            <p className="text-2xl font-bold">{stats.totalPosts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Active Posts</p>
            <p className="text-2xl font-bold text-green-600">{stats.activePosts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Flagged Posts</p>
            <p className="text-2xl font-bold text-red-600">{stats.flaggedPosts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total Polls</p>
            <p className="text-2xl font-bold">{stats.totalPolls}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2 border-b overflow-x-auto">
        <button
          onClick={() => setActiveTab("posts")}
          className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === "posts" ? "border-b-2 border-primary text-primary" : "text-gray-600"}`}
        >
          Discussion Posts
        </button>
        <button
          onClick={() => setActiveTab("polls")}
          className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === "polls" ? "border-b-2 border-primary text-primary" : "text-gray-600"}`}
        >
          Polls
        </button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={activeTab === "posts" ? "Search posts..." : "Search polls..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              {activeTab === "posts" && (
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 border rounded-lg w-full sm:w-auto"
                >
                  <option value="All">All Categories</option>
                  <option value="General">General</option>
                  <option value="Complaint">Complaint</option>
                  <option value="Suggestion">Suggestion</option>
                  <option value="Question">Question</option>
                  <option value="Announcement">Announcement</option>
                </select>
              )}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border rounded-lg w-full sm:w-auto"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Flagged">Flagged</option>
                {activeTab === "posts" && <option value="Resolved">Resolved</option>}
                {activeTab === "polls" && <option value="Closed">Closed</option>}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {activeTab === "posts" ? (
        <Card>
          <CardHeader>
            <CardTitle>Discussion Posts ({filteredPosts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {postsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="ml-2">Loading posts...</span>
              </div>
            ) : postsError ? (
              <div className="text-center py-8 text-red-600">Error: {postsError}</div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No posts found.</div>
            ) : (
              <div className="space-y-3">
                {filteredPosts.map((post) => (
                  <div key={post._id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="font-semibold">{post.title}</h4>
                          <Badge variant="outline" className="text-xs">{post.category}</Badge>
                          <Badge variant={
                            post.status === "Flagged" ? "destructive" :
                            post.status === "Resolved" ? "success" : "default"
                          } className="text-xs">
                            {post.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{post.content}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span>{post.author} ({post.authorUSN})</span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3" />
                            {post.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {post.comments}
                          </span>
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto">
                        {post.status !== "Flagged" ? (
                          <Button size="sm" variant="outline" onClick={() => handleFlagPost(post._id, true)} className="flex-1 md:flex-none">
                            <Flag className="w-3 h-3" />
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => handleFlagPost(post._id, false)} className="flex-1 md:flex-none">
                            Unflag
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => handleDeletePost(post._id)} className="flex-1 md:flex-none">
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
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Polls ({filteredPolls.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {pollsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="ml-2">Loading polls...</span>
              </div>
            ) : pollsError ? (
              <div className="text-center py-8 text-red-600">Error: {pollsError}</div>
            ) : filteredPolls.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No polls found.</div>
            ) : (
              <div className="space-y-4">
                {filteredPolls.map((poll) => (
                  <div key={poll._id} className="p-4 border rounded-lg">
                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-3 gap-2">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{poll.question}</h4>
                        <p className="text-sm text-gray-600">Created by: {poll.createdBy}</p>
                        <p className="text-xs text-gray-400">Total votes: {poll.totalVotes}</p>
                      </div>
                      <Badge variant={poll.status === "Active" ? "success" : "secondary"} className="self-start">
                        {poll.status}
                      </Badge>
                    </div>
                    <div className="space-y-2 mb-3">
                      {poll.options.map((option, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">{option.text}</span>
                          <span className="text-sm font-semibold">{option.votes} votes</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-500 gap-2">
                      <span>Expires: {new Date(poll.expiresAt).toLocaleDateString()}</span>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleClosePoll(poll._id, poll.status === "Active")}
                          className="flex-1 sm:flex-none"
                        >
                          {poll.status === "Active" ? "Close Poll" : "Reopen Poll"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeletePoll(poll._id)}
                          className="flex-1 sm:flex-none"
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
      )}
    </div>
  );
}
