import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UtensilsCrossed } from "lucide-react";
import type { NutritionLog } from "@/types/database";

interface RecentMealsCardProps {
  meals: NutritionLog[];
}

const MEAL_COLORS: Record<string, string> = {
  breakfast: "bg-yellow-100 text-yellow-700",
  lunch: "bg-blue-100 text-blue-700",
  dinner: "bg-purple-100 text-purple-700",
  snack: "bg-orange-100 text-orange-700",
};

export function RecentMealsCard({ meals }: RecentMealsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <UtensilsCrossed className="h-4 w-4 text-brand-600" />
          Recent Meals
        </CardTitle>
      </CardHeader>
      <CardContent>
        {meals.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No meals logged today
          </p>
        ) : (
          <div className="space-y-2">
            {meals.map((meal) => (
              <div key={meal.id} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{meal.meal_name}</p>
                  <Badge
                    variant="secondary"
                    className={`text-xs capitalize ${MEAL_COLORS[meal.meal_type ?? "snack"]}`}
                  >
                    {meal.meal_type}
                  </Badge>
                </div>
                <span className="text-sm font-semibold text-brand-600 shrink-0">
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
