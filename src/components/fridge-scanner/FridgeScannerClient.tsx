"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Camera, Upload, X, Loader2, CheckCircle, Sparkles } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { DetectedIngredient, SuggestedMeal } from "@/types/fridge";

type ScanStage = "idle" | "uploading" | "analyzing" | "done";

export function FridgeScannerClient() {
  const [stage, setStage] = useState<ScanStage>("idle");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [cloudinaryId, setCloudinaryId] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<DetectedIngredient[]>([]);
  const [suggestedMeals, setSuggestedMeals] = useState<SuggestedMeal[]>([]);
  const [note, setNote] = useState("");

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10MB");
      return;
    }

    setStage("uploading");
    try {
      // Upload to Cloudinary via server
      const formData = new FormData();
      formData.append("image", file);
      const uploadRes = await fetch("/api/fridge-scanner/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadData.success) throw new Error(uploadData.error);

      setImageUrl(uploadData.imageUrl);
      setCloudinaryId(uploadData.cloudinaryId);

      // Analyze with Gemini Vision
      setStage("analyzing");
      const analyzeRes = await fetch("/api/fridge-scanner/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: uploadData.imageUrl,
          cloudinaryId: uploadData.cloudinaryId,
        }),
      });
      const analyzeData = await analyzeRes.json();
      if (!analyzeData.success) throw new Error(analyzeData.error);

      setIngredients(analyzeData.detectedIngredients);
      setSuggestedMeals(analyzeData.suggestedMeals);
      setNote(analyzeData.nutritionalNote);
      setStage("done");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Scan failed. Please try again.");
      setStage("idle");
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) processFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    disabled: stage !== "idle",
  });

  const reset = () => {
    setStage("idle");
    setImageUrl(null);
    setCloudinaryId(null);
    setIngredients([]);
    setSuggestedMeals([]);
    setNote("");
  };

  const logMeal = async (meal: SuggestedMeal) => {
    try {
      const res = await fetch("/api/nutrition/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mealName: meal.name,
          mealType: "snack",
          calories: meal.estimated_nutrition.calories,
          proteinG: meal.estimated_nutrition.protein,
          carbsG: meal.estimated_nutrition.carbs,
          fatG: meal.estimated_nutrition.fat,
          source: "fridge_scan",
          imageUrl,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      toast.success(`${meal.name} logged!`);
    } catch {
      toast.error("Failed to log meal");
    }
  };

  const STAGE_LABELS: Record<ScanStage, string> = {
    idle: "Ready to scan",
    uploading: "Uploading image...",
    analyzing: "AI is analyzing your fridge...",
    done: "Analysis complete!",
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Upload zone */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-brand-600" />
            AI Fridge Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stage === "idle" ? (
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-border rounded-xl p-10 text-center cursor-pointer hover:border-brand-400 hover:bg-brand-50 transition-colors"
            >
              <input {...getInputProps()} />
              <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center mx-auto mb-4">
                {isDragActive ? (
                  <Upload className="h-8 w-8 text-brand-600" />
                ) : (
                  <Camera className="h-8 w-8 text-brand-600" />
                )}
              </div>
              <p className="font-semibold mb-1">
                {isDragActive ? "Drop your image here" : "Take a photo of your fridge"}
              </p>
              <p className="text-sm text-muted-foreground">
                Drag & drop an image or click to browse. Max 10MB.
              </p>
              <div className="mt-4 flex gap-2 justify-center">
                <Button variant="outline" size="sm" asChild>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
                    />
                    <Camera className="mr-1 h-3 w-3" />
                    Take Photo
                  </label>
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="mr-1 h-3 w-3" />
                  Browse Files
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Preview */}
              {imageUrl && (
                <div className="relative rounded-xl overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt="Fridge scan"
                    width={600}
                    height={400}
                    className="w-full object-cover max-h-64"
                  />
                  {stage === "done" && (
                    <button
                      onClick={reset}
                      className="absolute top-2 right-2 p-1.5 bg-background/90 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}

              {/* Stage indicator */}
              <div className="flex items-center gap-3">
                {stage === "done" ? (
                  <CheckCircle className="h-5 w-5 text-brand-600" />
                ) : (
                  <Loader2 className="h-5 w-5 text-brand-600 animate-spin" />
                )}
                <span className="text-sm font-medium">{STAGE_LABELS[stage]}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <AnimatePresence>
        {stage === "done" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {/* Detected ingredients */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Detected Ingredients ({ingredients.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {ingredients.map((ing, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="text-xs"
                      title={`${Math.round(ing.confidence * 100)}% confidence`}
                    >
                      {ing.name}
                      {ing.estimated_quantity && ` (${ing.estimated_quantity})`}
                    </Badge>
                  ))}
                </div>
                {note && (
                  <p className="text-xs text-muted-foreground mt-3 p-2 bg-brand-50 rounded-lg">
                    💡 {note}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Suggested meals */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-brand-600" />
                  Suggested Meals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {suggestedMeals.map((meal, i) => (
                  <div key={i} className="p-3 border border-border rounded-lg">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold">{meal.name}</p>
                          <Badge variant="outline" className="text-xs">{meal.cuisine_type}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{meal.description}</p>
                        <div className="flex gap-3 mt-2 text-xs">
                          <span className="text-brand-600 font-medium">{meal.estimated_nutrition.calories} kcal</span>
                          <span className="text-muted-foreground">P: {meal.estimated_nutrition.protein}g</span>
                          <span className="text-muted-foreground">C: {meal.estimated_nutrition.carbs}g</span>
                          <span className="text-muted-foreground">F: {meal.estimated_nutrition.fat}g</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => logMeal(meal)}>
                        Log
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full" onClick={reset}>
              Scan Another Image
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
