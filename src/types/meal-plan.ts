export interface MealNutrition {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  prep_time: string;
  instructions: string;
}

export interface DayMeals {
  breakfast: MealNutrition;
  lunch: MealNutrition;
  dinner: MealNutrition;
  snack: MealNutrition;
}

export interface DayPlan {
  day: string;
  date: string;
  meals: DayMeals;
  day_totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface ShoppingItem {
  ingredient: string;
  quantity: string;
  category: string;
}

export interface MealPlanData {
  days: DayPlan[];
  shopping_list: ShoppingItem[];
}

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";
