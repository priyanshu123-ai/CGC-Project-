import Groq from "groq-sdk";
import Assessment from "../model/Assessment.js";
import Challenge from "../model/Challenge.js";
import EcoActionLog from "../model/EcoActionLog.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  timeout: 15000,
});

// helper to clean ```json blocks
const cleanJSON = (text) =>
  text.replace(/```json|```/g, "").trim();

export const applyEcoActionAI = async (req, res) => {
  try {
    const userId = req.userId;
    const { action, challengeId } = req.body;

    if (!action) {
      return res.status(400).json({ message: "Action is required" });
    }

    // 🤖 AI ANALYSIS (GROQ)
    const aiRes = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // ✅ active
      temperature: 0,
      messages: [
        {
          role: "user",
          content: `
You are an environmental sustainability expert.

Analyze this action:
"${action}"

Rules:
- Eco-friendly → delta +1 to +10
- Not eco-friendly → delta -1 to -10
- Never return 0

Return ONLY valid JSON:
{
  "delta": number,
  "reason": string,
  "suggestions": [string, string, string]
}
`,
        },
      ],
    });

    const { delta, reason, suggestions } = JSON.parse(
      cleanJSON(aiRes.choices[0].message.content)
    );

    const safeDelta = Math.max(-10, Math.min(10, delta));

    // 🔎 Latest assessment
    const assessment = await Assessment.findOne({ userId }).sort({
      createdAt: -1,
    });

    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    // 📊 Update score
    let newScore = assessment.score + safeDelta;
    newScore = Math.max(0, Math.min(900, newScore));

    let level = "High Pollution Impact";
    if (newScore >= 701) level = "Low Pollution Impact";
    else if (newScore >= 401) level = "Moderate Pollution Impact";

    assessment.score = newScore;
    assessment.level = level;
    await assessment.save();

    // 🏁 Update challenge progress
    let challenge = null;
    if (challengeId) {
      challenge = await Challenge.findById(challengeId);

      if (challenge && challenge.status === "active") {
        if (challenge.challenger.toString() === userId) {
          challenge.progress.challenger += Math.abs(safeDelta);
        } else if (challenge.opponent.toString() === userId) {
          challenge.progress.opponent += Math.abs(safeDelta);
        }
        await challenge.save();
      }
    }

    // 🧾 Save history log
    const log = await EcoActionLog.create({
      user: userId,
      challenge: challengeId,
      action,
      delta: safeDelta,
      reason,
      suggestions,
      scoreAfter: newScore,
    });

    res.json({
      success: true,
      action,
      delta: safeDelta,
      reason,
      suggestions,
      score: newScore,
      level,
      challengeProgress: challenge?.progress,
    });
  } catch (error) {
    console.error("Eco Action AI Error:", error);
    res.status(500).json({
      success: false,
      message: "AI eco action evaluation failed",
    });
  }
};

/* ================= CHALLENGE APIs (NO AI HERE) ================= */

export const getChallengeDetail = async (req, res) => {
  const { id } = req.params;

  const challenge = await Challenge.findById(id)
    .populate("challenger opponent", "name email profile.profilePhoto");

  if (!challenge) {
    return res.status(404).json({ message: "Challenge not found" });
  }

  const logs = await EcoActionLog.find({ challenge: id })
    .populate("user", "name")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    challenge,
    logs,
  });
};

export const finishChallenge = async (req, res) => {
  const challenge = await Challenge.findById(req.params.id);

  if (!challenge || challenge.status !== "active") {
    return res.status(400).json({ message: "Invalid challenge" });
  }

  const { challenger, opponent, progress } = challenge;

  if (progress.challenger > progress.opponent) {
    challenge.winner = challenger;
  } else if (progress.opponent > progress.challenger) {
    challenge.winner = opponent;
  } else {
    challenge.winner = null; // tie
  }

  challenge.status = "completed";
  await challenge.save();

  res.json({
    success: true,
    winner: challenge.winner,
    progress,
  });
};