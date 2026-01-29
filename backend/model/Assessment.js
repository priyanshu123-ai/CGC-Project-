import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema(
  {
     userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // 👈 IMPORTANT
      required: true,
    },

    // ✅ ONLY VALUES
    answers: {
      electricity: Number,       // kWh
      transport: String,         // public | car | bike | ev
      distance: Number,          // km/day
      diet: String,              // vegan | vegetarian | non-veg
      recycling: String,         // always | mostly | never

      greenArea: String,         // high | medium | low
      industryNearby: String,    // yes | no
      trafficDensity: String,    // low | medium | high
    },

    // ✅ RESULT
    score: Number,               // 0–900
    level: String,               // High / Moderate / Low
    aiExplanation: String,

    // ✅ PRECAUTIONS
    precautions: {
      personal: [String],
      area: [String],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Assessment", assessmentSchema);