import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, weekStart, planData, totalCaloriesAvg } = await request.json();

  // Deactivate other plans before setting this one active
  await supabase
    .from("meal_plans")
    .update({ is_active: false })
    .eq("user_id", user.id);

  const { data, error } = await supabase
    .from("meal_plans")
    .insert({
      user_id: user.id,
      title,
      week_start: weekStart,
      plan_data: planData,
      total_calories_avg: totalCaloriesAvg,
      is_active: true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, planId: data.id });
}
