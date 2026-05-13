import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Camera, CalendarDays, Plus } from "lucide-react";

const ACTIONS = [
  {
    href: "/meal-planner",
    label: "Generate Meal Plan",
    description: "AI-powered weekly plan",
    icon: CalendarDays,
    color: "bg-brand-50 text-brand-600 hover:bg-brand-100",
  },
  {
    href: "/fridge-scanner",
    label: "Scan Fridge",
    description: "Find meals from ingredients",
    icon: Camera,
    color: "bg-orange-50 text-orange-600 hover:bg-orange-100",
  },
];

export function QuickActionsCard() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Zap className="h-4 w-4 text-brand-600" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${action.color}`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <div>
                <p className="text-sm font-medium">{action.label}</p>
                <p className="text-xs opacity-70">{action.description}</p>
              </div>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
