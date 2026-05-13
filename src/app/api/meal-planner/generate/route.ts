import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateMealPlan } from "@/lib/gemini/meal-planner";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  try {
    const plan = await generateMealPlan({
      calorieTarget: body.calorieTarget,
      cuisinePreferences: body.cuisinePreferences ?? [],
      dietaryRestrictions: body.dietaryRestrictions ?? [],
      allergies: body.allergies ?? [],
      availableIngredients: body.availableIngredients,
      budget: body.budget,
      daysToGenerate: body.daysToGenerate ?? 7,
    });

    return NextResponse.json({ success: true, plan });
  } catch (error) {
    console.error("Meal plan generation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate meal plan. Please try again." },
      { status: 500 }
    );
  }
}
