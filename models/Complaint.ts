import mongoose, { Schema, Model } from "mongoose";
import { Complaint } from "@/types";

export interface IComplaintDocument extends Omit<Complaint, "_id">, mongoose.Document {}

const complaintSchema = new Schema<IComplaintDocument>(
  {
    category: {
      type: String,
      enum: ["electrical", "plumbing", "carpentry", "room", "bathroom"],
      required: true,
    },
    userUSN: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: false,
  }
);

const ComplaintModel: Model<IComplaintDocument> =
  mongoose.models.Complaint ||
  mongoose.model<IComplaintDocument>("Complaint", complaintSchema);

export default ComplaintModel;
