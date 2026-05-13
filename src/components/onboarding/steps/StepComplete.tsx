"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface StepCompleteProps {
  onComplete: () => Promise<void>;
}

export function StepComplete({ onComplete }: StepCompleteProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    setIsLoading(true);
    await onComplete();
    setIsLoading(false);
  };

  return (
    <Card className="shadow-lg border-0">
      <CardContent className="pt-8 pb-8 text-center space-y-6">
        {/* Celebration animation */}
        <div className="relative mx-auto w-24 h-24">
          <motion.div
            className="absolute inset-0 rounded-full bg-brand-100"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative w-24 h-24 rounded-full bg-brand-600 flex items-center justify-center">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">You&apos;re all set! 🎉</h2>
          <p className="text-muted-foreground max-w-xs mx-auto">
            Your personalized nutrition profile is ready. We&apos;ve calculated your daily calorie and macro targets.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "AI Meal Plans", emoji: "🥗" },
            { label: "Fridge Scanner", emoji: "📷" },
            { label: "Health Chat", emoji: "💬" },
          ].map((feature) => (
            <div
              key={feature.label}
              className="p-3 rounded-xl bg-brand-50 border border-brand-100"
            >
              <div className="text-2xl mb-1">{feature.emoji}</div>
              <p className="text-xs font-medium text-brand-800">{feature.label}</p>
            </div>
          ))}
        </div>

        <Button
          className="w-full h-12 bg-brand-600 hover:bg-brand-700 text-white text-base"
          onClick={handleComplete}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-5 w-5" />
          )}
          {isLoading ? "Setting up your profile..." : "Go to My Dashboard"}
        </Button>
      </CardContent>
    </Card>
  );
}
