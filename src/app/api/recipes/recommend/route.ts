import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { recommendRecipes } from "@/lib/gemini/recipes";
import { searchRecipeImage } from "@/lib/nutrition/spoonacular";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { cuisineFilter, mealTypeFilter, ingredients, count = 6 } = body;

  // Get user profile for context
  const { data: profile } = await supabase
    .from("profiles")
    .select("goal, dietary_restrictions, allergies, cuisine_preferences")
    .eq("id", user.id)
    .single();

  // Get recent meal names to avoid repetition
  const { data: recentLogs } = await supabase
    .from("nutrition_logs")
    .select("meal_name")
    .eq("user_id", user.id)
    .order("logged_at", { ascending: false })
    .limit(10);

  const recentMealNames = recentLogs?.map((l) => l.meal_name) ?? [];

  try {
    const recipes = await recommendRecipes({
      cuisinePreferences: profile?.cuisine_preferences ?? ["nigerian", "any"],
      dietaryRestrictions: profile?.dietary_restrictions ?? [],
      allergies: profile?.allergies ?? [],
      goal: profile?.goal ?? "maintain",
      recentMealNames,
      ingredients,
      cuisineFilter,
      mealTypeFilter,
      count,
    });

    // Enrich with Spoonacular images (best-effort)
    const enriched = await Promise.all(
      recipes.map(async (recipe) => {
        const spoonacularImage = await searchRecipeImage(recipe.title);
        return { ...recipe, image_url: spoonacularImage };
      })
    );

    // Cache in Supabase (service role not needed — recipes are public-write from API routes)
    for (const recipe of enriched) {
      await supabase.from("recipes").insert({
        title: recipe.title,
        description: recipe.description,
        image_url: recipe.image_url,
        cuisine_type: recipe.cuisine_type,
        meal_type: recipe.meal_type,
        diet_tags: recipe.diet_tags,
        prep_time_min: recipe.prep_time_min,
        cook_time_min: recipe.cook_time_min,
        servings: recipe.servings,
        calories_per_serving: recipe.calories_per_serving,
        protein_g: recipe.protein_g,
        carbs_g: recipe.carbs_g,
        fat_g: recipe.fat_g,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        source: "gemini",
      }).select().single();
    }

    return NextResponse.json({ recipes: enriched });
  } catch (error) {
    console.error("Recipe recommendation error:", error);
    return NextResponse.json({ error: "Failed to recommend recipes" }, { status: 500 });
  }
}
