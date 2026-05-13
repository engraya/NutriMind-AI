import { geminiPro } from "./client";
import type { FridgeScanResult } from "@/types/fridge";

const FRIDGE_SCAN_PROMPT = `Analyze this refrigerator/pantry/food image carefully. Identify all visible food ingredients.

Return a JSON object with exactly this structure:
{
  "detected_ingredients": [
    { "name": "string", "confidence": number (0-1), "estimated_quantity": "string" }
  ],
  "suggested_meals": [
    {
      "name": "string",
      "cuisine_type": "string",
      "description": "string",
      "prep_time": "string",
      "uses_ingredients": ["string"],
      "estimated_nutrition": { "calories": number, "protein": number, "carbs": number, "fat": number }
    }
  ],
  "nutritional_note": "string"
}

Include Nigerian recipes in suggestions when ingredients permit:
- Eggs visible → suggest Egg Sauce or Nigerian Scrambled Eggs
- Tomatoes + rice → suggest Jollof Rice
- Plantains → suggest Fried Plantain (Dodo)
- Beans → suggest Moin Moin or Akara
- Fish/meat + tomatoes → suggest Nigerian Stew

Suggest 3-5 meals. Respond with JSON only.`;

export async function analyzeFridgeImage(
  imageUrl: string
): Promise<FridgeScanResult> {
  // Fetch the image from Cloudinary and convert to base64
  const imageResponse = await fetch(imageUrl);
  const imageBuffer = await imageResponse.arrayBuffer();
  const base64 = Buffer.from(imageBuffer).toString("base64");
  const mimeType =
    (imageResponse.headers.get("content-type") as string) || "image/jpeg";

  const imagePart = {
    inlineData: { data: base64, mimeType },
  };

  const result = await geminiPro.generateContent([FRIDGE_SCAN_PROMPT, imagePart]);
  let text = result.response.text().trim();
  text = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");

  return JSON.parse(text) as FridgeScanResult;
}
