import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") ?? "7d";
  const days = range === "30d" ? 30 : 7;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const [{ data: logs }, { data: profile }] = await Promise.all([
    supabase
      .from("nutrition_logs")
      .select("calories, protein_g, carbs_g, fat_g, logged_at")
      .eq("user_id", user.id)
      .gte("logged_at", since)
      .order("logged_at", { ascending: true }),
    supabase
      .from("profiles")
      .select("target_calories")
      .eq("id", user.id)
      .single(),
  ]);

  if (!logs) return NextResponse.json({ dailySummaries: [], periodTotals: {} });

  // Group by date
  const grouped: Record<string, { calories: number; protein: number; carbs: number; fat: number; count: number }> = {};

  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    const dateStr = d.toISOString().split("T")[0];
    grouped[dateStr] = { calories: 0, protein: 0, carbs: 0, fat: 0, count: 0 };
  }

  logs.forEach((log) => {
    const dateStr = log.logged_at.split("T")[0];
    if (grouped[dateStr]) {
      grouped[dateStr].calories += log.calories;
      grouped[dateStr].protein += log.protein_g ?? 0;
      grouped[dateStr].carbs += log.carbs_g ?? 0;
      grouped[dateStr].fat += log.fat_g ?? 0;
      grouped[dateStr].count += 1;
    }
  });

  const dailySummaries = Object.entries(grouped).map(([date, data]) => ({
    date,
    totalCalories: Math.round(data.calories),
    totalProtein: Math.round(data.protein),
    totalCarbs: Math.round(data.carbs),
    totalFat: Math.round(data.fat),
    mealsLogged: data.count,
  }));

  const activeDays = dailySummaries.filter((d) => d.mealsLogged > 0);
  const targetCalories = profile?.target_calories ?? 2000;

  const avgCalories = activeDays.length
    ? Math.round(activeDays.reduce((s, d) => s + d.totalCalories, 0) / activeDays.length)
    : 0;
  const avgProtein = activeDays.length
    ? Math.round(activeDays.reduce((s, d) => s + d.totalProtein, 0) / activeDays.length)
    : 0;
  const avgCarbs = activeDays.length
    ? Math.round(activeDays.reduce((s, d) => s + d.totalCarbs, 0) / activeDays.length)
    : 0;
  const avgFat = activeDays.length
    ? Math.round(activeDays.reduce((s, d) => s + d.totalFat, 0) / activeDays.length)
    : 0;

  const adherenceDays = activeDays.filter(
    (d) => Math.abs(d.totalCalories - targetCalories) <= targetCalories * 0.1
  ).length;
  const adherencePercent = activeDays.length
    ? Math.round((adherenceDays / activeDays.length) * 100)
    : 0;

  return NextResponse.json({
    dailySummaries,
    periodTotals: { avgCalories, avgProtein, avgCarbs, avgFat, adherencePercent },
  });
}
