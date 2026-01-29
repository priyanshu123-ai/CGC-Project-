import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  timeout: 15000, // ⏱ prevent hanging
});

// remove ```json markdown safely
const cleanJSON = (text) =>
  text.replace(/```json|```/g, "").trim();

// retry wrapper (Groq)
const withRetry = async (fn, retries = 2) => {
  try {
    return await fn();
  } catch (err) {
    if (retries === 0) throw err;
    console.warn("🔁 Retrying Groq...");
    return withRetry(fn, retries - 1);
  }
};

export const analyzeProductsAI = async (products) => {
  const prompt = `
Analyze environmental impact of products.

Return JSON ONLY in this format:

{
  "analysis": [
    {
      "item": string,
      "impact": "eco" | "moderate" | "hazardous",
      "recyclable": boolean,
      "pollution": number,
      "alternatives": string[],
      "reason": string
    }
  ],
  "totalPollutionScore": number
}

Products:
${JSON.stringify(products)}
`;

  const response = await withRetry(() =>
    groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // ✅ confirmed active
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    })
  );

  const raw = response.choices[0].message.content;
  return JSON.parse(cleanJSON(raw));
};