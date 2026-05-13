import { geminiFlash } from "./client";

interface RecommendRecipesParams {
  cuisinePreferences: string[];
  dietaryRestrictions: string[];
  allergies: string[];
  goal: string;
  recentMealNames?: string[];
  ingredients?: string[];
  cuisineFilter?: string;
  mealTypeFilter?: string;
  count?: number;
}

export interface RecipeResult {
  title: string;
  cuisine_type: string;
  meal_type: string;
  diet_tags: string[];
  prep_time_min: number;
  cook_time_min: number;
  servings: number;
  calories_per_serving: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  ingredients: Array<{ name: string; amount: string }>;
  instructions: Array<{ step: number; text: string }>;
  description: string;
}

export async function recommendRecipes(
  params: RecommendRecipesParams
): Promise<RecipeResult[]> {
  const {
    cuisinePreferences,
    dietaryRestrictions,
    allergies,
    goal,
    recentMealNames = [],
    ingredients = [],
    cuisineFilter,
    mealTypeFilter,
    count = 6,
  } = params;

  const prompt = `Recommend ${count} recipes based on this user profile:
- Health goal: ${goal}
- Preferred cuisines: ${cuisineFilter || cuisinePreferences.join(", ") || "any"}
- Dietary restrictions: ${dietaryRestrictions.length ? dietaryRestrictions.join(", ") : "none"}
- Allergies to avoid: ${allergies.length ? allergies.join(", ") : "none"}
${mealTypeFilter ? `- Meal type filter: ${mealTypeFilter}` : ""}
${ingredients.length ? `- Must use these available ingredients: ${ingredients.join(", ")}` : ""}
${recentMealNames.length ? `- Avoid repeating these recent meals: ${recentMealNames.slice(0, 10).join(", ")}` : ""}

Include Nigerian recipes (e.g., Egusi Soup, Jollof Rice, Moi Moi, Suya, Ofada Stew, Akara, Pepper Soup) when appropriate.

Return a JSON array with exactly this structure for each recipe:
[{
  "title": "string",
  "cuisine_type": "string",
  "meal_type": "breakfast|lunch|dinner|snack",
  "diet_tags": ["string"],
  "prep_time_min": number,
  "cook_time_min": number,
  "servings": number,
  "calories_per_serving": number,
  "protein_g": number,
  "carbs_g": number,
  "fat_g": number,
  "ingredients": [{ "name": "string", "amount": "string" }],
  "instructions": [{ "step": number, "text": "string" }],
  "description": "string"
}]

Respond with valid JSON array only.`;

  const result = await geminiFlash.generateContent(prompt);
  let text = result.response.text().trim();
  text = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");

  return JSON.parse(text) as RecipeResult[];
}
