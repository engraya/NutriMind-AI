"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface MacroBreakdownCardProps {
  consumed: { protein: number; carbs: number; fat: number };
  targets: { protein: number; carbs: number; fat: number };
}

const MACROS = [
  { key: "protein" as const, label: "Protein", color: "#3b82f6", bg: "#3b82f615" },
  { key: "carbs" as const, label: "Carbs", color: "#f97316", bg: "#f9731615" },
  { key: "fat" as const, label: "Fat", color: "#a855f7", bg: "#a855f715" },
];

export function MacroBreakdownCard({ consumed, targets }: MacroBreakdownCardProps) {
  return (
    <Card className="border-t-2 border-t-blue-500 shadow-soft hover:shadow-medium transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Activity className="h-4 w-4 text-blue-500" />
          Macros Today
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-3">
          {MACROS.map((macro) => {
            const c = Math.round(consumed[macro.key]);
            const t = targets[macro.key];
            const percent = Math.min((c / t) * 100, 100);
            return (
              <div key={macro.key} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">{macro.label}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {c}g / {t}g
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${percent}%`, backgroundColor: macro.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-3 gap-1 text-center">
          {MACROS.map((macro) => (
            <div
              key={macro.key}
              className="p-2 rounded-lg"
              style={{ backgroundColor: macro.bg }}
            >
              <p
                className="text-sm font-semibold tabular-nums"
                style={{ color: macro.color }}
              >
                {Math.round(consumed[macro.key])}g
              </p>
              <p className="text-xs text-muted-foreground">{macro.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
