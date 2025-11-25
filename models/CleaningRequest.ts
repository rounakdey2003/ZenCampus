import mongoose from "mongoose";

const cleaningRequestSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Room", "Bathroom", "Common Area"],
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  studentUSN: {
    type: String,
    required: true,
  },
  roomNumber: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Scheduled", "In Progress", "Completed"],
    default: "Pending"
  },
  priority: {
    type: String,
    enum: ["Normal", "High", "Urgent"],
    default: "Normal"
  },
  scheduledDate: {
    type: String,
  },
  assignedTo: {
    type: String,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

cleaningRequestSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models?.CleaningRequest || mongoose.model("CleaningRequest", cleaningRequestSchema);
