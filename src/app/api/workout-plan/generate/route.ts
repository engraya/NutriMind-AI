import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { geminiFlash } from "@/lib/gemini/client";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("goal, activity_level")
    .eq("id", user.id)
    .single();

  const goal = profile?.goal ?? "maintain";
  const activityLevel = profile?.activity_level ?? "moderately_active";

  const prompt = `Generate a 7-day workout plan for someone with goal: "${goal}" and activity level: "${activityLevel}".

Return a JSON object:
{
  "days": [
    {
      "day": "string (Monday-Sunday)",
      "focus": "string (e.g. Upper Body, Cardio, Rest)",
      "estimated_duration_min": number,
      "exercises": [
        {
          "name": "string",
          "sets": number,
          "reps": "string (e.g. '10-12' or '30 seconds')",
          "rest_sec": number,
          "notes": "string"
        }
      ]
    }
  ],
  "notes": "string"
}

Include 1-2 rest days. For lose_weight focus on cardio + full body. For gain_muscle focus on strength splits. Respond with JSON only.`;

  try {
    const result = await geminiFlash.generateContent(prompt);
    let text = result.response.text().trim();
    text = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    const planData = JSON.parse(text);

    const today = new Date();
    const weekStart = today.toISOString().split("T")[0];

    const { data: saved, error } = await supabase
      .from("workout_plans")
      .insert({
        user_id: user.id,
        title: `Workout Plan — Week of ${weekStart}`,
        week_start: weekStart,
        plan_data: planData,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Workout plan save error:", error);
    }

    return NextResponse.json({ success: true, planData, planId: saved?.id });
  } catch (error) {
    console.error("Workout plan generation error:", error);
    return NextResponse.json({ error: "Failed to generate workout plan" }, { status: 500 });
  }
}
