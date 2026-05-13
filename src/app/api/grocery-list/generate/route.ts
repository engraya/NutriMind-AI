import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { MealPlanData, ShoppingItem } from "@/types/meal-plan";

function deduplicateItems(items: ShoppingItem[]): ShoppingItem[] {
  const map = new Map<string, ShoppingItem>();
  items.forEach((item) => {
    const key = item.ingredient.toLowerCase().trim();
    if (!map.has(key)) {
      map.set(key, { ...item });
    }
  });
  return Array.from(map.values());
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { mealPlanId } = await request.json();

  const { data: plan, error: planError } = await supabase
    .from("meal_plans")
    .select("plan_data, title, week_start")
    .eq("id", mealPlanId)
    .eq("user_id", user.id)
    .single();

  if (planError || !plan) {
    return NextResponse.json({ error: "Meal plan not found" }, { status: 404 });
  }

  const planData = plan.plan_data as MealPlanData;
  const rawItems: ShoppingItem[] = planData.shopping_list ?? [];

  // If no shopping_list in plan, extract from ingredients
  let items: ShoppingItem[];
  if (rawItems.length > 0) {
    items = deduplicateItems(rawItems).map((item) => ({
      ...item,
      checked: false,
    }));
  } else {
    // Fallback: collect all ingredients from meals
    const allIngredients = new Set<string>();
    planData.days?.forEach((day) => {
      Object.values(day.meals).forEach((meal) => {
        meal.ingredients?.forEach((ing: string) => allIngredients.add(ing));
      });
    });
    items = Array.from(allIngredients).map((name) => ({
      ingredient: name,
      quantity: "",
      category: "other",
      checked: false,
    }));
  }

  const { data: list, error } = await supabase
    .from("grocery_lists")
    .insert({
      user_id: user.id,
      meal_plan_id: mealPlanId,
      title: `Shopping list for ${plan.title}`,
      week_start: plan.week_start,
      items,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, listId: list.id, items });
}
