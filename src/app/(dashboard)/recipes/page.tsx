import { createClient } from "@/lib/supabase/server";
import { RecipesClient } from "@/components/recipes/RecipesClient";

export const dynamic = "force-dynamic";

interface SavedRecipeRow {
  recipe_id: string;
}

export default async function RecipesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: rawProfile } = await supabase
    .from("profiles")
    .select("goal, dietary_restrictions, allergies, cuisine_preferences")
    .eq("id", user.id)
    .single();

  const rawTyped = rawProfile as {
    goal: string | null;
    dietary_restrictions: string[] | null;
    allergies: string[] | null;
    cuisine_preferences: string[] | null;
  } | null;

  const profile = rawTyped
    ? {
        goal: rawTyped.goal,
        dietary_restrictions: rawTyped.dietary_restrictions ?? [],
        allergies: rawTyped.allergies ?? [],
        cuisine_preferences: rawTyped.cuisine_preferences ?? [],
      }
    : null;

  const { data: rawSaved } = await supabase
    .from("saved_recipes")
    .select("recipe_id")
    .eq("user_id", user.id);

  const savedRecipes = (rawSaved ?? []) as SavedRecipeRow[];
  const savedIds = new Set(savedRecipes.map((r) => r.recipe_id));

  return (
    <RecipesClient
      userId={user.id}
      profile={profile ?? null}
      initialSavedIds={Array.from(savedIds)}
    />
  );
}
