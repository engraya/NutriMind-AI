export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  createdAt?: Date;
}

export interface ChatUserContext {
  goals: string;
  dietaryRestrictions: string[];
  allergies: string[];
  cuisinePreferences: string[];
}
