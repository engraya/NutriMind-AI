export interface MacroBreakdown {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export interface DailySummary {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  mealsLogged: number;
}

export interface NutritionPeriodSummary {
  dailySummaries: DailySummary[];
  periodTotals: {
    avgCalories: number;
    avgProtein: number;
    avgCarbs: number;
    avgFat: number;
    adherencePercent: number;
  };
}

export interface WaterSummary {
  totalMl: number;
  goalMl: number;
  logs: Array<{ id: string; amount_ml: number; logged_at: string }>;
}
