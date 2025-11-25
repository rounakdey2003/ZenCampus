import mongoose, { Schema, Model } from "mongoose";
import { Machine } from "@/types";

export interface IMachineDocument extends Omit<Machine, "_id">, mongoose.Document {}

const machineSchema = new Schema<IMachineDocument>(
  {
    machineNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["Available", "In Use", "Faulty", "Repairing"],
      default: "Available",
    },
    userUSN: {
      type: String,
      default: null,
    },
    userName: {
      type: String,
      default: null,
    },
    startTime: {
      type: Date,
      default: null,
    },
    endTime: {
      type: Date,
      default: null,
    },
    repairEndTime: {
      type: Date,
      default: null,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

export const WashingMachine: Model<IMachineDocument> =
  mongoose.models.WashingMachine ||
  mongoose.model<IMachineDocument>("WashingMachine", machineSchema);

export const DryerMachine: Model<IMachineDocument> =
  mongoose.models.DryerMachine ||
  mongoose.model<IMachineDocument>("DryerMachine", machineSchema);
