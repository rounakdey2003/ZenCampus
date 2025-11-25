import mongoose, { Schema, Model } from "mongoose";
import { Discussion, WardenComplaint, Poll } from "@/types";

export interface IDiscussionDocument extends Omit<Discussion, "_id">, mongoose.Document {}
export interface IWardenComplaintDocument
  extends Omit<WardenComplaint, "_id">,
    mongoose.Document {}
export interface IPollDocument extends Omit<Poll, "_id">, mongoose.Document {}

const commentSchema = new Schema(
  {
    userUSN: String,
    userName: String,
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const discussionSchema = new Schema<IDiscussionDocument>(
  {
    userUSN: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["public", "anonymous"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    upvoters: [
      {
        type: String,
      },
    ],
    comments: [commentSchema],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

const wardenComplaintSchema = new Schema<IWardenComplaintDocument>(
  {
    userUSN: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["public", "anonymous"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    upvoters: [
      {
        type: String,
      },
    ],
    comments: [commentSchema],
    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved"],
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

const pollSchema = new Schema<IPollDocument>(
  {
    userUSN: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    options: [
      {
        text: String,
        votes: {
          type: Number,
          default: 0,
        },
      },
    ],
    voters: [
      {
        type: String,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

export const DiscussionModel: Model<IDiscussionDocument> =
  mongoose.models.Discussion ||
  mongoose.model<IDiscussionDocument>("Discussion", discussionSchema);

export const WardenComplaintModel: Model<IWardenComplaintDocument> =
  mongoose.models.WardenComplaint ||
  mongoose.model<IWardenComplaintDocument>("WardenComplaint", wardenComplaintSchema);

export const PollModel: Model<IPollDocument> =
  mongoose.models.Poll || mongoose.model<IPollDocument>("Poll", pollSchema);
