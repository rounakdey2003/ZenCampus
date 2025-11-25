import mongoose from "mongoose";

const timetableEntrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  timing: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Washing", "Dryer", "General"],
    default: "General"
  },
  day: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "All Days"],
    default: "All Days"
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

timetableEntrySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models?.TimetableEntry || mongoose.model("TimetableEntry", timetableEntrySchema);
