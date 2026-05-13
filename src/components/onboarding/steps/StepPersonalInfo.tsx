"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, ChevronRight } from "lucide-react";
import { personalInfoSchema, type PersonalInfoInput } from "@/lib/validations/profile";
import type { OnboardingData } from "@/store/onboarding.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StepPersonalInfoProps {
  data: OnboardingData;
  onUpdate: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
}

export function StepPersonalInfo({ data, onUpdate, onNext }: StepPersonalInfoProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PersonalInfoInput>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      full_name: data.full_name,
      age: data.age ?? undefined,
      gender: data.gender ?? undefined,
      height_cm: data.height_cm ?? undefined,
      weight_kg: data.weight_kg ?? undefined,
    },
  });

  const onSubmit = (values: PersonalInfoInput) => {
    onUpdate(values);
    onNext();
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="pb-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-100 flex items-center justify-center mb-2">
          <User className="h-6 w-6 text-brand-600" />
        </div>
        <CardTitle className="text-xl">Tell us about yourself</CardTitle>
        <CardDescription>
          We&apos;ll use this to personalize your nutrition targets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              placeholder="Your name"
              {...register("full_name")}
              className={errors.full_name ? "border-destructive" : ""}
            />
            {errors.full_name && (
              <p className="text-sm text-destructive">{errors.full_name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="25"
                {...register("age", { valueAsNumber: true })}
                className={errors.age ? "border-destructive" : ""}
              />
              {errors.age && (
                <p className="text-sm text-destructive">{errors.age.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <Select
                defaultValue={data.gender ?? undefined}
                onValueChange={(val) => setValue("gender", val as PersonalInfoInput["gender"])}
              >
                <SelectTrigger className={errors.gender ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height_cm">Height (cm)</Label>
              <Input
                id="height_cm"
                type="number"
                placeholder="170"
                {...register("height_cm", { valueAsNumber: true })}
                className={errors.height_cm ? "border-destructive" : ""}
              />
              {errors.height_cm && (
                <p className="text-sm text-destructive">{errors.height_cm.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight_kg">Weight (kg)</Label>
              <Input
                id="weight_kg"
                type="number"
                step="0.1"
                placeholder="70"
                {...register("weight_kg", { valueAsNumber: true })}
                className={errors.weight_kg ? "border-destructive" : ""}
              />
              {errors.weight_kg && (
                <p className="text-sm text-destructive">{errors.weight_kg.message}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-brand-600 hover:bg-brand-700 text-white"
          >
            Continue
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
