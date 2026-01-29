import { extractTextFromImage } from "../utils/ocr.js";
import { analyzeProductsAI } from "../utils/ecoAI.js";
import Groq from "groq-sdk";

/* 🔹 DMart-specific sanitizer */
const sanitizeText = (text) =>
  text
    .split("\n")
    .map(l => l.trim())
    .filter(l =>
      l.length > 4 &&
      !l.match(
        /cgst|sgst|gst|total|invoice|bill|cashier|phone|cin|fssai|avenue|dmart/i
      )
    )
    .map(l =>
      l
        .replace(/^\d{3,5}\s+/, "")
        .replace(/\s+\d+(\.\d+)?\s+.*$/, "")
        .replace(/\s{2,}/g, " ")
        .trim()
    )
    .filter(l => l.length > 3)
    .join("\n");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const analyzeBill = async (req, res) => {
  try {
    let billText = "";

    /* IMAGE INPUT */
    if (req.file) {
      const rawText = await extractTextFromImage(req.file.buffer);
      billText = sanitizeText(rawText);
    }

    /* TEXT INPUT */
    if (!billText && req.body.billText) {
      billText = sanitizeText(req.body.billText);
    }

    if (!billText) {
      return res.status(400).json({
        success: false,
        message: "Provide bill image or bill text",
      });
    }

    /* STEP 1: PRODUCT EXTRACTION (GROQ) */
    const extractRes = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // ✅ confirmed active
      temperature: 0,
      messages: [
        {
          role: "user",
          content: `
You are reading an Indian supermarket (DMart) bill.

Extract ONLY product names.
Ignore prices, quantities, HSN codes, GST, totals.

Rules:
- Return ONLY a JSON array of strings
- No explanation
- Clean product names only

Bill text:
${billText}
`,
        },
      ],
    });

    let products = [];

    try {
      products = JSON.parse(
        extractRes.choices[0].message.content.replace(/```json|```/g, "")
      );
    } catch {
      return res.status(500).json({
        success: false,
        message: "Failed to extract products from bill",
      });
    }

    /* LIMIT PRODUCTS */
    products = products.slice(0, 25);

    /* STEP 2: ECO ANALYSIS */
    let ecoResult;
    try {
      ecoResult = await analyzeProductsAI(products);
    } catch {
      ecoResult = {
        totalPollutionScore: 0,
        analysis: products.map(p => ({
          item: p,
          impact: "unknown",
          recyclable: false,
          pollution: 0,
          alternatives: [],
          reason: "Eco AI unavailable",
        })),
      };
    }

    res.json({
      success: true,
      inputType: req.file ? "image" : "text",
      productsDetected: products.length,
      pollutionScore: ecoResult.totalPollutionScore,
      summary:
        ecoResult.totalPollutionScore > 15
          ? "⚠️ High environmental impact"
          : "🌱 Eco-friendly purchase",
      breakdown: ecoResult.analysis,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Bill analysis failed",
    });
  }
};