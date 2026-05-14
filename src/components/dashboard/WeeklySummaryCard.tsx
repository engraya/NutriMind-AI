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
    data.reduce((sum, d) => sum + d.calories, 0) /
      Math.max(data.filter((d) => d.calories > 0).length, 1)
  );

  return (
    <Card className="shadow-soft hover:shadow-medium transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            7-Day Calorie Trend
          </CardTitle>
          <div className="text-right">
            <p className="text-sm font-semibold tabular-nums">
              {avgCalories.toLocaleString()} kcal
            </p>
            <p className="text-xs text-muted-foreground">avg / day</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="calGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                border: "1px solid var(--color-border)",
                borderRadius: 10,
                backgroundColor: "var(--color-card)",
                color: "var(--color-foreground)",
                boxShadow: "var(--shadow-medium)",
              }}
              formatter={(value: unknown) => [
                `${(value as number).toLocaleString()} kcal`,
                "Calories",
              ]}
            />
            <ReferenceLine
              y={targetCalories}
              stroke="var(--color-primary)"
              strokeDasharray="4 4"
              label={{ value: "Target", fontSize: 10, fill: "var(--color-primary)" }}
            />
            <Area
              type="monotone"
              dataKey="calories"
              stroke="var(--color-primary)"
              strokeWidth={2}
              fill="url(#calGradient)"
              dot={{ r: 3, fill: "var(--color-primary)" }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
