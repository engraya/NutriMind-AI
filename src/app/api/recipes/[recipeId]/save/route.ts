import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ recipeId: string }>;
}

export async function POST(_req: Request, { params }: RouteContext) {
  const { recipeId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("saved_recipes")
    .upsert({ user_id: user.id, recipe_id: recipeId }, { onConflict: "user_id,recipe_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  const { recipeId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("saved_recipes")
    .delete()
    .eq("user_id", user.id)
    .eq("recipe_id", recipeId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
