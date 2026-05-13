import { createClient } from "@/lib/supabase/server";
import { WorkoutPlanClient } from "@/components/workout/WorkoutPlanClient";

export const dynamic = "force-dynamic";

export default async function WorkoutPlanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("goal, activity_level, weight_kg, height_cm, age, gender")
    .eq("id", user.id)
    .single();

  const { data: latestPlan } = await supabase
    .from("workout_plans")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return (
    <WorkoutPlanClient
      userId={user.id}
      profile={profile ?? null}
      initialPlan={latestPlan ?? null}
    />
  );
}
