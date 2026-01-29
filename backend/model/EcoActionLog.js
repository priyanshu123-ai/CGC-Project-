// models/EcoActionLog.js
import mongoose from "mongoose";

const ecoActionLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    challenge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
    },

    action: String,

    delta: Number, // + or -

    reason: String,

    suggestions: [String], // recycle, reuse, etc.

    scoreAfter: Number,
  },
  { timestamps: true }
);

export default mongoose.model("EcoActionLog", ecoActionLogSchema);