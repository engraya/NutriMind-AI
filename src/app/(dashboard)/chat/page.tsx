import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";
import { ChatInterface } from "@/components/chat/ChatInterface";

export const dynamic = "force-dynamic";

export default async function ChatPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: rawProfile } = await supabase
    .from("profiles")
    .select("goal, dietary_restrictions, allergies, cuisine_preferences")
    .eq("id", user.id)
    .single();

  const profile = rawProfile as Pick<Profile, "goal" | "dietary_restrictions" | "allergies" | "cuisine_preferences"> | null;

  const userContext = {
    goals: profile?.goal?.replace("_", " ") ?? "general health",
    dietaryRestrictions: profile?.dietary_restrictions ?? [],
    allergies: profile?.allergies ?? [],
    cuisinePreferences: profile?.cuisine_preferences ?? [],
  };

  return <ChatInterface userContext={userContext} />;
}
