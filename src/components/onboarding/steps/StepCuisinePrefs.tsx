"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ChefHat } from "lucide-react";
import type { OnboardingData } from "@/store/onboarding.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StepCuisinePrefsProps {
  data: OnboardingData;
  onUpdate: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const CUISINES = [
  { value: "nigerian", label: "Nigerian", emoji: "🇳🇬" },
  { value: "west_african", label: "West African", emoji: "🌍" },
  { value: "mediterranean", label: "Mediterranean", emoji: "🫒" },
  { value: "asian", label: "Asian", emoji: "🍜" },
  { value: "american", label: "American", emoji: "🍔" },
  { value: "european", label: "European", emoji: "🥐" },
  { value: "middle_eastern", label: "Middle Eastern", emoji: "🧆" },
  { value: "latin_american", label: "Latin American", emoji: "🌮" },
  { value: "indian", label: "Indian", emoji: "🍛" },
  { value: "east_african", label: "East African", emoji: "🌿" },
];

export function StepCuisinePrefs({ data, onUpdate, onNext, onBack }: StepCuisinePrefsProps) {
  const [selected, setSelected] = useState<string[]>(data.cuisine_preferences);
  const [error, setError] = useState("");

  const toggle = (value: string) => {
    setError("");
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
    );
  };

  const handleNext = () => {
    if (selected.length === 0) {
      setError("Please select at least one cuisine preference");
      return;
    }
    onUpdate({ cuisine_preferences: selected });
    onNext();
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="pb-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-100 flex items-center justify-center mb-2">
          <ChefHat className="h-6 w-6 text-brand-600" />
        </div>
        <CardTitle className="text-xl">What cuisines do you love?</CardTitle>
        <CardDescription>
          Your meal plans will feature foods from these traditions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-2">
          {CUISINES.map((cuisine) => {
            const isSelected = selected.includes(cuisine.value);
            return (
              <button
                key={cuisine.value}
                type="button"
                onClick={() => toggle(cuisine.value)}
                className={cn(
                  "p-3 rounded-xl border-2 text-left flex items-center gap-3 transition-all",
                  isSelected
                    ? "border-brand-600 bg-brand-50"
                    : "border-border hover:border-brand-300"
                )}
              >
                <span className="text-2xl">{cuisine.emoji}</span>
                <span className="text-sm font-medium">{cuisine.label}</span>
              </button>
            );
          })}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 h-11" onClick={onBack}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          <Button
            className="flex-1 h-11 bg-brand-600 hover:bg-brand-700 text-white"
            onClick={handleNext}
          >
            Continue
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
