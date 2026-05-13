"use client";

import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame } from "lucide-react";

interface CalorieSummaryCardProps {
  consumed: number;
  target: number;
}

export function CalorieSummaryCard({ consumed, target }: CalorieSummaryCardProps) {
  const percent = Math.min((consumed / target) * 100, 100);
  const remaining = Math.max(target - consumed, 0);

  const data = [{ value: percent, fill: "#16a34a" }];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Flame className="h-4 w-4 text-warm-500" />
          Calories Today
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <ResponsiveContainer width="100%" height={140}>
            <RadialBarChart
              innerRadius="70%"
              outerRadius="100%"
              data={data}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar
                dataKey="value"
                cornerRadius={8}
                background={{ fill: "#f0fdf4" }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">{consumed.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">of {target.toLocaleString()} kcal</span>
          </div>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-center">
          <div className="p-2 rounded-lg bg-brand-50">
            <p className="text-sm font-semibold text-brand-700">{consumed.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Consumed</p>
          </div>
          <div className="p-2 rounded-lg bg-muted">
            <p className="text-sm font-semibold">{remaining.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Remaining</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
