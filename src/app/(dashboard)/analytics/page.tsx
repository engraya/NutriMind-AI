import { createClient } from "@/lib/supabase/server";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("target_calories, target_protein, target_carbs, target_fat, weight_kg")
    .eq("id", user.id)
    .single();

  return <AnalyticsDashboard userId={user.id} profile={profile} />;
}
