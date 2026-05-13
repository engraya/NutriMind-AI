"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, TrendingDown, Dumbbell, Heart, Scale } from "lucide-react";
import type { OnboardingData } from "@/store/onboarding.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StepFitnessGoalsProps {
  data: OnboardingData;
  onUpdate: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const GOALS = [
  {
    value: "lose_weight" as const,
    label: "Lose Weight",
    description: "Burn fat and reach a healthier BMI",
    icon: TrendingDown,
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    value: "gain_muscle" as const,
    label: "Gain Muscle",
    description: "Build strength and increase muscle mass",
    icon: Dumbbell,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    value: "maintain" as const,
    label: "Maintain Weight",
    description: "Stay at your current healthy weight",
    icon: Scale,
    color: "text-brand-600",
    bg: "bg-brand-50",
  },
  {
    value: "improve_health" as const,
    label: "Improve Health",
    description: "Eat better and feel more energetic",
    icon: Heart,
    color: "text-red-500",
    bg: "bg-red-50",
  },
];

const ACTIVITY_LEVELS = [
  { value: "sedentary" as const, label: "Sedentary", description: "Little to no exercise" },
  { value: "lightly_active" as const, label: "Lightly Active", description: "1-3 days/week" },
  { value: "moderately_active" as const, label: "Moderately Active", description: "3-5 days/week" },
  { value: "very_active" as const, label: "Very Active", description: "6-7 days/week" },
  { value: "extra_active" as const, label: "Extra Active", description: "Athlete / physical job" },
];

export function StepFitnessGoals({ data, onUpdate, onNext, onBack }: StepFitnessGoalsProps) {
  const [selectedGoal, setSelectedGoal] = useState(data.goal);
  const [selectedActivity, setSelectedActivity] = useState(data.activity_level);
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!selectedGoal || !selectedActivity) {
      setError("Please select both a goal and activity level");
      return;
    }
    onUpdate({ goal: selectedGoal, activity_level: selectedActivity });
    onNext();
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="pb-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-100 flex items-center justify-center mb-2">
          <Dumbbell className="h-6 w-6 text-brand-600" />
        </div>
        <CardTitle className="text-xl">What&apos;s your fitness goal?</CardTitle>
        <CardDescription>
          This shapes your daily calorie and macro targets
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Goal selection */}
        <div className="grid grid-cols-2 gap-3">
          {GOALS.map((goal) => {
            const Icon = goal.icon;
            const isSelected = selectedGoal === goal.value;
            return (
              <button
                key={goal.value}
                type="button"
                onClick={() => { setSelectedGoal(goal.value); setError(""); }}
                className={cn(
                  "p-3 rounded-xl border-2 text-left transition-all",
                  isSelected
                    ? "border-brand-600 bg-brand-50"
                    : "border-border hover:border-brand-300"
                )}
              >
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-2", goal.bg)}>
                  <Icon className={cn("h-4 w-4", goal.color)} />
                </div>
                <p className="text-sm font-semibold">{goal.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{goal.description}</p>
              </button>
            );
          })}
        </div>

        {/* Activity level */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Activity Level</p>
          <div className="space-y-2">
            {ACTIVITY_LEVELS.map((level) => {
              const isSelected = selectedActivity === level.value;
              return (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => { setSelectedActivity(level.value); setError(""); }}
                  className={cn(
                    "w-full p-3 rounded-lg border-2 flex items-center justify-between text-left transition-all",
                    isSelected
                      ? "border-brand-600 bg-brand-50"
                      : "border-border hover:border-brand-300"
                  )}
                >
                  <div>
                    <p className="text-sm font-medium">{level.label}</p>
                    <p className="text-xs text-muted-foreground">{level.description}</p>
                  </div>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-brand-600 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
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
