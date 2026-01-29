import Groq from "groq-sdk";
import Assessment from "../model/Assessment.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  timeout: 15000,
});

const calculateScore = (answers) => {
  let score = 900;

  // ⚡ Electricity (0–1000 kWh)
  if (answers.electricity > 800) score -= 150;
  else if (answers.electricity > 500) score -= 100;
  else if (answers.electricity > 300) score -= 50;

  // 🚗 Transport
  switch (answers.transport) {
    case "personal":
      score -= 180;
      break;
    case "carpool":
      score -= 100;
      break;
    case "public":
      score -= 60;
      break;
    case "bike":
      score -= 20;
      break;
    case "electric":
      score -= 10;
      break;
  }

  // 📏 Daily distance
  if (answers.distance > 50) score -= 120;
  else if (answers.distance > 20) score -= 70;
  else if (answers.distance > 5) score -= 30;

  // 🛍 Shopping habits
  switch (answers.shopping) {
    case "weekly":
      score -= 100;
      break;
    case "monthly":
      score -= 60;
      break;
    case "rarely":
      score -= 30;
      break;
    case "secondhand":
      score -= 10;
      break;
  }

  // 🍽 Diet
  switch (answers.diet) {
    case "omnivore":
      score -= 120;
      break;
    case "flexitarian":
      score -= 70;
      break;
    case "vegetarian":
      score -= 40;
      break;
    case "vegan":
      score -= 10;
      break;
  }

  // ♻️ Recycling
  switch (answers.recycling) {
    case "never":
      score -= 120;
      break;
    case "sometimes":
      score -= 70;
      break;
    case "mostly":
      score -= 30;
      break;
    case "always":
      score -= 0;
      break;
  }

  // 🏠 Energy-efficient appliances
  switch (answers.home) {
    case "none":
      score -= 100;
      break;
    case "some":
      score -= 60;
      break;
    case "most":
      score -= 30;
      break;
    case "all":
      score -= 0;
      break;
  }

  // Clamp score
  return Math.max(0, Math.min(900, score));
};




const getImpactLevel = (score) => {
  if (score <= 300) return "Low Pollution Impact";
  if (score <= 600) return "Moderate Pollution Impact";
  return "High Pollution Impact";
};


// helper to clean ```json blocks
const cleanJSON = (text) =>
  text.replace(/```json|```/g, "").trim();

export const ecoScoreController = async (req, res) => {
  try {
    const userId = req.userId;
    const { answers } = req.body;

    // ✅ 1. Backend decides score
    const score = calculateScore(answers);

    // ✅ 2. Backend decides level
    const level = getImpactLevel(score);

    // ✅ 3. AI ONLY explains
    const prompt = `
You are an environmental pollution expert.

IMPORTANT:
- Do NOT calculate or change score
- Do NOT change impact level

User pollution score: ${score}
Impact level: ${level}

User answers:
${JSON.stringify(answers, null, 2)}

TASK:
- Explain WHY the user got this level
- Suggest precautions only

Return ONLY valid JSON:
{
  "explanation": string,
  "precautions": {
    "personal": [string, string, string],
    "area": [string, string, string]
  }
}
`;

    const aiRes = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      messages: [{ role: "user", content: prompt }],
    });

    const result = JSON.parse(
      cleanJSON(aiRes.choices[0].message.content)
    );

    // ✅ 4. Save clean data
    const savedAssessment = await Assessment.create({
      userId,
      answers,
      score,           // ✔️ always number
      level,           // ✔️ always valid
      aiExplanation: result.explanation,
      precautions: result.precautions,
    });

    const populatedAssessment = await Assessment.findById(
      savedAssessment._id
    ).populate("userId", "name email profile");

    res.json({
      success: true,
      assessment: populatedAssessment,
    });

  } catch (error) {
    console.error("EcoScore Error:", error);
    res.status(500).json({
      success: false,
      message: "Eco analysis failed",
    });
  }
};


export const getLatestAssessment = async (req, res) => {
  try {
    const userId = req.userId;

    const assessment = await Assessment.findOne({ userId })
      .populate("userId", "name email profile")
      .sort({ createdAt: -1 });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "No assessment found",
      });
    }

    res.json({
      success: true,
      assessment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch latest assessment",
    });
  }
};

export const updateEcoAssessment = async (req, res) => {
  try {
    const userId = req.userId;
    const { assessmentId } = req.params;
    const { answers } = req.body;

    const assessment = await Assessment.findOne({
      _id: assessmentId,
      userId,
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found",
      });
    }

    const prompt = `
You are an environmental pollution expert.

Analyze pollution using PERSONAL and AREA factors.

User data:
${JSON.stringify(answers, null, 2)}

SCORING RULES:
- 0–400  = High Pollution Impact
- 401–700 = Moderate Pollution Impact
- 701–900 = Low Pollution Impact

Return ONLY valid JSON:
{
  "score": number,
  "level": string,
  "explanation": string,
  "precautions": {
    "personal": [string, string, string],
    "area": [string, string, string]
  }
}
`;

    const aiRes = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      messages: [{ role: "user", content: prompt }],
    });

    const result = JSON.parse(
      cleanJSON(aiRes.choices[0].message.content)
    );

    const score = Math.max(0, Math.min(900, result.score));

    assessment.answers = answers;
    assessment.score = score;
    assessment.level = result.level;
    assessment.aiExplanation = result.explanation;
    assessment.precautions = result.precautions;

    await assessment.save();

    const populatedAssessment = await Assessment.findById(
      assessment._id
    ).populate("userId", "name email profile");

    res.json({
      success: true,
      assessment: populatedAssessment,
    });
  } catch (error) {
    console.error("Update Assessment Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update assessment",
    });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Assessment.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$userId",
          score: { $first: "$score" },
          level: { $first: "$level" },
          createdAt: { $first: "$createdAt" },
        },
      },
      { $sort: { score: 1 } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$user._id",
          name: "$user.name",
          email: "$user.email",
          avatar: "$user.profile.profilePhoto",
          score: 1,
          level: 1,
        },
      },
    ]);

    const ranked = leaderboard.map((u, index) => ({
      rank: index + 1,
      ...u,
    }));

    res.status(200).json({
      success: true,
      totalUsers: ranked.length,
      leaderboard: ranked,
    });
  } catch (error) {
    console.error("Leaderboard Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard",
    });
  }
};