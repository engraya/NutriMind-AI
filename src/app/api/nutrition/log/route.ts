import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { mealName, mealType, calories, proteinG, carbsG, fatG, fiberG, source, sourceId, imageUrl, notes } = body;

  if (!mealName || !calories) {
    return NextResponse.json({ error: "mealName and calories are required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("nutrition_logs")
    .insert({
      user_id: user.id,
      meal_name: mealName,
      meal_type: mealType,
      calories,
      protein_g: proteinG,
      carbs_g: carbsG,
      fat_g: fatG,
      fiber_g: fiberG,
      source,
      source_id: sourceId,
      image_url: imageUrl,
      notes,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, logId: data.id });
}
