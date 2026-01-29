import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config({ path: '../.env' });  // Add path to .env file

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const models = await groq.models.list();
console.log(models);