import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, CalendarDays } from "lucide-react";
import type { NutritionLog } from "@/types/database";

interface RecentMealsCardProps {
  meals: NutritionLog[];
}

const MEAL_COLORS: Record<string, string> = {
  breakfast: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  lunch: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  dinner: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  snack: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

export function RecentMealsCard({ meals }: RecentMealsCardProps) {
  return (
    <Card className="shadow-soft hover:shadow-medium transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <UtensilsCrossed className="h-4 w-4 text-primary" />
          Recent Meals
        </CardTitle>
      </CardHeader>
      <CardContent>
        {meals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-3">
              <UtensilsCrossed className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium mb-1">No meals logged yet</p>
            <p className="text-xs text-muted-foreground mb-3 max-w-40">
              Log your first meal to start tracking your nutrition.
            </p>
            <Button size="sm" variant="outline" asChild>
              <Link href="/meal-planner">
                <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
                Browse meal plans
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {meals.map((meal) => (
              <div
                key={meal.id}
                className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{meal.meal_name}</p>
                  <Badge
                    variant="secondary"
                    className={`text-xs capitalize mt-0.5 ${
                      MEAL_COLORS[meal.meal_type ?? "snack"]
                    }`}
                  >
                    {meal.meal_type}
                  </Badge>
                </div>
                <span className="text-sm font-semibold text-primary shrink-0 tabular-nums">
                  {meal.calories} kcal
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
