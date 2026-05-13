import { create } from "zustand";

export interface OnboardingData {
  // Step 1: Personal Info
  full_name: string;
  age: number | null;
  gender: "male" | "female" | "other" | "prefer_not_to_say" | null;
  height_cm: number | null;
  weight_kg: number | null;
  // Step 2: Fitness Goals
  goal: "lose_weight" | "gain_muscle" | "maintain" | "improve_health" | null;
  activity_level: "sedentary" | "lightly_active" | "moderately_active" | "very_active" | "extra_active" | null;
  // Step 3: Dietary Needs
  allergies: string[];
  dietary_restrictions: string[];
  // Step 4: Cuisine Preferences
  cuisine_preferences: string[];
}

interface OnboardingStore {
  data: OnboardingData;
  currentStep: number;
  setStep: (step: number) => void;
  updateData: (updates: Partial<OnboardingData>) => void;
  reset: () => void;
}

const defaultData: OnboardingData = {
  full_name: "",
  age: null,
  gender: null,
  height_cm: null,
  weight_kg: null,
  goal: null,
  activity_level: null,
  allergies: [],
  dietary_restrictions: [],
  cuisine_preferences: [],
};

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  data: defaultData,
  currentStep: 1,
  setStep: (step) => set({ currentStep: step }),
  updateData: (updates) =>
    set((state) => ({ data: { ...state.data, ...updates } })),
  reset: () => set({ data: defaultData, currentStep: 1 }),
}));
