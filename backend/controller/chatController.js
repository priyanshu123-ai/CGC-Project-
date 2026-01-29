import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const ecoBotController = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        reply: "Please enter a message",
      });
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // ✅ confirmed active
      messages: [
        {
          role: "system",
          content:
            "You are EcoBot, a sustainability and pollution assistant. Give clear, practical advice.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    res.json({
      reply: response.choices[0].message.content,
    });

  } catch (error) {
    console.error("EcoBot error:", error);
    res.status(500).json({
      reply: "EcoBot is currently unavailable 🌍",
    });
  }
};