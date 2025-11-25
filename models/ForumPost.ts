import mongoose from "mongoose";

const forumPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  authorUSN: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["General", "Complaint", "Suggestion", "Question", "Announcement"],
    default: "General"
  },
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: [{
    type: String,
  }],
  replies: [{
    author: { type: String, required: true },
    authorUSN: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  comments: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["Active", "Flagged", "Resolved", "Deleted"],
    default: "Active"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastActivity: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.models?.ForumPost || mongoose.model("ForumPost", forumPostSchema);
