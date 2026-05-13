"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Sparkles, Save, Calendar, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Profile } from "@/types/database";
import type { MealPlanData, DayPlan } from "@/types/meal-plan";

interface MealPlannerClientProps {
  profile: Profile | null;
  savedPlans: Array<{
    id: string;
    title: string;
    week_start: string;
    total_calories_avg: number | null;
    is_active: boolean;
    created_at: string;
  }>;
}

const MEAL_ICONS: Record<string, string> = {
  breakfast: "🌅",
  lunch: "☀️",
  dinner: "🌙",
  snack: "🍎",
};

function MealCard({ meal, type }: { meal: MealPlanData["days"][0]["meals"]["breakfast"]; type: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border border-border rounded-lg p-3 bg-card">
      <div
        className="flex items-start justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-sm">{MEAL_ICONS[type]}</span>
            <span className="text-xs text-muted-foreground capitalize font-medium">{type}</span>
          </div>
          <p className="text-sm font-semibold truncate">{meal.name}</p>
          <div className="flex gap-2 mt-1 flex-wrap">
            <span className="text-xs text-brand-600 font-medium">{meal.calories} kcal</span>
            <span className="text-xs text-muted-foreground">P: {meal.protein}g</span>
            <span className="text-xs text-muted-foreground">C: {meal.carbs}g</span>
            <span className="text-xs text-muted-foreground">F: {meal.fat}g</span>
          </div>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 shrink-0 mt-1" /> : <ChevronDown className="h-4 w-4 shrink-0 mt-1" />}
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 pt-2 border-t border-border space-y-2">
              <p className="text-xs text-muted-foreground">⏱ {meal.prep_time}</p>
              <div>
                <p className="text-xs font-medium mb-1">Ingredients:</p>
                <div className="flex flex-wrap gap-1">
                  {meal.ingredients.map((ing, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{ing}</Badge>
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{meal.instructions}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DayColumn({ day }: { day: DayPlan }) {
  return (
    <div className="space-y-2">
      <div className="sticky top-0 bg-background pb-1 z-10">
        <h3 className="text-sm font-bold">{day.day}</h3>
        <p className="text-xs text-muted-foreground">{day.day_totals.calories} kcal</p>
      </div>
      <MealCard meal={day.meals.breakfast} type="breakfast" />
      <MealCard meal={day.meals.lunch} type="lunch" />
      <MealCard meal={day.meals.dinner} type="dinner" />
      <MealCard meal={day.meals.snack} type="snack" />
    </div>
  );
}

export function MealPlannerClient({ profile, savedPlans }: MealPlannerClientProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<MealPlanData | null>(null);
  const [ingredientsInput, setIngredientsInput] = useState("");

  const calorieTarget = profile?.target_calories ?? 2000;
  const cuisinePrefs = profile?.cuisine_preferences ?? ["nigerian", "any"];
  const restrictions = profile?.dietary_restrictions ?? [];
  const allergies = profile?.allergies ?? [];

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const ingredients = ingredientsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/meal-planner/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calorieTarget,
          cuisinePreferences: cuisinePrefs,
          dietaryRestrictions: restrictions,
          allergies,
          availableIngredients: ingredients,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setCurrentPlan(data.plan);
      toast.success("Meal plan generated!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate plan");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!currentPlan) return;
    setIsSaving(true);
    try {
      const avgCalories = Math.round(
        currentPlan.days.reduce((sum, d) => sum + d.day_totals.calories, 0) / currentPlan.days.length
      );

      const res = await fetch("/api/meal-planner/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Week of ${currentPlan.days[0]?.date ?? new Date().toISOString().split("T")[0]}`,
          weekStart: currentPlan.days[0]?.date ?? new Date().toISOString().split("T")[0],
          planData: currentPlan,
          totalCaloriesAvg: avgCalories,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      toast.success("Meal plan saved!");
    } catch (error) {
      toast.error("Failed to save plan");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Generate form */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-brand-600" />
            Generate Weekly Meal Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="text-center">
              <p className="text-sm font-semibold">{calorieTarget.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">kcal target</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold capitalize">{profile?.goal?.replace("_", " ")}</p>
              <p className="text-xs text-muted-foreground">goal</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold">{cuisinePrefs.length}</p>
              <p className="text-xs text-muted-foreground">cuisines</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold">{allergies.length + restrictions.length}</p>
              <p className="text-xs text-muted-foreground">restrictions</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ingredients">Available ingredients (optional)</Label>
            <Input
              id="ingredients"
              placeholder="e.g. rice, tomatoes, chicken, eggs..."
              value={ingredientsInput}
              onChange={(e) => setIngredientsInput(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Separate with commas. AI will prioritize these.</p>
          </div>

          <div className="flex gap-3">
            <Button
              className="flex-1 bg-brand-600 hover:bg-brand-700 text-white"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {isGenerating ? "Generating..." : "Generate 7-Day Plan"}
            </Button>
            {currentPlan && (
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Plan
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Meal plan grid */}
      {isGenerating && (
        <Card>
          <CardContent className="py-16 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-brand-600 mx-auto mb-3" />
            <p className="text-sm font-medium">Generating your personalized meal plan...</p>
            <p className="text-xs text-muted-foreground mt-1">This takes 15-30 seconds</p>
          </CardContent>
        </Card>
      )}

      {currentPlan && !isGenerating && (
        <Tabs defaultValue={currentPlan.days[0]?.day ?? "Monday"}>
          <TabsList className="flex flex-wrap gap-1 h-auto mb-4">
            {currentPlan.days.map((day) => (
              <TabsTrigger key={day.day} value={day.day} className="text-xs">
                {day.day.slice(0, 3)}
              </TabsTrigger>
            ))}
          </TabsList>
          {currentPlan.days.map((day) => (
            <TabsContent key={day.day} value={day.day}>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <DayColumn day={day} />
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Saved plans */}
      {savedPlans.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Saved Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {savedPlans.map((plan) => (
                <div key={plan.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <p className="text-sm font-medium">{plan.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {plan.total_calories_avg} avg kcal/day
                    </p>
                  </div>
                  {plan.is_active && (
                    <Badge className="bg-brand-100 text-brand-700">Active</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
