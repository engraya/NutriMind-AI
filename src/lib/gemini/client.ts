import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// gemini-1.5-pro: high quality for meal plans and vision tasks
export const geminiPro = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  systemInstruction:
    "You are a professional nutritionist AI. Respond only with valid JSON when asked for structured data — no markdown, no code fences, no explanation.",
});

// gemini-1.5-flash: fast and cost-efficient for chat and recipe recommendations
export const geminiFlash = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});
