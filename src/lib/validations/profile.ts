import { z } from "zod";

export const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().int().min(13).max(120),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]),
  height_cm: z.number().min(100).max(250),
  weight_kg: z.number().min(30).max(300),
  goal: z.enum(["lose_weight", "gain_muscle", "maintain", "improve_health"]),
  activity_level: z.enum([
    "sedentary",
    "lightly_active",
    "moderately_active",
    "very_active",
    "extra_active",
  ]),
  allergies: z.array(z.string()).default([]),
  dietary_restrictions: z.array(z.string()).default([]),
  cuisine_preferences: z.array(z.string()).default([]),
});

export const personalInfoSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().int().min(13, "Must be at least 13").max(120),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]),
  height_cm: z.number().min(100, "Height must be at least 100cm").max(250),
  weight_kg: z.number().min(30, "Weight must be at least 30kg").max(300),
});

export const fitnessGoalSchema = z.object({
  goal: z.enum(["lose_weight", "gain_muscle", "maintain", "improve_health"]),
  activity_level: z.enum([
    "sedentary",
    "lightly_active",
    "moderately_active",
    "very_active",
    "extra_active",
  ]),
});

export const dietarySchema = z.object({
  allergies: z.array(z.string()).default([]),
  dietary_restrictions: z.array(z.string()).default([]),
});

export const cuisineSchema = z.object({
  cuisine_preferences: z.array(z.string()).min(1, "Select at least one cuisine"),
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;
export type FitnessGoalInput = z.infer<typeof fitnessGoalSchema>;
export type DietaryInput = z.infer<typeof dietarySchema>;
export type CuisineInput = z.infer<typeof cuisineSchema>;
