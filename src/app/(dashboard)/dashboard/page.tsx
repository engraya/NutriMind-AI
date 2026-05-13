import { createClient } from "@/lib/supabase/server";
import type { Profile, NutritionLog, WaterLog } from "@/types/database";
import { CalorieSummaryCard } from "@/components/dashboard/CalorieSummaryCard";
import { MacroBreakdownCard } from "@/components/dashboard/MacroBreakdownCard";
import { WaterIntakeCard } from "@/components/dashboard/WaterIntakeCard";
import { RecentMealsCard } from "@/components/dashboard/RecentMealsCard";
import { QuickActionsCard } from "@/components/dashboard/QuickActionsCard";
import { WeeklySummaryCard } from "@/components/dashboard/WeeklySummaryCard";

export const dynamic = "force-dynamic";

async function getDashboardData(userId: string) {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const [profileRes, todayLogsRes, waterLogsRes, recentMealsRes, weeklyLogsRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).single(),
    supabase
      .from("nutrition_logs")
      .select("calories, protein_g, carbs_g, fat_g")
      .eq("user_id", userId)
      .gte("logged_at", `${today}T00:00:00`)
      .lte("logged_at", `${today}T23:59:59`),
    supabase
      .from("water_logs")
      .select("amount_ml")
      .eq("user_id", userId)
      .gte("logged_at", `${today}T00:00:00`),
    supabase
      .from("nutrition_logs")
      .select("*")
      .eq("user_id", userId)
      .order("logged_at", { ascending: false })
      .limit(3),
    supabase
      .from("nutrition_logs")
      .select("calories, logged_at")
      .eq("user_id", userId)
      .gte("logged_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order("logged_at", { ascending: true }),
  ]);

  const profile = profileRes.data as Profile | null;
  const todayLogs = (todayLogsRes.data ?? []) as Pick<NutritionLog, "calories" | "protein_g" | "carbs_g" | "fat_g">[];
  const waterLogs = (waterLogsRes.data ?? []) as Pick<WaterLog, "amount_ml">[];
  const recentMeals = (recentMealsRes.data ?? []) as NutritionLog[];
  const weeklyLogs = (weeklyLogsRes.data ?? []) as Pick<NutritionLog, "calories" | "logged_at">[];

  const todayCalories = todayLogs.reduce((sum, log) => sum + log.calories, 0);
  const todayProtein = todayLogs.reduce((sum, log) => sum + (log.protein_g ?? 0), 0);
  const todayCarbs = todayLogs.reduce((sum, log) => sum + (log.carbs_g ?? 0), 0);
  const todayFat = todayLogs.reduce((sum, log) => sum + (log.fat_g ?? 0), 0);
  const todayWater = waterLogs.reduce((sum, log) => sum + log.amount_ml, 0);

  const weeklyData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayLogs = weeklyLogs.filter((l) => l.logged_at.startsWith(dateStr));
    weeklyData.push({
      date: d.toLocaleDateString("en-US", { weekday: "short" }),
      calories: dayLogs.reduce((s, l) => s + l.calories, 0),
    });
  }

  return {
    profile,
    today: { calories: todayCalories, protein: todayProtein, carbs: todayCarbs, fat: todayFat },
    water: todayWater,
    recentMeals,
    weeklyData,
  };
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { profile, today, water, recentMeals, weeklyData } = await getDashboardData(user.id);

  const targetCalories = profile?.target_calories ?? 2000;
  const targetProtein = profile?.target_protein ?? 150;
  const targetCarbs = profile?.target_carbs ?? 225;
  const targetFat = profile?.target_fat ?? 55;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"} 👋
        </h2>
        <p className="text-muted-foreground text-sm mt-0.5">
          Here&apos;s your nutrition overview for today
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CalorieSummaryCard consumed={today.calories} target={targetCalories} />
        <MacroBreakdownCard
          consumed={{ protein: today.protein, carbs: today.carbs, fat: today.fat }}
          targets={{ protein: targetProtein, carbs: targetCarbs, fat: targetFat }}
        />
        <WaterIntakeCard
          totalMl={water}
          goalMl={profile?.weight_kg ? Math.round(profile.weight_kg * 35) : 2500}
          userId={user.id}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <WeeklySummaryCard data={weeklyData} targetCalories={targetCalories} />
        </div>
        <div className="space-y-4">
          <RecentMealsCard meals={recentMeals} />
          <QuickActionsCard />
        </div>
      </div>
    </div>
  );
}
