export type ActivityLevel =
  | "sedentary"
  | "lightly_active"
  | "moderately_active"
  | "very_active"
  | "extra_active";

export type Goal =
  | "lose_weight"
  | "gain_muscle"
  | "maintain"
  | "improve_health";

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
};

export function calculateBMR(params: {
  weightKg: number;
  heightCm: number;
  age: number;
  gender: "male" | "female" | "other" | "prefer_not_to_say";
}): number {
  const { weightKg, heightCm, age, gender } = params;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === "male" ? base + 5 : base - 161;
}

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}

export function calculateCalorieTarget(tdee: number, goal: Goal): number {
  switch (goal) {
    case "lose_weight":
      return Math.max(1200, tdee - 500);
    case "gain_muscle":
      return tdee + 300;
    case "maintain":
      return tdee;
    case "improve_health":
      return tdee - 200;
  }
}

export function calculateMacros(calorieTarget: number) {
  return {
    protein: Math.round((calorieTarget * 0.3) / 4),
    carbs: Math.round((calorieTarget * 0.45) / 4),
    fat: Math.round((calorieTarget * 0.25) / 9),
  };
}

export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

export function getBMICategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: "Underweight", color: "#3b82f6" };
  if (bmi < 25) return { label: "Normal weight", color: "#22c55e" };
  if (bmi < 30) return { label: "Overweight", color: "#f97316" };
  return { label: "Obese", color: "#ef4444" };
}

export function calculateWaterGoalMl(weightKg: number): number {
  // 35ml per kg of body weight
  return Math.round(weightKg * 35);
}
