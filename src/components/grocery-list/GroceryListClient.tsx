"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ShoppingCart, Loader2, Copy, Printer, CheckSquare, Square, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface GroceryItem {
  ingredient: string;
  quantity: string;
  unit?: string;
  category: string;
  checked: boolean;
}

interface GroceryList {
  id: string;
  title: string;
  items: GroceryItem[];
  week_start: string | null;
}

interface GroceryListClientProps {
  userId: string;
  activePlan: { id: string; title: string; week_start: string } | null;
  initialList: GroceryList | null;
}

const CATEGORY_ORDER = ["Produce", "Proteins", "Grains & Staples", "Dairy & Eggs", "Spices & Condiments", "Other"];
const CATEGORY_COLORS: Record<string, string> = {
  "Produce": "bg-green-100 text-green-800",
  "Proteins": "bg-red-100 text-red-800",
  "Grains & Staples": "bg-amber-100 text-amber-800",
  "Dairy & Eggs": "bg-blue-100 text-blue-800",
  "Spices & Condiments": "bg-purple-100 text-purple-800",
  "Other": "bg-gray-100 text-gray-800",
};

export function GroceryListClient({ userId, activePlan, initialList }: GroceryListClientProps) {
  const [list, setList] = useState<GroceryList | null>(initialList);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const generate = async () => {
    if (!activePlan) {
      toast.error("No active meal plan found. Generate a meal plan first.");
      return;
    }
    setIsGenerating(true);
    try {
      const res = await fetch("/api/grocery-list/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mealPlanId: activePlan.id }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setList(data.groceryList);
      toast.success("Grocery list generated!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate list");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleItem = async (index: number) => {
    if (!list) return;
    const updated = list.items.map((item, i) =>
      i === index ? { ...item, checked: !item.checked } : item
    );
    setList({ ...list, items: updated });

    // Persist debounced (optimistic — save in background)
    setIsSaving(true);
    try {
      await fetch(`/api/grocery-list/${list.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updated }),
      });
    } catch {
      // silently fail — UI is already updated
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = () => {
    if (!list) return;
    const text = CATEGORY_ORDER
      .filter((cat) => list.items.some((i) => i.category === cat))
      .map((cat) => {
        const items = list.items.filter((i) => i.category === cat);
        return `${cat}:\n${items.map((i) => `  - ${i.ingredient}${i.quantity ? ` (${i.quantity}${i.unit ? " " + i.unit : ""})` : ""}`).join("\n")}`;
      })
      .join("\n\n");
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const printList = () => window.print();

  const uncheckedCount = list?.items.filter((i) => !i.checked).length ?? 0;
  const totalCount = list?.items.length ?? 0;

  const groupedItems = list
    ? CATEGORY_ORDER.reduce<Record<string, GroceryItem[]>>((acc, cat) => {
        const items = list.items.filter((i) => i.category === cat);
        if (items.length > 0) acc[cat] = items;
        return acc;
      }, {})
    : {};

  return (
    <div className="space-y-6 max-w-2xl mx-auto print:max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Grocery List</h2>
          {list && (
            <p className="text-sm text-muted-foreground">
              {uncheckedCount} of {totalCount} items remaining
            </p>
          )}
        </div>
        <div className="flex gap-2 print:hidden">
          {list && (
            <>
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <Copy className="h-4 w-4 mr-1" /> Copy
              </Button>
              <Button variant="outline" size="sm" onClick={printList}>
                <Printer className="h-4 w-4 mr-1" /> Print
              </Button>
            </>
          )}
          <Button
            size="sm"
            onClick={generate}
            disabled={isGenerating || !activePlan}
            className="bg-brand-600 hover:bg-brand-700 text-white"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-1" />
            )}
            {list ? "Regenerate" : "Generate from Plan"}
          </Button>
        </div>
      </div>

      {/* No active plan warning */}
      {!activePlan && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-4">
            <p className="text-sm text-amber-800">
              No active meal plan found. Go to the{" "}
              <a href="/meal-planner" className="font-medium underline">Meal Planner</a>{" "}
              to generate and save a plan first.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Loading state */}
      {isGenerating && (
        <Card>
          <CardContent className="pt-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {!list && !isGenerating && (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="h-8 w-8 text-brand-600" />
            </div>
            <h3 className="font-semibold mb-1">No grocery list yet</h3>
            <p className="text-sm text-muted-foreground">
              {activePlan
                ? `Generate a shopping list from "${activePlan.title}"`
                : "Create a meal plan first, then generate your grocery list"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* List */}
      <AnimatePresence>
        {list && !isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Plan info */}
            {list.title && (
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{list.title}</Badge>
                {isSaving && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" /> Saving...
                  </span>
                )}
              </div>
            )}

            {/* Categories */}
            {Object.entries(groupedItems).map(([category, items]) => (
              <Card key={category}>
                <CardHeader className="pb-2 pt-4">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[category] ?? CATEGORY_COLORS["Other"]}`}>
                      {category}
                    </span>
                    <span className="text-muted-foreground font-normal">
                      {items.filter((i) => !i.checked).length}/{items.length}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-3">
                  <div className="space-y-1">
                    {items.map((item, _) => {
                      const globalIndex = list.items.findIndex(
                        (i) => i.ingredient === item.ingredient && i.category === item.category
                      );
                      return (
                        <button
                          key={`${item.ingredient}-${item.category}`}
                          onClick={() => toggleItem(globalIndex)}
                          className="w-full flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
                        >
                          {item.checked ? (
                            <CheckSquare className="h-4 w-4 text-brand-600 shrink-0" />
                          ) : (
                            <Square className="h-4 w-4 text-muted-foreground shrink-0" />
                          )}
                          <span className={`text-sm flex-1 ${item.checked ? "line-through text-muted-foreground" : ""}`}>
                            {item.ingredient}
                          </span>
                          {(item.quantity || item.unit) && (
                            <span className="text-xs text-muted-foreground">
                              {item.quantity} {item.unit}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Progress */}
            {totalCount > 0 && (
              <div className="text-center text-sm text-muted-foreground">
                {uncheckedCount === 0 ? (
                  <p className="text-brand-600 font-medium">All items checked! Happy cooking 🎉</p>
                ) : (
                  <p>{uncheckedCount} items left to grab</p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
