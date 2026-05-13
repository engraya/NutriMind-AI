import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  calculateBMR,
  calculateTDEE,
  calculateCalorieTarget,
  calculateMacros,
} from "@/lib/nutrition/calculations";
import type { ActivityLevel, Goal } from "@/lib/nutrition/calculations";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile });
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Auto-calculate targets when physical stats and goal are provided
  let targets: {
    target_calories?: number;
    target_protein?: number;
    target_carbs?: number;
    target_fat?: number;
  } = {};

  if (body.weight_kg && body.height_cm && body.age && body.gender && body.goal && body.activity_level) {
    const bmr = calculateBMR({
      weightKg: body.weight_kg,
      heightCm: body.height_cm,
      age: body.age,
      gender: body.gender,
    });
    const tdee = calculateTDEE(bmr, body.activity_level as ActivityLevel);
    const calorieTarget = calculateCalorieTarget(tdee, body.goal as Goal);
    const macros = calculateMacros(calorieTarget);

    targets = {
      target_calories: calorieTarget,
      target_protein: macros.protein,
      target_carbs: macros.carbs,
      target_fat: macros.fat,
    };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .update({ ...body, ...targets })
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile });
}
