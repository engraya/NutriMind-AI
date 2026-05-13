export interface DetectedIngredient {
  name: string;
  confidence: number;
  estimated_quantity: string;
}

export interface SuggestedMeal {
  name: string;
  cuisine_type: string;
  description: string;
  prep_time: string;
  uses_ingredients: string[];
  estimated_nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface FridgeScanResult {
  detected_ingredients: DetectedIngredient[];
  suggested_meals: SuggestedMeal[];
  nutritional_note: string;
}
