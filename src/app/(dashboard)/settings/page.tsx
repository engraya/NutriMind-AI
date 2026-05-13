import { createClient } from "@/lib/supabase/server";
import { SettingsClient } from "@/components/settings/SettingsClient";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  return <SettingsClient userId={user.id} email={user.email ?? ""} />;
}
