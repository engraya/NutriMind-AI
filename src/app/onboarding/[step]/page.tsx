import { redirect, notFound } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";

const TOTAL_STEPS = 5;

interface OnboardingStepPageProps {
  params: Promise<{ step: string }>;
}

export default async function OnboardingStepPage({ params }: OnboardingStepPageProps) {
  const { step } = await params;
  const stepNumber = parseInt(step, 10);

  if (isNaN(stepNumber) || stepNumber < 1 || stepNumber > TOTAL_STEPS) {
    notFound();
  }

  return <OnboardingShell step={stepNumber} totalSteps={TOTAL_STEPS} />;
}
