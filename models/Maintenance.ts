import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["Electrical", "Plumbing", "Carpentry", "General", "warden", "room"]
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
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
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending"
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High", "Urgent"],
    default: "Medium"
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

maintenanceSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models?.Maintenance || mongoose.model("Maintenance", maintenanceSchema);
