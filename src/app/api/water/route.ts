import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { amountMl } = await request.json();
  if (!amountMl || amountMl <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("water_logs")
    .insert({ user_id: user.id, amount_ml: amountMl })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Return updated daily total
  const today = new Date().toISOString().split("T")[0];
  const { data: todayLogs } = await supabase
    .from("water_logs")
    .select("amount_ml")
    .eq("user_id", user.id)
    .gte("logged_at", `${today}T00:00:00`);

  const todayTotal = todayLogs?.reduce((sum, l) => sum + l.amount_ml, 0) ?? amountMl;

  return NextResponse.json({ success: true, logId: data.id, todayTotal });
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const today = new Date().toISOString().split("T")[0];
  const { data: logs } = await supabase
    .from("water_logs")
    .select("*")
    .eq("user_id", user.id)
    .gte("logged_at", `${today}T00:00:00`)
    .order("logged_at", { ascending: false });

  const total = logs?.reduce((sum, l) => sum + l.amount_ml, 0) ?? 0;

  return NextResponse.json({ total, logs: logs ?? [] });
}
