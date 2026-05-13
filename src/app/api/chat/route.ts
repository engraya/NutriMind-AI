import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createChatStream } from "@/lib/gemini/chat";
import type { ChatMessage, ChatUserContext } from "@/types/chat";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { messages, userContext }: { messages: ChatMessage[]; userContext: ChatUserContext } =
    await request.json();

  if (!messages || messages.length === 0) {
    return NextResponse.json({ error: "No messages provided" }, { status: 400 });
  }

  try {
    const stream = await createChatStream(messages, userContext);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Chat stream error:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
