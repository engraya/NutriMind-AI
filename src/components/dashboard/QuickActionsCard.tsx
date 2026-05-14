import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Camera, CalendarDays } from "lucide-react";

const ACTIONS = [
  {
    href: "/meal-planner",
    label: "Generate Meal Plan",
    description: "AI-powered weekly plan",
    icon: CalendarDays,
    colorClass: "bg-primary/10 text-primary hover:bg-primary/15",
  },
  {
    href: "/fridge-scanner",
    label: "Scan Fridge",
    description: "Find meals from ingredients",
    icon: Camera,
    colorClass: "bg-orange-500/10 text-orange-600 hover:bg-orange-500/15",
  },
];

export function QuickActionsCard() {
  return (
    <Card className="shadow-soft hover:shadow-medium transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
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
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 ${action.colorClass}`}
            >
              <div className="shrink-0">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium leading-tight">{action.label}</p>
                <p className="text-xs opacity-70 mt-0.5">{action.description}</p>
              </div>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
