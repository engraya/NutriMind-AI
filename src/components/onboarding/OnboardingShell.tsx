"use client";

import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { useOnboardingStore } from "@/store/onboarding.store";
import { StepPersonalInfo } from "./steps/StepPersonalInfo";
import { StepFitnessGoals } from "./steps/StepFitnessGoals";
import { StepDietaryNeeds } from "./steps/StepDietaryNeeds";
import { StepCuisinePrefs } from "./steps/StepCuisinePrefs";
import { StepComplete } from "./steps/StepComplete";

interface OnboardingShellProps {
  step: number;
  totalSteps: number;
}

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export function OnboardingShell({ step, totalSteps }: OnboardingShellProps) {
  const router = useRouter();
  const { updateData, data } = useOnboardingStore();

  const progress = ((step - 1) / (totalSteps - 1)) * 100;

  const goNext = () => {
    if (step < totalSteps) {
      router.push(`/onboarding/${step + 1}`);
    }
  };

  const goBack = () => {
    if (step > 1) {
      router.push(`/onboarding/${step - 1}`);
    }
  };

  const handleComplete = async () => {
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, onboarding_completed: true }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to save profile");
      }

      router.push("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save your profile. Please try again.");
    }
  };

  const stepLabels = [
    "Personal Info",
    "Fitness Goals",
    "Dietary Needs",
    "Cuisine Prefs",
    "All Set!",
  ];

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Step {step} of {totalSteps}</span>
          <span>{stepLabels[step - 1]}</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-brand-600 rounded-full"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </div>
        {/* Step dots */}
        <div className="flex justify-center gap-2 pt-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i + 1 < step
                  ? "w-4 bg-brand-600"
                  : i + 1 === step
                  ? "w-6 bg-brand-600"
                  : "w-1.5 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait" custom={1}>
        <motion.div
          key={step}
          custom={1}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          {step === 1 && (
            <StepPersonalInfo
              data={data}
              onUpdate={updateData}
              onNext={goNext}
            />
          )}
          {step === 2 && (
            <StepFitnessGoals
              data={data}
              onUpdate={updateData}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 3 && (
            <StepDietaryNeeds
              data={data}
              onUpdate={updateData}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 4 && (
            <StepCuisinePrefs
              data={data}
              onUpdate={updateData}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 5 && (
            <StepComplete onComplete={handleComplete} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
