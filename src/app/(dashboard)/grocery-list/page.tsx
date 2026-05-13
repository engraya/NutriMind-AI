import { createClient } from "@/lib/supabase/server";
import { GroceryListClient } from "@/components/grocery-list/GroceryListClient";

export const dynamic = "force-dynamic";

export default async function GroceryListPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: activePlan } = await supabase
    .from("meal_plans")
    .select("id, title, week_start")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single();

  const { data: groceryList } = await supabase
    .from("grocery_lists")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return (
    <GroceryListClient
      userId={user.id}
      activePlan={activePlan ?? null}
      initialList={groceryList ?? null}
    />
  );
}
