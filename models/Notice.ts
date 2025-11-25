import mongoose, { Schema, Model } from "mongoose";
import { Notice } from "@/types";

export interface INoticeDocument extends Omit<Notice, "_id">, mongoose.Document {}

const noticeSchema = new Schema<INoticeDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["General", "Academic", "Event", "Urgent", "Maintenance"],
      default: "General",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Active", "Archived"],
      default: "Active",
    },
    createdBy: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const NoticeModel: Model<INoticeDocument> =
  mongoose.models.Notice || mongoose.model<INoticeDocument>("Notice", noticeSchema);

export default NoticeModel;
