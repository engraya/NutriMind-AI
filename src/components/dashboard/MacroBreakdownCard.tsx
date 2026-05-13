"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface MacroBreakdownCardProps {
  consumed: { protein: number; carbs: number; fat: number };
  targets: { protein: number; carbs: number; fat: number };
}

const MACRO_COLORS = {
  protein: "#3b82f6",
  carbs: "#f97316",
  fat: "#a855f7",
};

export function MacroBreakdownCard({ consumed, targets }: MacroBreakdownCardProps) {
  const data = [
    { name: "Protein", consumed: Math.round(consumed.protein), target: targets.protein, color: MACRO_COLORS.protein },
    { name: "Carbs", consumed: Math.round(consumed.carbs), target: targets.carbs, color: MACRO_COLORS.carbs },
    { name: "Fat", consumed: Math.round(consumed.fat), target: targets.fat, color: MACRO_COLORS.fat },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Activity className="h-4 w-4 text-brand-600" />
          Macros Today
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-3">
          {data.map((macro) => {
            const percent = Math.min((macro.consumed / macro.target) * 100, 100);
            return (
              <div key={macro.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">{macro.name}</span>
                  <span className="text-muted-foreground">{macro.consumed}g / {macro.target}g</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${percent}%`, backgroundColor: macro.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-3 gap-1 text-center">
          {data.map((macro) => (
            <div key={macro.name} className="p-2 rounded-lg" style={{ backgroundColor: `${macro.color}15` }}>
              <p className="text-sm font-semibold" style={{ color: macro.color }}>
                {macro.consumed}g
              </p>
              <p className="text-xs text-muted-foreground">{macro.name}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
