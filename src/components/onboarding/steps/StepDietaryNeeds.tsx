"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Leaf } from "lucide-react";
import type { OnboardingData } from "@/store/onboarding.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StepDietaryNeedsProps {
  data: OnboardingData;
  onUpdate: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const DIETARY_RESTRICTIONS = [
  "Vegetarian", "Vegan", "Pescatarian", "Halal", "Kosher",
  "Keto", "Paleo", "Low-carb", "Low-fat", "Gluten-free", "Dairy-free",
];

const ALLERGIES = [
  "Peanuts", "Tree nuts", "Milk / Dairy", "Eggs", "Fish", "Shellfish",
  "Wheat / Gluten", "Soy", "Sesame",
];

function ToggleBadge({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button type="button" onClick={onToggle}>
      <Badge
        variant={selected ? "default" : "outline"}
        className={cn(
          "cursor-pointer text-sm py-1.5 px-3 transition-all",
          selected
            ? "bg-brand-600 hover:bg-brand-700 text-white border-brand-600"
            : "hover:border-brand-400"
        )}
      >
        {label}
      </Badge>
    </button>
  );
}

export function StepDietaryNeeds({ data, onUpdate, onNext, onBack }: StepDietaryNeedsProps) {
  const [restrictions, setRestrictions] = useState<string[]>(
    data.dietary_restrictions.map((r) => r.toLowerCase())
  );
  const [allergies, setAllergies] = useState<string[]>(
    data.allergies.map((a) => a.toLowerCase())
  );

  const toggle = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    item: string
  ) => {
    const key = item.toLowerCase();
    setList((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]
    );
  };

  const handleNext = () => {
    onUpdate({
      dietary_restrictions: restrictions,
      allergies: allergies,
    });
    onNext();
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="pb-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-100 flex items-center justify-center mb-2">
          <Leaf className="h-6 w-6 text-brand-600" />
        </div>
        <CardTitle className="text-xl">Dietary needs & allergies</CardTitle>
        <CardDescription>
          We&apos;ll never suggest foods that don&apos;t work for you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dietary restrictions */}
        <div className="space-y-3">
          <p className="text-sm font-medium">Dietary Restrictions</p>
          <div className="flex flex-wrap gap-2">
            {DIETARY_RESTRICTIONS.map((item) => (
              <ToggleBadge
                key={item}
                label={item}
                selected={restrictions.includes(item.toLowerCase())}
                onToggle={() => toggle(restrictions, setRestrictions, item)}
              />
            ))}
          </div>
        </div>

        {/* Allergies */}
        <div className="space-y-3">
          <p className="text-sm font-medium">Allergies</p>
          <div className="flex flex-wrap gap-2">
            {ALLERGIES.map((item) => (
              <ToggleBadge
                key={item}
                label={item}
                selected={allergies.includes(item.toLowerCase())}
                onToggle={() => toggle(allergies, setAllergies, item)}
              />
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Skip this step if you have no restrictions — select nothing and continue.
        </p>

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
