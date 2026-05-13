"use client";

import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Target, Droplets, BarChart3 } from "lucide-react";
import type { NutritionPeriodSummary } from "@/types/nutrition";

interface AnalyticsDashboardProps {
  userId: string;
  profile: {
    target_calories: number | null;
    target_protein: number | null;
    target_carbs: number | null;
    target_fat: number | null;
    weight_kg: number | null;
  } | null;
}

const MACRO_COLORS = ["#3b82f6", "#f97316", "#a855f7"];

export function AnalyticsDashboard({ userId, profile }: AnalyticsDashboardProps) {
  const [range, setRange] = useState<"7d" | "30d">("7d");
  const [data, setData] = useState<NutritionPeriodSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/nutrition/summary?range=${range}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setIsLoading(false));
  }, [range]);

  const targetCalories = profile?.target_calories ?? 2000;
  const targetProtein = profile?.target_protein ?? 150;
  const targetCarbs = profile?.target_carbs ?? 225;
  const targetFat = profile?.target_fat ?? 55;

  const macroData = [
    { name: "Protein", value: data?.periodTotals.avgProtein ?? 0, target: targetProtein },
    { name: "Carbs", value: data?.periodTotals.avgCarbs ?? 0, target: targetCarbs },
    { name: "Fat", value: data?.periodTotals.avgFat ?? 0, target: targetFat },
  ];

  const pieData = [
    { name: "Protein", value: data?.periodTotals.avgProtein ?? 0 },
    { name: "Carbs", value: data?.periodTotals.avgCarbs ?? 0 },
    { name: "Fat", value: data?.periodTotals.avgFat ?? 0 },
  ].filter((d) => d.value > 0);

  const waterGoal = profile?.weight_kg ? Math.round(profile.weight_kg * 35) : 2500;

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Nutrition Analytics</h2>
        <Tabs value={range} onValueChange={(v) => setRange(v as "7d" | "30d")}>
          <TabsList>
            <TabsTrigger value="7d">7 Days</TabsTrigger>
            <TabsTrigger value="30d">30 Days</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Avg Calories", value: data?.periodTotals.avgCalories ?? 0, target: targetCalories, icon: TrendingUp, unit: "kcal", color: "text-brand-600" },
          { label: "Avg Protein", value: data?.periodTotals.avgProtein ?? 0, target: targetProtein, icon: BarChart3, unit: "g", color: "text-blue-600" },
          { label: "Goal Adherence", value: data?.periodTotals.adherencePercent ?? 0, target: 100, icon: Target, unit: "%", color: "text-warm-500" },
          { label: "Water Goal", value: waterGoal / 1000, target: waterGoal / 1000, icon: Droplets, unit: "L/day", color: "text-cyan-600" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="pt-4">
                {isLoading ? (
                  <Skeleton className="h-12 w-full" />
                ) : (
                  <>
                    <div className={`flex items-center gap-1 ${stat.color} mb-1`}>
                      <Icon className="h-4 w-4" />
                      <span className="text-xs font-medium">{stat.label}</span>
                    </div>
                    <p className="text-2xl font-bold">{typeof stat.value === 'number' ? Math.round(stat.value) : stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.unit}</p>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Calorie trend chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Calorie Trend</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={data?.dailySummaries ?? []} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false}
                  tickFormatter={(d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  formatter={(v: unknown) => [`${(v as number).toLocaleString()} kcal`, "Calories"]}
                  labelFormatter={(d) => new Date(d).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                />
                <ReferenceLine y={targetCalories} stroke="#16a34a" strokeDasharray="4 4" />
                <Area type="monotone" dataKey="totalCalories" stroke="#22c55e" strokeWidth={2}
                  fill="url(#calGrad)" dot={{ r: 3 }} activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Macro charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Macro distribution pie */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Macro Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ""} ${Math.round((percent ?? 0) * 100)}%`} labelLine={false}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={MACRO_COLORS[i % MACRO_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: unknown) => [`${v as number}g`]} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Macro vs targets bar */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Macros vs Targets</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={macroData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                    formatter={(v: unknown) => [`${v as number}g`]}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="value" name="Average" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" name="Target" fill="#e4e4e7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
