import { create } from "zustand";
import type { MealPlanData } from "@/types/meal-plan";

interface MealPlanStore {
  activePlan: MealPlanData | null;
  activePlanId: string | null;
  setActivePlan: (plan: MealPlanData, id: string) => void;
  clearActivePlan: () => void;
}

export const useMealPlanStore = create<MealPlanStore>((set) => ({
  activePlan: null,
  activePlanId: null,
  setActivePlan: (plan, id) => set({ activePlan: plan, activePlanId: id }),
  clearActivePlan: () => set({ activePlan: null, activePlanId: null }),
}));
