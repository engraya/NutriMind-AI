"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface WeeklySummaryCardProps {
  data: Array<{ date: string; calories: number }>;
  targetCalories: number;
}

export function WeeklySummaryCard({ data, targetCalories }: WeeklySummaryCardProps) {
  const avgCalories = Math.round(
    data.reduce((sum, d) => sum + d.calories, 0) / Math.max(data.filter((d) => d.calories > 0).length, 1)
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-brand-600" />
            7-Day Calorie Trend
          </CardTitle>
          <div className="text-right">
            <p className="text-sm font-semibold">{avgCalories.toLocaleString()} kcal</p>
            <p className="text-xs text-muted-foreground">avg / day</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="calGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ fontSize: 12, border: "none", borderRadius: 8, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
              formatter={(value: unknown) => [`${(value as number).toLocaleString()} kcal`, "Calories"]}
            />
            <ReferenceLine
              y={targetCalories}
              stroke="#16a34a"
              strokeDasharray="4 4"
              label={{ value: "Target", fontSize: 10, fill: "#16a34a" }}
            />
            <Area
              type="monotone"
              dataKey="calories"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#calGradient)"
              dot={{ r: 3, fill: "#22c55e" }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
