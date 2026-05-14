import { genAI } from "./client";
import type { ChatMessage, ChatUserContext } from "@/types/chat";

function buildSystemInstruction(userContext: ChatUserContext): string {
  return `You are NutriMind, a friendly and knowledgeable AI nutrition assistant.

User profile:
- Health goal: ${userContext.goals || "general health"}
- Dietary restrictions: ${userContext.dietaryRestrictions.length ? userContext.dietaryRestrictions.join(", ") : "none"}
- Allergies: ${userContext.allergies.length ? userContext.allergies.join(", ") : "none"}
- Cuisine preferences: ${userContext.cuisinePreferences.length ? userContext.cuisinePreferences.join(", ") : "varied"}

Your specialties:
- Nigerian cuisine nutrition (Jollof Rice, Egusi Soup, Moi Moi, Suya, Pepper Soup, Ofada Stew, Akara, Puff Puff)
- Macro and calorie tracking
- Healthier meal substitutions
- Hydration advice
- Meal planning suggestions

Keep responses concise, practical, and encouraging. Use bullet points for lists.
Never suggest foods that conflict with the user's allergies or dietary restrictions.`;
}

export async function createChatStream(
  messages: ChatMessage[],
  userContext: ChatUserContext
): Promise<ReadableStream<Uint8Array>> {
  const systemInstruction = buildSystemInstruction(userContext);

  // All messages except the last one form the history
  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === "user" ? ("user" as const) : ("model" as const),
    parts: [{ text: m.content }],
  }));

  const lastMessage = messages[messages.length - 1];

  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    systemInstruction,
  });

  const chat = model.startChat({ history });

  const result = await chat.sendMessageStream(lastMessage.content);

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(new TextEncoder().encode(text));
          }
        }
        controller.close();
      } catch (error) {
        controller.enqueue(
          new TextEncoder().encode("\n[ERROR] Something went wrong. Please try again.")
        );
        controller.close();
      }
    },
  });
}
