"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { User, Upload, Loader2, Scale, Ruler, Target, Activity } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { calculateBMR, calculateTDEE, calculateBMI, getBMICategory } from "@/lib/nutrition/calculations";

const profileSchema = z.object({
  full_name: z.string().min(1, "Name is required"),
  age: z.number().min(10).max(120).optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  height_cm: z.number().min(50).max(300).optional(),
  weight_kg: z.number().min(20).max(500).optional(),
  goal: z.enum(["lose_weight", "gain_muscle", "maintain", "improve_health"]).optional(),
  activity_level: z.enum(["sedentary", "lightly_active", "moderately_active", "very_active", "extra_active"]).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileClientProps {
  user: { id: string; email: string };
  profile: Record<string, unknown> | null;
}

const GOAL_LABELS: Record<string, string> = {
  lose_weight: "Lose Weight",
  gain_muscle: "Gain Muscle",
  maintain: "Maintain Weight",
  improve_health: "Improve Health",
};

const ACTIVITY_LABELS: Record<string, string> = {
  sedentary: "Sedentary (little/no exercise)",
  lightly_active: "Lightly Active (1–3 days/week)",
  moderately_active: "Moderately Active (3–5 days/week)",
  very_active: "Very Active (6–7 days/week)",
  extra_active: "Extra Active (athlete/physical job)",
};

export function ProfileClient({ user, profile }: ProfileClientProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>((profile?.avatar_url as string) ?? null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: (profile?.full_name as string) ?? "",
      age: (profile?.age as number) ?? undefined,
      gender: (profile?.gender as "male" | "female" | "other") ?? undefined,
      height_cm: (profile?.height_cm as number) ?? undefined,
      weight_kg: (profile?.weight_kg as number) ?? undefined,
      goal: (profile?.goal as ProfileFormData["goal"]) ?? undefined,
      activity_level: (profile?.activity_level as ProfileFormData["activity_level"]) ?? undefined,
    },
  });

  const watched = watch();

  const bmr = watched.age && watched.gender && watched.weight_kg && watched.height_cm
    ? calculateBMR({
        weightKg: watched.weight_kg,
        heightCm: watched.height_cm,
        age: watched.age,
        gender: watched.gender as "male" | "female" | "other" | "prefer_not_to_say",
      })
    : null;

  const tdee = bmr && watched.activity_level
    ? calculateTDEE(bmr, watched.activity_level)
    : null;

  const bmi = watched.weight_kg && watched.height_cm
    ? calculateBMI(watched.weight_kg, watched.height_cm)
    : null;

  const bmiCategory = bmi ? getBMICategory(bmi) : null;

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Avatar must be under 5MB");
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/fridge-scanner/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setAvatarUrl(data.imageUrl);
      // Save to profile
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar_url: data.imageUrl }),
      });
      toast.success("Avatar updated!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upload avatar");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const onSubmit = async (formData: ProfileFormData) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save profile");
      toast.success("Profile saved!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Avatar section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarUrl ?? undefined} />
                <AvatarFallback className="bg-brand-100 text-brand-700 text-xl">
                  {((profile?.full_name as string) ?? user.email)[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <label className="absolute -bottom-1 -right-1 p-1.5 bg-brand-600 rounded-full cursor-pointer hover:bg-brand-700 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onAvatarChange}
                  disabled={isUploadingAvatar}
                />
                {isUploadingAvatar ? (
                  <Loader2 className="h-3.5 w-3.5 text-white animate-spin" />
                ) : (
                  <Upload className="h-3.5 w-3.5 text-white" />
                )}
              </label>
            </div>
            <div>
              <h2 className="font-semibold">{(profile?.full_name as string) || "Your Profile"}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats cards */}
      {(bmi || tdee) && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {bmi && (
            <Card>
              <CardContent className="pt-4 text-center">
                <Scale className="h-4 w-4 text-brand-600 mx-auto mb-1" />
                <p className="text-xl font-bold">{bmi.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">BMI</p>
                <p className="text-xs font-medium mt-0.5" style={{ color: bmiCategory?.color }}>
                  {bmiCategory?.label}
                </p>
              </CardContent>
            </Card>
          )}
          {bmr && (
            <Card>
              <CardContent className="pt-4 text-center">
                <Activity className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                <p className="text-xl font-bold">{Math.round(bmr)}</p>
                <p className="text-xs text-muted-foreground">BMR (kcal)</p>
              </CardContent>
            </Card>
          )}
          {tdee && (
            <Card>
              <CardContent className="pt-4 text-center">
                <Target className="h-4 w-4 text-amber-600 mx-auto mb-1" />
                <p className="text-xl font-bold">{Math.round(tdee)}</p>
                <p className="text-xs text-muted-foreground">TDEE (kcal)</p>
              </CardContent>
            </Card>
          )}
          {watched.weight_kg && watched.height_cm && (
            <Card>
              <CardContent className="pt-4 text-center">
                <Ruler className="h-4 w-4 text-purple-600 mx-auto mb-1" />
                <p className="text-xl font-bold">{watched.height_cm}</p>
                <p className="text-xs text-muted-foreground">cm height</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Edit form */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="full_name">Full Name</Label>
              <Input id="full_name" {...register("full_name")} placeholder="Your name" />
              {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" {...register("age", { valueAsNumber: true })} placeholder="25" />
              </div>
              <div className="space-y-1.5">
                <Label>Gender</Label>
                <Select
                  defaultValue={(profile?.gender as string) ?? ""}
                  onValueChange={(v) => setValue("gender", v as ProfileFormData["gender"])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="height_cm">Height (cm)</Label>
                <Input id="height_cm" type="number" {...register("height_cm", { valueAsNumber: true })} placeholder="170" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="weight_kg">Weight (kg)</Label>
                <Input id="weight_kg" type="number" {...register("weight_kg", { valueAsNumber: true })} placeholder="70" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Fitness Goal</Label>
              <Select
                defaultValue={(profile?.goal as string) ?? ""}
                onValueChange={(v) => setValue("goal", v as ProfileFormData["goal"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select goal" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(GOAL_LABELS).map(([val, label]) => (
                    <SelectItem key={val} value={val}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Activity Level</Label>
              <Select
                defaultValue={(profile?.activity_level as string) ?? ""}
                onValueChange={(v) => setValue("activity_level", v as ProfileFormData["activity_level"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ACTIVITY_LABELS).map(([val, label]) => (
                    <SelectItem key={val} value={val}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={isSaving}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              ) : (
                <User className="h-4 w-4 mr-1.5" />
              )}
              Save Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
