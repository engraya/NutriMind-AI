export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          age: number | null;
          gender: "male" | "female" | "other" | "prefer_not_to_say" | null;
          height_cm: number | null;
          weight_kg: number | null;
          goal: "lose_weight" | "gain_muscle" | "maintain" | "improve_health" | null;
          activity_level: "sedentary" | "lightly_active" | "moderately_active" | "very_active" | "extra_active" | null;
          target_calories: number | null;
          target_protein: number | null;
          target_carbs: number | null;
          target_fat: number | null;
          allergies: string[] | null;
          dietary_restrictions: string[] | null;
          cuisine_preferences: string[] | null;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          age?: number | null;
          gender?: "male" | "female" | "other" | "prefer_not_to_say" | null;
          height_cm?: number | null;
          weight_kg?: number | null;
          goal?: "lose_weight" | "gain_muscle" | "maintain" | "improve_health" | null;
          activity_level?: "sedentary" | "lightly_active" | "moderately_active" | "very_active" | "extra_active" | null;
          target_calories?: number | null;
          target_protein?: number | null;
          target_carbs?: number | null;
          target_fat?: number | null;
          allergies?: string[] | null;
          dietary_restrictions?: string[] | null;
          cuisine_preferences?: string[] | null;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          age?: number | null;
          gender?: "male" | "female" | "other" | "prefer_not_to_say" | null;
          height_cm?: number | null;
          weight_kg?: number | null;
          goal?: "lose_weight" | "gain_muscle" | "maintain" | "improve_health" | null;
          activity_level?: "sedentary" | "lightly_active" | "moderately_active" | "very_active" | "extra_active" | null;
          target_calories?: number | null;
          target_protein?: number | null;
          target_carbs?: number | null;
          target_fat?: number | null;
          allergies?: string[] | null;
          dietary_restrictions?: string[] | null;
          cuisine_preferences?: string[] | null;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      meal_plans: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          week_start: string;
          plan_data: Json;
          total_calories_avg: number | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          week_start: string;
          plan_data: Json;
          total_calories_avg?: number | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          week_start?: string;
          plan_data?: Json;
          total_calories_avg?: number | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      nutrition_logs: {
        Row: {
          id: string;
          user_id: string;
          meal_name: string;
          meal_type: "breakfast" | "lunch" | "dinner" | "snack";
          logged_at: string;
          calories: number;
          protein_g: number | null;
          carbs_g: number | null;
          fat_g: number | null;
          fiber_g: number | null;
          source: "manual" | "meal_plan" | "fridge_scan" | "recipe" | null;
          source_id: string | null;
          notes: string | null;
          image_url: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          meal_name: string;
          meal_type: "breakfast" | "lunch" | "dinner" | "snack";
          logged_at?: string;
          calories: number;
          protein_g?: number | null;
          carbs_g?: number | null;
          fat_g?: number | null;
          fiber_g?: number | null;
          source?: "manual" | "meal_plan" | "fridge_scan" | "recipe" | null;
          source_id?: string | null;
          notes?: string | null;
          image_url?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          meal_name?: string;
          meal_type?: "breakfast" | "lunch" | "dinner" | "snack";
          logged_at?: string;
          calories?: number;
          protein_g?: number | null;
          carbs_g?: number | null;
          fat_g?: number | null;
          fiber_g?: number | null;
          source?: "manual" | "meal_plan" | "fridge_scan" | "recipe" | null;
          source_id?: string | null;
          notes?: string | null;
          image_url?: string | null;
        };
      };
      water_logs: {
        Row: {
          id: string;
          user_id: string;
          amount_ml: number;
          logged_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount_ml: number;
          logged_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount_ml?: number;
          logged_at?: string;
        };
      };
      fridge_scans: {
        Row: {
          id: string;
          user_id: string;
          image_url: string;
          cloudinary_id: string;
          detected_ingredients: Json | null;
          suggested_meals: Json | null;
          nutrition_info: Json | null;
          scanned_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          image_url: string;
          cloudinary_id: string;
          detected_ingredients?: Json | null;
          suggested_meals?: Json | null;
          nutrition_info?: Json | null;
          scanned_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          image_url?: string;
          cloudinary_id?: string;
          detected_ingredients?: Json | null;
          suggested_meals?: Json | null;
          nutrition_info?: Json | null;
          scanned_at?: string;
        };
      };
      recipes: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          image_url: string | null;
          cuisine_type: string | null;
          meal_type: string | null;
          diet_tags: string[] | null;
          prep_time_min: number | null;
          cook_time_min: number | null;
          servings: number | null;
          calories_per_serving: number | null;
          protein_g: number | null;
          carbs_g: number | null;
          fat_g: number | null;
          ingredients: Json;
          instructions: Json;
          source: "gemini" | "spoonacular" | "manual" | null;
          source_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          image_url?: string | null;
          cuisine_type?: string | null;
          meal_type?: string | null;
          diet_tags?: string[] | null;
          prep_time_min?: number | null;
          cook_time_min?: number | null;
          servings?: number | null;
          calories_per_serving?: number | null;
          protein_g?: number | null;
          carbs_g?: number | null;
          fat_g?: number | null;
          ingredients: Json;
          instructions: Json;
          source?: "gemini" | "spoonacular" | "manual" | null;
          source_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          image_url?: string | null;
          cuisine_type?: string | null;
          meal_type?: string | null;
          diet_tags?: string[] | null;
          prep_time_min?: number | null;
          cook_time_min?: number | null;
          servings?: number | null;
          calories_per_serving?: number | null;
          protein_g?: number | null;
          carbs_g?: number | null;
          fat_g?: number | null;
          ingredients?: Json;
          instructions?: Json;
          source?: "gemini" | "spoonacular" | "manual" | null;
          source_id?: string | null;
          created_at?: string;
        };
      };
      saved_recipes: {
        Row: {
          user_id: string;
          recipe_id: string;
          saved_at: string;
        };
        Insert: {
          user_id: string;
          recipe_id: string;
          saved_at?: string;
        };
        Update: {
          user_id?: string;
          recipe_id?: string;
          saved_at?: string;
        };
      };
      grocery_lists: {
        Row: {
          id: string;
          user_id: string;
          meal_plan_id: string | null;
          title: string;
          week_start: string | null;
          items: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          meal_plan_id?: string | null;
          title: string;
          week_start?: string | null;
          items: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          meal_plan_id?: string | null;
          title?: string;
          week_start?: string | null;
          items?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      chat_sessions: {
        Row: {
          id: string;
          user_id: string;
          title: string | null;
          messages: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string | null;
          messages?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string | null;
          messages?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      workout_plans: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          week_start: string;
          plan_data: Json;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          week_start: string;
          plan_data: Json;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          week_start?: string;
          plan_data?: Json;
          is_active?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type MealPlan = Database["public"]["Tables"]["meal_plans"]["Row"];
export type NutritionLog = Database["public"]["Tables"]["nutrition_logs"]["Row"];
export type WaterLog = Database["public"]["Tables"]["water_logs"]["Row"];
export type FridgeScan = Database["public"]["Tables"]["fridge_scans"]["Row"];
export type Recipe = Database["public"]["Tables"]["recipes"]["Row"];
export type GroceryList = Database["public"]["Tables"]["grocery_lists"]["Row"];
export type ChatSession = Database["public"]["Tables"]["chat_sessions"]["Row"];
export type WorkoutPlan = Database["public"]["Tables"]["workout_plans"]["Row"];
