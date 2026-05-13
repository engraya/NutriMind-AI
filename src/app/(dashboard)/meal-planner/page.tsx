import { createClient } from "@/lib/supabase/server";
import { MealPlannerClient } from "@/components/meal-planner/MealPlannerClient";

export const dynamic = "force-dynamic";

export default async function MealPlannerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: profile }, { data: savedPlans }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("meal_plans")
      .select("id, title, week_start, total_calories_avg, is_active, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  return (
    <MealPlannerClient
      profile={profile}
      savedPlans={savedPlans ?? []}
    />
  );
}
