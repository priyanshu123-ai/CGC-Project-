// models/Challenge.js
import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema(
  {
    challenger: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    opponent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: String,
    description: String,
    durationDays: Number,
    reward: Number,

    status: {
      type: String,
      enum: ["pending", "active", "completed", "declined"],
      default: "pending",
    },

    startDate: Date,
    endDate: Date,

    progress: {
      challenger: { type: Number, default: 0 },
      opponent: { type: Number, default: 0 },
    },

    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Challenge", challengeSchema);