import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{ listId: string }>;
}

export async function GET(_req: Request, { params }: RouteContext) {
  const { listId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("grocery_lists")
    .select("*")
    .eq("id", listId)
    .eq("user_id", user.id)
    .single();

  if (error || !data) return NextResponse.json({ error: "List not found" }, { status: 404 });

  return NextResponse.json({ list: data });
}

export async function PUT(request: Request, { params }: RouteContext) {
  const { listId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { items } = await request.json();

  const { error } = await supabase
    .from("grocery_lists")
    .update({ items })
    .eq("id", listId)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
