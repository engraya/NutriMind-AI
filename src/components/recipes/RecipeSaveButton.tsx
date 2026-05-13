"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecipeSaveButtonProps {
  recipeId: string;
  initialSaved: boolean;
}

export function RecipeSaveButton({ recipeId, initialSaved }: RecipeSaveButtonProps) {
  const [isSaved, setIsSaved] = useState(initialSaved);

  const toggle = async () => {
    const next = !isSaved;
    setIsSaved(next);
    try {
      if (next) {
        await fetch(`/api/recipes/${recipeId}/save`, { method: "POST" });
        toast.success("Recipe saved!");
      } else {
        await fetch(`/api/recipes/${recipeId}`, { method: "DELETE" });
        toast.success("Recipe removed from saved");
      }
    } catch {
      setIsSaved(isSaved);
      toast.error("Failed to update saved recipes");
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={toggle}>
      <Heart className={`h-4 w-4 mr-1.5 transition-colors ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
      {isSaved ? "Saved" : "Save Recipe"}
    </Button>
  );
}
