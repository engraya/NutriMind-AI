import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Users, ChefHat } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Recipe } from "@/types/database";
import { RecipeSaveButton } from "@/components/recipes/RecipeSaveButton";

export const dynamic = "force-dynamic";

interface Ingredient {
  item: string;
  amount: string;
  unit: string;
}

interface Instruction {
  step: number;
  text: string;
}

export default async function RecipeDetailPage({ params }: { params: Promise<{ recipeId: string }> }) {
  const { recipeId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: rawRecipe } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", recipeId)
    .single();

  const recipe = rawRecipe as Recipe | null;
  if (!recipe) notFound();

  const { data: rawSaved } = await supabase
    .from("saved_recipes")
    .select("recipe_id")
    .eq("user_id", user.id)
    .eq("recipe_id", recipe.id)
    .single();

  const saved = rawSaved as { recipe_id: string } | null;

  const ingredients = (recipe.ingredients as unknown as Ingredient[]) ?? [];
  const instructions = (recipe.instructions as unknown as Instruction[]) ?? [];
  const totalTime = (recipe.prep_time_min ?? 0) + (recipe.cook_time_min ?? 0);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back */}
      <Link href="/recipes" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Recipes
      </Link>

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden bg-muted h-56">
        {recipe.image_url ? (
          <Image src={recipe.image_url} alt={recipe.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ChefHat className="h-16 w-16 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex gap-2 mb-2 flex-wrap">
            <Badge className="bg-brand-600 text-white capitalize">{recipe.cuisine_type}</Badge>
            <Badge variant="secondary" className="capitalize">{recipe.meal_type}</Badge>
            {(recipe.diet_tags as string[] | null)?.map((tag) => (
              <Badge key={tag} variant="outline" className="text-white border-white/50 capitalize">{tag}</Badge>
            ))}
          </div>
          <h1 className="text-xl font-bold text-white">{recipe.title}</h1>
        </div>
      </div>

      {/* Meta + Save */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {totalTime} min</span>
          <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {recipe.servings} servings</span>
        </div>
        <RecipeSaveButton recipeId={recipe.id} initialSaved={!!saved} />
      </div>

      {/* Description */}
      {recipe.description && (
        <p className="text-sm text-muted-foreground">{recipe.description}</p>
      )}

      {/* Nutrition */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Nutrition per Serving</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3 text-center">
            {[
              { label: "Calories", value: recipe.calories_per_serving, unit: "kcal", color: "text-brand-600" },
              { label: "Protein", value: recipe.protein_g, unit: "g", color: "text-blue-600" },
              { label: "Carbs", value: recipe.carbs_g, unit: "g", color: "text-amber-600" },
              { label: "Fat", value: recipe.fat_g, unit: "g", color: "text-purple-600" },
            ].map((n) => (
              <div key={n.label} className="p-2 rounded-lg bg-muted/50">
                <p className={`text-lg font-bold ${n.color}`}>{n.value}</p>
                <p className="text-xs text-muted-foreground">{n.unit}</p>
                <p className="text-xs font-medium">{n.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ingredients */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {ingredients.map((ing, i) => (
                <li key={i} className="flex items-baseline gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0 mt-1.5" />
                  <span className="text-muted-foreground">{ing.amount} {ing.unit}</span>
                  <span>{ing.item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {instructions.map((inst) => (
                <li key={inst.step} className="flex gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {inst.step}
                  </span>
                  <p className="text-muted-foreground leading-relaxed">{inst.text}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
