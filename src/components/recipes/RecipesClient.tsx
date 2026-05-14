"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ChefHat, Loader2, Heart, Clock, Users, Filter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface Recipe {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  cuisine_type: string;
  meal_type: string;
  diet_tags: string[];
  prep_time_min: number;
  cook_time_min: number;
  servings: number;
  calories_per_serving: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

interface RecipesClientProps {
  userId: string;
  profile: {
    goal: string | null;
    dietary_restrictions: string[];
    allergies: string[];
    cuisine_preferences: string[];
  } | null;
  initialSavedIds: string[];
}

const CUISINE_OPTIONS = ["Any", "Nigerian", "West African", "Mediterranean", "Asian", "American", "European"];
const MEAL_TYPE_OPTIONS = ["Any", "breakfast", "lunch", "dinner", "snack"];
const DIET_OPTIONS = ["Any", "vegetarian", "vegan", "gluten-free", "low-carb", "high-protein"];

export function RecipesClient({ userId, profile, initialSavedIds }: RecipesClientProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set(initialSavedIds));
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [cuisine, setCuisine] = useState("Any");
  const [mealType, setMealType] = useState("Any");
  const [diet, setDiet] = useState("Any");

  const fetchRecipes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/recipes/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cuisineFilter: cuisine === "Any" ? undefined : cuisine,
          mealTypeFilter: mealType === "Any" ? undefined : mealType,
          diet: diet === "Any" ? undefined : diet,
          restrictions: profile?.dietary_restrictions ?? [],
          allergies: profile?.allergies ?? [],
          goal: profile?.goal ?? "general health",
          count: 9,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load recipes");
      setRecipes(data.recipes);
      setHasLoaded(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load recipes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleSave = async (recipeId: string) => {
    const isSaved = savedIds.has(recipeId);
    const next = new Set(savedIds);
    if (isSaved) {
      next.delete(recipeId);
    } else {
      next.add(recipeId);
    }
    setSavedIds(next);

    try {
      if (isSaved) {
        await fetch(`/api/recipes/${recipeId}/save`, { method: "DELETE" });
        toast.success("Recipe removed from saved");
      } else {
        await fetch(`/api/recipes/${recipeId}/save`, { method: "POST" });
        toast.success("Recipe saved!");
      }
    } catch {
      setSavedIds(savedIds); // revert on error
      toast.error("Failed to update saved recipes");
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Filter className="h-3 w-3" /> Cuisine
          </label>
          <Select value={cuisine} onValueChange={setCuisine}>
            <SelectTrigger className="w-36 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CUISINE_OPTIONS.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Meal Type</label>
          <Select value={mealType} onValueChange={setMealType}>
            <SelectTrigger className="w-32 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MEAL_TYPE_OPTIONS.map((m) => (
                <SelectItem key={m} value={m} className="capitalize">{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Diet</label>
          <Select value={diet} onValueChange={setDiet}>
            <SelectTrigger className="w-36 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DIET_OPTIONS.map((d) => (
                <SelectItem key={d} value={d} className="capitalize">{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={fetchRecipes}
          disabled={isLoading}
          className="bg-brand-600 hover:bg-brand-700 text-white h-9"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
          ) : (
            <ChefHat className="h-4 w-4 mr-1.5" />
          )}
          Find Recipes
        </Button>
      </div>

      {/* Loading skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-40 w-full" />
              <CardContent className="pt-3 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty / initial state */}
      {!isLoading && !hasLoaded && (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center mx-auto mb-4">
              <ChefHat className="h-8 w-8 text-brand-600" />
            </div>
            <h3 className="font-semibold mb-1">Discover Recipes</h3>
            <p className="text-sm text-muted-foreground">
              Choose your preferences above and click "Find Recipes" to get AI-powered recommendations
            </p>
          </CardContent>
        </Card>
      )}

      {/* Recipe grid */}
      <AnimatePresence>
        {!isLoading && recipes.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {recipes.map((recipe, i) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="overflow-hidden group hover:shadow-md transition-shadow h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-40 bg-muted shrink-0">
                    {recipe.image_url ? (
                      <Image
                        src={recipe.image_url}
                        alt={recipe.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ChefHat className="h-10 w-10 text-muted-foreground/30" />
                      </div>
                    )}
                    <button
                      onClick={() => toggleSave(recipe.id)}
                      className="absolute top-2 right-2 p-1.5 bg-background/90 rounded-full"
                    >
                      <Heart
                        className={`h-4 w-4 transition-colors ${
                          savedIds.has(recipe.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"
                        }`}
                      />
                    </button>
                    <Badge className="absolute top-2 left-2 text-xs bg-background/90 text-foreground">
                      {recipe.cuisine_type}
                    </Badge>
                  </div>

                  <CardContent className="pt-3 pb-4 flex-1 flex flex-col">
                    <Link href={`/recipes/${recipe.id}`} className="group-hover:text-brand-600 transition-colors">
                      <h3 className="font-semibold text-sm leading-snug mb-1 line-clamp-2">{recipe.title}</h3>
                    </Link>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">{recipe.description}</p>

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {recipe.prep_time_min + recipe.cook_time_min}m
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {recipe.servings} servings
                      </span>
                      <span className="text-brand-600 font-medium ml-auto">
                        {recipe.calories_per_serving} kcal
                      </span>
                    </div>

                    {/* Macros */}
                    <div className="flex gap-2 text-xs">
                      <span className="text-muted-foreground">P: <b>{recipe.protein_g}g</b></span>
                      <span className="text-muted-foreground">C: <b>{recipe.carbs_g}g</b></span>
                      <span className="text-muted-foreground">F: <b>{recipe.fat_g}g</b></span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* No results */}
      {!isLoading && hasLoaded && recipes.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground text-sm">No recipes found for those filters. Try adjusting your preferences.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
