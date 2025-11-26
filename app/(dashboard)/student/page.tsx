"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { 
  MessageSquare, 
  AlertTriangle, 
  BarChart3, 
  Loader2, 
  Plus,
  ThumbsUp,
  MessageCircle,
  X,
} from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ForumPost {
  _id: string;
  title: string;
  content: string;
  author: string;
  authorUSN: string;
  category: string;
  likes: number;
  likedBy?: string[];
  replies?: { author: string; authorUSN: string; content: string; createdAt: string }[];
  comments: number;
  status: string;
  createdAt: string;
  lastActivity: string;
}

interface Maintenance {
  _id: string;
  type: string;
  title: string;
  description: string;
  studentName: string;
  studentUSN: string;
  roomNumber: string;
  isAnonymous: boolean;
  status: string;
  priority: string;
  submittedAt: string;
}

interface Poll {
  _id: string;
  question: string;
  options: { text: string; votes: number }[];
  createdBy: string;
  createdByName: string;
  createdByRole: string;
  votedBy: { usn: string; optionIndex: number }[];
  totalVotes: number;
  status: string;
  createdAt: string;
  expiresAt: string;
}



function StudentContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "discussions";
  const { user } = useUser();
  
  const studentUSN = user?.usn || "";
  const studentName = user?.name || "";
  const roomNumber = user?.roomNumber || "";
  
  const [showDiscussionModal, setShowDiscussionModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [viewMode, setViewMode] = useState<"view" | "reply">("view");
  const [discussionForm, setDiscussionForm] = useState({ title: "", content: "", category: "General" });
  const [complaintForm, setComplaintForm] = useState({ description: "" });
  const [pollForm, setPollForm] = useState({ question: "", options: ["", ""], expiresAt: "" });

  const { data: forumPosts, loading: postsLoading, refetch: refetchPosts, post: postDiscussion, put: putPost } = useApi<ForumPost[]>("/api/forum/posts");
  const { data: allComplaints, loading: complaintsLoading, refetch: refetchComplaints, post: postComplaint } = useApi<Maintenance[]>("/api/maintenance", { autoFetch: false });
  const { data: polls, loading: pollsLoading, refetch: refetchPolls, post: postPoll, put: putPoll } = useApi<Poll[]>("/api/forum/polls");
  
  const wardenComplaints = (allComplaints || []).filter(c => c.type === "warden");

  useEffect(() => {
    if (studentUSN) {
      refetchComplaints({ type: "warden", usn: studentUSN });
    }
  }, [studentUSN, refetchComplaints]);

  useEffect(() => {
    if (activeTab === "discussions") {
      const interval = setInterval(() => {
        refetchPosts({});
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [activeTab, refetchPosts]);

  const handleLikePost = async (postId: string) => {
    try {
      await putPost(postId, { action: "like", usn: studentUSN });
      await refetchPosts({});
    } catch {
      toast.error("Failed to update like");
    }
  };

  const handleReplyPost = async () => {
    if (!replyContent.trim()) {
      toast.error("Please enter a reply");
      return;
    }
    
    if (!selectedPost) return;
    
    try {
      await putPost(selectedPost._id, { 
        action: "reply", 
        reply: {
          author: studentName,
          authorUSN: studentUSN,
          content: replyContent
        }
      });
      toast.success("Reply posted successfully!");
      setReplyContent("");
      
      await refetchPosts({});
      
      const updatedPosts = (await refetchPosts({})) || [];
      const updatedPost = updatedPosts.find((p: ForumPost) => p._id === selectedPost._id);
      if (updatedPost) {
        setSelectedPost(updatedPost);
      }
    } catch {
      toast.error("Failed to post reply");
    }
  };

  const openViewModal = (post: ForumPost) => {
    setSelectedPost(post);
    setViewMode("view");
    setShowReplyModal(true);
  };

  const openReplyModal = (post: ForumPost) => {
    setSelectedPost(post);
    setViewMode("reply");
    setShowReplyModal(true);
  };

  const hasLikedPost = (post: ForumPost) => {
    return post.likedBy?.includes(studentUSN) || false;
  };

  const handleCreateDiscussion = async () => {
    if (!discussionForm.title || !discussionForm.content) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      await postDiscussion({
        title: discussionForm.title,
        content: discussionForm.content,
        author: studentName,
        authorUSN: studentUSN,
        category: discussionForm.category,
        likes: 0,
        comments: 0,
        status: "Active",
      });
      toast.success("Discussion created successfully!");
      setDiscussionForm({ title: "", content: "", category: "General" });
      setShowDiscussionModal(false);
      refetchPosts({});
    } catch {
      toast.error("Failed to create discussion");
    }
  };

  const handleCreateComplaint = async () => {
    if (!complaintForm.description) {
      toast.error("Please enter complaint description");
      return;
    }
    try {
      await postComplaint({
        studentUSN,
        studentName,
        roomNumber,
        type: "warden",
        title: "Warden Complaint",
        description: complaintForm.description,
        isAnonymous: false,
        priority: "Medium",
        status: "Pending",
      });
      toast.success("Complaint submitted successfully!");
      setComplaintForm({ description: "" });
      setShowComplaintModal(false);
      refetchComplaints({ type: "warden", usn: studentUSN });
    } catch {
      toast.error("Failed to submit complaint");
    }
  };

  const handleCreatePoll = async () => {
    if (!pollForm.question || !pollForm.expiresAt || pollForm.options.some(opt => !opt.trim())) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await postPoll({
        question: pollForm.question,
        options: pollForm.options.map(text => ({ text, votes: 0 })),
        createdBy: studentUSN,
        createdByName: studentName,
        createdByRole: "student",
        expiresAt: new Date(pollForm.expiresAt).toISOString(),
        status: "Active",
        totalVotes: 0,
        votedBy: [],
      });
      
      toast.success("Poll created successfully!");
      setShowPollModal(false);
      setPollForm({ question: "", options: ["", ""], expiresAt: "" });
      refetchPolls({});
    } catch {
      toast.error("Failed to create poll");
    }
  };

  const handleVote = async (pollId: string, optionIndex: number) => {
    try {
      await putPoll(pollId, { vote: optionIndex, usn: studentUSN });
      toast.success("Vote submitted successfully!");
      refetchPolls({});
    } catch (err: unknown) {
      toast.error((err as Error)?.message || "Failed to vote");
    }
  };

  const hasVoted = (poll: Poll) => {
    return poll.votedBy?.some(v => v.usn === studentUSN);
  };

  const addPollOption = () => {
    setPollForm({ ...pollForm, options: [...pollForm.options, ""] });
  };

  const removePollOption = (index: number) => {
    if (pollForm.options.length <= 2) {
      toast.error("Poll must have at least 2 options");
      return;
    }
    const newOptions = pollForm.options.filter((_, i) => i !== index);
    setPollForm({ ...pollForm, options: newOptions });
  };

  return (
    <div>
      <DashboardHeader title="ZenStudent" />
      
      <div className="p-8 space-y-6">        {/* Insights Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-1">My Discussions</p>
              <p className="text-2xl font-bold text-gray-900">
                {(forumPosts || [])
                  .filter(p => (p.status === "Active" || p.status === "Resolved") && p.authorUSN === studentUSN)
                  .length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-1">Warden Complaints</p>
              <p className="text-2xl font-bold text-orange-600">{wardenComplaints.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-1">Active Polls</p>
              <p className="text-2xl font-bold text-purple-600">
                {(polls || []).filter(p => p.status === "Active").length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-1">Pending Complaints</p>
              <p className="text-2xl font-bold text-amber-600">
                {wardenComplaints.filter(c => c.status === "Pending").length}
              </p>
            </CardContent>
          </Card>
        </div>        {/* Tab Navigation */}
        <div className="flex gap-4 border-b pb-2">
          <Link href="/student?tab=discussions" className={cn(
            "px-4 py-2 font-medium cursor-pointer transition-colors",
            activeTab === "discussions" 
              ? "text-primary border-b-2 border-primary" 
              : "text-muted-foreground hover:text-foreground"
          )}>
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Discussions
          </Link>
          <Link href="/student?tab=warden" className={cn(
            "px-4 py-2 font-medium cursor-pointer transition-colors",
            activeTab === "warden" 
              ? "text-primary border-b-2 border-primary" 
              : "text-muted-foreground hover:text-foreground"
          )}>
            <AlertTriangle className="w-4 h-4 inline mr-2" />
            Warden Complaints
          </Link>
          <Link href="/student?tab=polls" className={cn(
            "px-4 py-2 font-medium cursor-pointer transition-colors",
            activeTab === "polls" 
              ? "text-primary border-b-2 border-primary" 
              : "text-muted-foreground hover:text-foreground"
          )}>
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Polls
          </Link>
        </div>

        {/* Discussions Tab */}
        {activeTab === "discussions" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Forum Discussions</h2>
              <Button onClick={() => setShowDiscussionModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Discussion
              </Button>
            </div>

            {postsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : !forumPosts || forumPosts.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-lg">No discussions yet</p>
                    <p className="text-sm mt-2">Start a new discussion to connect with others</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {forumPosts
                  .filter(post => post.status === "Active" || post.status === "Resolved")
                  .map((post) => (
                  <Card 
                    key={post._id} 
                    className="hover:shadow-md transition-shadow hover:bg-secondary/50 cursor-pointer"
                    onClick={() => openViewModal(post)}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-1 text-foreground">{post.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{post.content}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>by {post.author}</span>
                            <span>•</span>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Badge variant="outline">{post.category}</Badge>
                      </div>
                      
                      {/* Replies Preview */}
                      {post.replies && post.replies.length > 0 && (
                        <div className="mt-4 pt-4 border-t space-y-3">
                          <p className="text-sm font-medium text-muted-foreground">Recent Replies ({post.replies.length})</p>
                          {post.replies.slice(-2).map((reply, idx) => (
                            <div key={idx} className="bg-secondary/30 p-3 rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-foreground">{reply.author}</span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(reply.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">{reply.content}</p>
                            </div>
                          ))}
                          {post.replies.length > 2 && (
                            <p className="text-xs text-primary font-medium">
                              Click to view all {post.replies.length} replies
                            </p>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 pt-3 border-t mt-3">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLikePost(post._id);
                          }}
                          className={cn(
                            "flex items-center gap-1 text-sm transition-colors",
                            hasLikedPost(post) 
                              ? "text-primary font-medium" 
                              : "text-muted-foreground hover:text-primary"
                          )}
                        >
                          <ThumbsUp className={cn("w-4 h-4", hasLikedPost(post) && "fill-current")} />
                          {post.likes}
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            openReplyModal(post);
                          }}
                          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          {post.comments} replies
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Warden Complaints Tab */}
        {activeTab === "warden" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Warden Complaints</h2>
              <Button onClick={() => setShowComplaintModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Complaint
              </Button>
            </div>

            {complaintsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : !wardenComplaints || wardenComplaints.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-muted-foreground">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-lg">No complaints filed</p>
                    <p className="text-sm mt-2">File a complaint to report issues to the warden</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {wardenComplaints.map((complaint) => (
                  <Card key={complaint._id} className="hover:shadow-md transition-shadow hover:bg-secondary/50">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">{complaint.title}</h3>
                            <Badge variant={
                              complaint.status === "Completed" ? "success" :
                              complaint.status === "In Progress" ? "warning" :
                              "outline"
                            }>
                              {complaint.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{complaint.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Room: {complaint.roomNumber}</span>
                            <span>•</span>
                            <span>{new Date(complaint.submittedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Badge variant={
                          complaint.priority === "High" ? "destructive" :
                          complaint.priority === "Medium" ? "secondary" :
                          "outline"
                        }>
                          {complaint.priority}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Polls Tab */}
        {activeTab === "polls" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Active Polls</h2>
              <Button onClick={() => setShowPollModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Poll
              </Button>
            </div>

            {pollsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : !polls || polls.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-lg">No polls available</p>
                    <p className="text-sm mt-2">Create a poll to engage with others</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {polls.filter(poll => {
                  const isExpired = new Date(poll.expiresAt) < new Date();
                  const isClosed = poll.status === "Closed";
                  return !isExpired && !isClosed;
                }).map((poll) => {
                  const voted = hasVoted(poll);
                  const isPollActive = poll.status === "Active" && new Date(poll.expiresAt) > new Date();
                  
                  return (
                    <Card key={poll._id} className="hover:bg-secondary/50 transition-colors">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-foreground">{poll.question}</CardTitle>
                          <div className="flex gap-2">
                            <Badge variant={isPollActive ? "default" : "secondary"}>
                              {isPollActive ? "Active" : "Closed"}
                            </Badge>
                            <Badge variant="outline">
                              {poll.createdByRole === "admin" ? "Admin" : "Student"}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">By: {poll.createdByName}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {poll.options.map((option, idx) => {
                            const percentage = poll.totalVotes > 0 
                              ? Math.round((option.votes / poll.totalVotes) * 100) 
                              : 0;
                            
                            return (
                              <div key={idx}>
                                {!voted && isPollActive ? (
                                  <button
                                    onClick={() => handleVote(poll._id, idx)}
                                    className="w-full text-left p-3 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                                  >
                                    <span className="font-medium text-foreground">{option.text}</span>
                                  </button>
                                ) : (
                                  <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium text-foreground">{option.text}</span>
                                      <span className="text-sm text-muted-foreground">{option.votes} votes ({percentage}%)</span>
                                    </div>
                                    <div className="w-full bg-secondary rounded-full h-2">
                                      <div 
                                        className="bg-primary h-2 rounded-full transition-all" 
                                        style={{ width: `${percentage}%` }}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <div className="mt-4 pt-4 border-t text-sm text-muted-foreground flex items-center justify-between">
                          <div>
                            <span>Total votes: {poll.totalVotes}</span>
                            <span className="mx-2">•</span>
                            <span>Expires: {new Date(poll.expiresAt).toLocaleDateString()}</span>
                          </div>
                          {voted && (
                            <Badge variant="secondary">You voted</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* New Discussion Modal */}
      <Modal 
        isOpen={showDiscussionModal} 
        onClose={() => setShowDiscussionModal(false)}
        className="max-w-lg"
      >
        <ModalHeader onClose={() => setShowDiscussionModal(false)}>
          Create New Discussion
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter discussion title"
                value={discussionForm.title}
                onChange={(e) => setDiscussionForm({ ...discussionForm, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                className="w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={discussionForm.category}
                onChange={(e) => setDiscussionForm({ ...discussionForm, category: e.target.value })}
              >
                <option value="General">General</option>
                <option value="Complaint">Complaint</option>
                <option value="Suggestion">Suggestion</option>
                <option value="Question">Question</option>
                <option value="Announcement">Announcement</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <textarea
                id="content"
                className="flex min-h-[120px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Write your discussion content..."
                value={discussionForm.content}
                onChange={(e) => setDiscussionForm({ ...discussionForm, content: e.target.value })}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setShowDiscussionModal(false)}>Cancel</Button>
          <Button onClick={handleCreateDiscussion}>Create Discussion</Button>
        </ModalFooter>
      </Modal>

      {/* New Complaint Modal */}
      <Modal 
        isOpen={showComplaintModal} 
        onClose={() => setShowComplaintModal(false)}
        className="max-w-lg"
      >
        <ModalHeader onClose={() => setShowComplaintModal(false)}>
          File New Complaint
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                className="flex min-h-[120px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Describe your complaint in detail..."
                value={complaintForm.description}
                onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setShowComplaintModal(false)}>Cancel</Button>
          <Button onClick={handleCreateComplaint}>Submit Complaint</Button>
        </ModalFooter>
      </Modal>

      {/* Create Poll Modal */}
      <Modal 
        isOpen={showPollModal} 
        onClose={() => setShowPollModal(false)}
        className="max-w-lg"
      >
        <ModalHeader onClose={() => setShowPollModal(false)}>
          Create Poll
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                type="text"
                value={pollForm.question}
                onChange={(e) => setPollForm({ ...pollForm, question: e.target.value })}
                placeholder="Enter your poll question..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiresAt">Expiry Date</Label>
              <Input
                id="expiresAt"
                type="datetime-local"
                value={pollForm.expiresAt}
                onChange={(e) => setPollForm({ ...pollForm, expiresAt: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Options (minimum 2)</Label>
              <div className="space-y-2">
                {pollForm.options.map((option, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...pollForm.options];
                        newOptions[idx] = e.target.value;
                        setPollForm({ ...pollForm, options: newOptions });
                      }}
                      placeholder={`Option ${idx + 1}`}
                    />
                    {pollForm.options.length > 2 && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => removePollOption(idx)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={addPollOption}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Option
                </Button>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setShowPollModal(false)}>Cancel</Button>
          <Button onClick={handleCreatePoll}>Create Poll</Button>
        </ModalFooter>
      </Modal>

      {/* Reply Modal */}
      <Modal 
        isOpen={showReplyModal && !!selectedPost} 
        onClose={() => setShowReplyModal(false)}
        className="max-w-2xl max-h-[85vh] flex flex-col"
      >
        {selectedPost && (
          <>
            <ModalHeader onClose={() => setShowReplyModal(false)}>
              <div className="flex items-center justify-between w-full pr-8">
                <div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-semibold text-lg">{viewMode === "view" ? "Discussion & Replies" : "Post Your Reply"}</span>
                  </div>
                  {viewMode === "view" ? (
                    <p className="text-sm text-muted-foreground mt-1">
                      Click the comment button below to post a reply
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">
                      Share your thoughts on this discussion
                    </p>
                  )}
                </div>
              </div>
            </ModalHeader>
            <ModalBody className="flex-1 overflow-y-auto">
              <div className="space-y-4">
                {/* Original Post */}
                <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{selectedPost.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <span className="font-medium">{selectedPost.author}</span>
                        <span>•</span>
                        <span>{new Date(selectedPost.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Badge variant="outline">{selectedPost.category}</Badge>
                  </div>
                  <p className="text-sm text-foreground">{selectedPost.content}</p>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-primary/10">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <ThumbsUp className="w-4 h-4" />
                      {selectedPost.likes} likes
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MessageCircle className="w-4 h-4" />
                      {selectedPost.comments} replies
                    </div>
                  </div>
                </div>

                {/* All Replies - Only shown in VIEW mode */}
                {viewMode === "view" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">
                        {selectedPost.replies && selectedPost.replies.length > 0 
                          ? `All Replies (${selectedPost.replies.length})`
                          : "No replies yet"
                        }
                      </p>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={async () => {
                          await refetchPosts({});
                          const updatedPosts = forumPosts || [];
                          const updatedPost = updatedPosts.find(p => p._id === selectedPost._id);
                          if (updatedPost) {
                            setSelectedPost(updatedPost);
                            toast.success("Replies refreshed!");
                          }
                        }}
                      >
                        <Loader2 className="w-4 h-4 mr-1" />
                        Refresh
                      </Button>
                    </div>
                    
                    {selectedPost.replies && selectedPost.replies.length > 0 ? (
                      <div className="space-y-3 max-h-[300px] overflow-y-auto">
                        {selectedPost.replies.map((reply, idx) => (
                          <div key={idx} className="bg-secondary/30 p-3 rounded-lg border border-border">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium">{reply.author}</span>
                              {reply.authorUSN === studentUSN && (
                                <Badge variant="secondary" className="text-xs">You</Badge>
                              )}
                              <span className="text-xs text-muted-foreground ml-auto">
                                {new Date(reply.createdAt).toLocaleDateString()} {new Date(reply.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </span>
                            </div>
                            <p className="text-sm text-foreground whitespace-pre-wrap">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Be the first to reply!</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Reply Input - Only shown in REPLY mode */}
                {viewMode === "reply" && (
                  <div className="space-y-2 pt-4 border-t">
                    <Label htmlFor="reply" className="text-sm font-semibold">Add Your Reply</Label>
                    <textarea
                      id="reply"
                      placeholder="Share your thoughts..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="w-full min-h-[100px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div className="flex gap-2 justify-end">
                      <Button 
                        variant="outline" 
                        onClick={() => setReplyContent("")}
                        disabled={!replyContent.trim()}
                      >
                        Clear
                      </Button>
                      <Button onClick={handleReplyPost} disabled={!replyContent.trim()}>
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Post Reply
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
               <Button variant="outline" onClick={() => setShowReplyModal(false)}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </Modal>
    </div>
  );
}

export default function StudentPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="animate-spin w-8 h-8" /></div>}>
      <StudentContent />
    </Suspense>
  );
}
