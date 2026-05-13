import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{ recipeId: string }>;
}

export async function GET(_req: Request, { params }: RouteContext) {
  const { recipeId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", recipeId)
    .single();

  if (error || !data) return NextResponse.json({ error: "Recipe not found" }, { status: 404 });

  // Check if saved
  const { data: saved } = await supabase
    .from("saved_recipes")
    .select("recipe_id")
    .eq("user_id", user.id)
    .eq("recipe_id", recipeId)
    .single();

  return NextResponse.json({ recipe: data, isSaved: !!saved });
}
