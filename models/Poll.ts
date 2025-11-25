import mongoose from "mongoose";

const pollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [{
    text: String,
    votes: { type: Number, default: 0 }
  }],
  createdBy: {
    type: String,
    required: true,
  },
  createdByName: {
    type: String,
    required: true,
  },
  createdByRole: {
    type: String,
    enum: ["student", "admin"],
    required: true,
  },
  votedBy: [{
    usn: String,
    optionIndex: Number,
    votedAt: { type: Date, default: Date.now }
  }],
  totalVotes: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["Active", "Closed"],
    default: "Active"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  }
});

export default mongoose.models?.Poll || mongoose.model("Poll", pollSchema);
