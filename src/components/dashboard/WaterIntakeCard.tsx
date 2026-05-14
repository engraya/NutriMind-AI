"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Droplets, Plus } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WaterIntakeCardProps {
  totalMl: number;
  goalMl: number;
  userId: string;
}

const QUICK_AMOUNTS = [250, 500];

export function WaterIntakeCard({
  totalMl: initialTotal,
  goalMl,
  userId: _userId,
}: WaterIntakeCardProps) {
  const [total, setTotal] = useState(initialTotal);
  const [isLogging, setIsLogging] = useState(false);

  const percent = Math.min((total / goalMl) * 100, 100);
  const totalL = (total / 1000).toFixed(1);
  const goalL = (goalMl / 1000).toFixed(1);

  const logWater = async (amountMl: number) => {
    setIsLogging(true);
    try {
      const res = await fetch("/api/water", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountMl }),
      });
      if (!res.ok) throw new Error("Failed to log water");
      setTotal((prev) => Math.min(prev + amountMl, goalMl * 1.5));
      toast.success(`+${amountMl}ml logged`);
    } catch {
      toast.error("Failed to log water intake");
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <Card className="border-t-2 border-t-cyan-500 shadow-soft hover:shadow-medium transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Droplets className="h-4 w-4 text-cyan-500" />
          Water Intake
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Water fill animation */}
        <div className="relative w-20 h-28 mx-auto mb-3">
          <div className="absolute inset-0 rounded-2xl border-2 border-cyan-200 dark:border-cyan-900 overflow-hidden">
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-cyan-500 to-cyan-400 opacity-80"
              initial={{ height: "0%" }}
              animate={{ height: `${percent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm font-bold text-cyan-700 dark:text-cyan-400 tabular-nums">
              {totalL}L
            </span>
            <span className="text-xs text-cyan-600 dark:text-cyan-500">
              of {goalL}L
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          {QUICK_AMOUNTS.map((amount) => (
            <Button
              key={amount}
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              onClick={() => logWater(amount)}
              disabled={isLogging}
            >
              <Plus className="h-3 w-3 mr-1" />
              {amount}ml
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
