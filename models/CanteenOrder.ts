import mongoose from "mongoose";

const canteenOrderSchema = new mongoose.Schema({
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
  items: [{
    name: String,
    quantity: Number,
    price: Number,
  }],
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Preparing", "Ready", "Delivered"],
    default: "Pending"
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

canteenOrderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models?.CanteenOrder || mongoose.model("CanteenOrder", canteenOrderSchema);
