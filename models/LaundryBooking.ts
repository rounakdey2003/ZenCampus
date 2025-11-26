import mongoose from "mongoose";

const laundryBookingSchema = new mongoose.Schema({
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
  machineType: {
    type: String,
    enum: ["Washing Machine", "Dryer"],
    required: true,
  },
  machineNumber: {
    type: Number,
    required: true,
  },
  cycleType: {
    type: String,
    enum: ["Quick Wash", "Normal Wash", "Heavy Wash", "Quick Dry", "Normal Dry", "Extra Dry"],
  },
  scheduledDate: {
    type: String,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Scheduled", "In Progress", "Completed", "Cancelled"],
    default: "Scheduled"
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

laundryBookingSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

laundryBookingSchema.index({ 
  machineType: 1, 
  machineNumber: 1, 
  scheduledDate: 1, 
  status: 1 
});

export default mongoose.models?.LaundryBooking || mongoose.model("LaundryBooking", laundryBookingSchema);
