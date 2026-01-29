
import Challenge from "../model/Challenge.js";
import { User } from "../model/UserSchema.js";
import sendMail from "../utils/nodemailer.js";

export const sendChallenge = async (req, res) => {
  const { opponentId, email, template } = req.body;
  const challengerId = req.userId;

  let opponent;

  
  if (opponentId) {
    if (opponentId === challengerId) {
      return res.status(400).json({ message: "Cannot challenge yourself" });
    }

    opponent = await User.findById(opponentId);
    if (!opponent) {
      return res.status(404).json({ message: "Opponent not found" });
    }
  }

  // 🔹 CASE 2: Email challenge
  else if (email) {
    opponent = await User.findOne({ email });
    if (!opponent) {
      return res.status(404).json({ message: "User not found with this email" });
    }
  }

  // ❌ Neither provided
  else {
    return res.status(400).json({
      message: "Provide opponentId or email",
    });
  }

  // ✅ Create challenge
  const challenge = await Challenge.create({
    challenger: challengerId,
    opponent: opponent._id,
    title: template.title,
    description: template.description,
    durationDays: template.durationDays,
    reward: template.reward,
    status: "pending",
  });

  // 📧 Send email ONLY if email-based invite
  if (email) {
    const acceptLink = `${process.env.FRONTEND_URL}/accept-challenge/${challenge._id}`;

    await sendMail({
      to: email,
      subject: "Eco Challenge Invitation 🌱",
      html: `
        <h3>You have been challenged!</h3>
        <p><b>${template.title}</b></p>
        <p>${template.description}</p>

        <a href="${acceptLink}"
           style="
             display:inline-block;
             padding:12px 20px;
             background:#22c55e;
             color:#fff;
             border-radius:6px;
             text-decoration:none;
             font-weight:600;
           ">
          Accept Challenge
        </a>
      `,
    });
  }

  res.json({
    success: true,
    message: email
      ? "Challenge sent via email!"
      : "Challenge sent in-app!",
    challengeId: challenge._id,
  });
};



export const acceptChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    // 🔐 Only opponent can accept
    if (challenge.opponent.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to accept this challenge",
      });
    }

    // 🛑 Already handled
    if (challenge.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Challenge already accepted or rejected",
      });
    }

    // ✅ Accept
    challenge.status = "active";
    challenge.startDate = new Date();
    challenge.endDate = new Date(
      Date.now() + challenge.durationDays * 24 * 60 * 60 * 1000
    );

    await challenge.save();

    res.json({
      success: true,
      message: "Challenge accepted!",
      challenge,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to accept challenge",
    });
  }
};

/**
 * ❌ REJECT / DECLINE CHALLENGE
 * POST /api/v6/decline/:id
 */
export const declineChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    // 🔐 Only opponent can reject
    if (challenge.opponent.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to reject this challenge",
      });
    }

    // 🛑 Already handled
    if (challenge.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Challenge already accepted or rejected",
      });
    }

    // ❌ Reject
    challenge.status = "declined";
    await challenge.save();

    res.json({
      success: true,
      message: "Challenge rejected",
      challenge,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to reject challenge",
    });
  }
};


export const getMyChallenges = async (req, res) => {
  const challenges = await Challenge.find({
    $or: [{ challenger: req.userId }, { opponent: req.userId }],
  })
    .populate("challenger opponent", "name email profile.profilePhoto")
    .sort({ createdAt: -1 });

  res.json({ success: true, challenges });
};