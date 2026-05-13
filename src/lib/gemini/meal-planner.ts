import { geminiPro } from "./client";
import type { MealPlanData } from "@/types/meal-plan";

interface GenerateMealPlanParams {
  calorieTarget: number;
  cuisinePreferences: string[];
  dietaryRestrictions: string[];
  allergies: string[];
  availableIngredients?: string[];
  budget?: "low" | "medium" | "high";
  daysToGenerate?: number;
  proteinPct?: number;
  carbsPct?: number;
  fatPct?: number;
}

const MEAL_PLAN_SCHEMA = `{
  "days": [
    {
      "day": "string (e.g. Monday)",
      "date": "string (ISO date)",
      "meals": {
        "breakfast": { "name": "string", "calories": number, "protein": number, "carbs": number, "fat": number, "ingredients": ["string"], "prep_time": "string", "instructions": "string" },
        "lunch": { "name": "string", "calories": number, "protein": number, "carbs": number, "fat": number, "ingredients": ["string"], "prep_time": "string", "instructions": "string" },
        "dinner": { "name": "string", "calories": number, "protein": number, "carbs": number, "fat": number, "ingredients": ["string"], "prep_time": "string", "instructions": "string" },
        "snack": { "name": "string", "calories": number, "protein": number, "carbs": number, "fat": number, "ingredients": ["string"], "prep_time": "string", "instructions": "string" }
      },
      "day_totals": { "calories": number, "protein": number, "carbs": number, "fat": number }
    }
  ],
  "shopping_list": [{ "ingredient": "string", "quantity": "string", "category": "string" }]
}`;

export async function generateMealPlan(
  params: GenerateMealPlanParams
): Promise<MealPlanData> {
  const {
    calorieTarget,
    cuisinePreferences,
    dietaryRestrictions,
    allergies,
    availableIngredients = [],
    budget = "medium",
    daysToGenerate = 7,
    proteinPct = 30,
    carbsPct = 45,
    fatPct = 25,
  } = params;

  const today = new Date();
  const startDate = today.toISOString().split("T")[0];

  const prompt = `Generate a ${daysToGenerate}-day meal plan starting from ${startDate}.

Requirements:
- Daily calorie target: ${calorieTarget} kcal
- Macro split: ${proteinPct}% protein, ${carbsPct}% carbs, ${fatPct}% fat
- Dietary restrictions: ${dietaryRestrictions.length ? dietaryRestrictions.join(", ") : "none"}
- Allergies to avoid completely: ${allergies.length ? allergies.join(", ") : "none"}
${availableIngredients.length ? `- Prioritize these available ingredients: ${availableIngredients.join(", ")}` : ""}
- Preferred cuisines: ${cuisinePreferences.length ? cuisinePreferences.join(", ") : "any"}
- Budget level: ${budget}
- Include Nigerian dishes (e.g., Jollof Rice, Egusi Soup, Moi Moi, Suya, Ofada Stew, Pepper Soup) where appropriate

Return JSON matching exactly this schema:
${MEAL_PLAN_SCHEMA}

Ensure each day's total calories are within ±50 kcal of the target.`;

  let result = await geminiPro.generateContent(prompt);
  let text = result.response.text().trim();

  // Strip markdown code fences if present
  text = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");

  try {
    return JSON.parse(text) as MealPlanData;
  } catch {
    // Retry once with explicit correction instruction
    const retryResult = await geminiPro.generateContent(
      `${prompt}\n\nIMPORTANT: Your previous response had invalid JSON. Return ONLY valid JSON, no trailing commas, no comments, no markdown.`
    );
    let retryText = retryResult.response.text().trim();
    retryText = retryText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    return JSON.parse(retryText) as MealPlanData;
  }
}
