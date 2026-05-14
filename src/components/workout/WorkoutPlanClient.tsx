"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Dumbbell, Loader2, RefreshCw, ChevronDown, ChevronUp, Timer, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  duration_min?: number;
  rest_sec: number;
  notes?: string;
}

interface WorkoutDay {
  day: string;
  focus: string;
  exercises: Exercise[];
  estimated_duration_min: number;
}

interface WorkoutPlan {
  id?: string;
  title: string;
  plan_data: { days: WorkoutDay[]; notes?: string };
  created_at?: string;
}

interface WorkoutPlanClientProps {
  userId: string;
  profile: {
    goal: string | null;
    activity_level: string | null;
    weight_kg: number | null;
    height_cm: number | null;
    age: number | null;
    gender: string | null;
  } | null;
  initialPlan: WorkoutPlan | null;
}

const FOCUS_COLORS: Record<string, string> = {
  "Rest": "bg-gray-100 text-gray-700",
  "Cardio": "bg-cyan-100 text-cyan-700",
  "Strength": "bg-red-100 text-red-700",
  "Upper Body": "bg-blue-100 text-blue-700",
  "Lower Body": "bg-purple-100 text-purple-700",
  "Full Body": "bg-amber-100 text-amber-700",
  "Core": "bg-green-100 text-green-700",
  "HIIT": "bg-orange-100 text-orange-700",
};

function WorkoutDayCard({ day, index }: { day: WorkoutDay; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);
  const colorClass = Object.entries(FOCUS_COLORS).find(([key]) =>
    day.focus.toLowerCase().includes(key.toLowerCase())
  )?.[1] ?? "bg-muted text-foreground";

  return (
    <Card>
      <button
        className="w-full text-left"
        onClick={() => setExpanded((p) => !p)}
      >
        <CardHeader className="pb-2 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{day.day}</p>
                <CardTitle className="text-sm">{day.focus}</CardTitle>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`text-xs ${colorClass}`} variant="secondary">
                {day.estimated_duration_min} min
              </Badge>
              {expanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </CardHeader>
      </button>

      <AnimatePresence>
        {expanded && day.exercises.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <CardContent className="pt-0 pb-4">
              <div className="space-y-2 border-t border-border pt-3">
                {day.exercises.map((ex, i) => (
                  <div key={i} className="flex items-start gap-3 py-2">
                    <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{ex.name}</p>
                      <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                        {ex.sets && ex.reps && (
                          <span className="flex items-center gap-1">
                            <Repeat className="h-3 w-3" />
                            {ex.sets} × {ex.reps}
                          </span>
                        )}
                        {ex.duration_min && (
                          <span className="flex items-center gap-1">
                            <Timer className="h-3 w-3" />
                            {ex.duration_min} min
                          </span>
                        )}
                        {ex.rest_sec && (
                          <span>Rest: {ex.rest_sec}s</span>
                        )}
                      </div>
                      {ex.notes && (
                        <p className="text-xs text-muted-foreground italic mt-1">{ex.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </motion.div>
        )}
        {expanded && day.exercises.length === 0 && (
          <CardContent className="pt-0 pb-4">
            <p className="text-sm text-muted-foreground text-center py-4">Rest day — focus on recovery and hydration</p>
          </CardContent>
        )}
      </AnimatePresence>
    </Card>
  );
}

export function WorkoutPlanClient({ userId, profile, initialPlan }: WorkoutPlanClientProps) {
  const [plan, setPlan] = useState<WorkoutPlan | null>(initialPlan);
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/workout-plan/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: profile?.goal ?? "maintain",
          activityLevel: profile?.activity_level ?? "moderately_active",
          weight: profile?.weight_kg,
          height: profile?.height_cm,
          age: profile?.age,
          gender: profile?.gender,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate plan");
      setPlan({
        id: data.planId,
        title: `Workout Plan — Week of ${new Date().toISOString().split("T")[0]}`,
        plan_data: data.planData,
      });
      toast.success("Workout plan generated!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate plan");
    } finally {
      setIsGenerating(false);
    }
  };

  const days = plan?.plan_data?.days ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Workout Plan</h2>
          {plan && (
            <p className="text-sm text-muted-foreground">{plan.title}</p>
          )}
        </div>
        <Button
          onClick={generate}
          disabled={isGenerating}
          className="bg-brand-600 hover:bg-brand-700 text-white"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-1.5" />
          )}
          {plan ? "Regenerate" : "Generate Plan"}
        </Button>
      </div>

      {/* Loading */}
      {isGenerating && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="pt-4">
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!plan && !isGenerating && (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center mx-auto mb-4">
              <Dumbbell className="h-8 w-8 text-brand-600" />
            </div>
            <h3 className="font-semibold mb-1">No workout plan yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get a personalized 7-day workout plan based on your fitness goal and activity level
            </p>
            <Button onClick={generate} className="bg-brand-600 hover:bg-brand-700 text-white">
              <Dumbbell className="h-4 w-4 mr-1.5" />
              Generate My Plan
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Plan */}
      {!isGenerating && days.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          {days.map((day, i) => (
            <WorkoutDayCard key={i} day={day} index={i} />
          ))}

          {plan?.plan_data?.notes && (
            <Card className="border-brand-200 bg-brand-50">
              <CardContent className="pt-4 pb-4">
                <p className="text-sm text-brand-800">
                  <span className="font-semibold">Coach tip: </span>
                  {plan.plan_data.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
}
