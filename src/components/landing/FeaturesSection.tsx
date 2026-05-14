import {
  Brain,
  Camera,
  BarChart3,
  MessageCircle,
  ShoppingCart,
  CalendarDays,
  Dumbbell,
  Zap,
} from "lucide-react";

const FEATURES = [
  {
    icon: Brain,
    title: "AI Meal Planning",
    description:
      "Gemini AI generates personalized weekly meal plans based on your goals, preferences, allergies, and what's already in your kitchen.",
    color: "bg-primary/10 text-primary",
    tag: "Core",
  },
  {
    icon: Camera,
    title: "Fridge Scanner",
    description:
      "Photograph your fridge or pantry. AI identifies every ingredient and instantly suggests meals you can make right now.",
    color: "bg-teal-500/10 text-teal-600",
    tag: "AI Vision",
  },
  {
    icon: BarChart3,
    title: "Nutrition Analytics",
    description:
      "7-day and 30-day breakdowns of your calorie intake, macro distribution, and goal adherence — visualized beautifully.",
    color: "bg-blue-500/10 text-blue-600",
    tag: "Insights",
  },
  {
    icon: MessageCircle,
    title: "Health Assistant",
    description:
      "Chat with an AI nutrition expert 24/7. Get recipe suggestions, understand your macros, or ask what to eat for dinner.",
    color: "bg-purple-500/10 text-purple-600",
    tag: "AI Chat",
  },
  {
    icon: ShoppingCart,
    title: "Smart Grocery Lists",
    description:
      "Automatically generate grocery lists from your meal plan. Organized by category, checked off as you shop.",
    color: "bg-cyan-500/10 text-cyan-600",
    tag: "Automation",
  },
  {
    icon: CalendarDays,
    title: "Meal Logging",
    description:
      "Log meals in seconds. Track calories and macros with quick-add from recent meals and intelligent suggestions.",
    color: "bg-pink-500/10 text-pink-600",
    tag: "Tracking",
  },
  {
    icon: Dumbbell,
    title: "Workout Plans",
    description:
      "AI-generated workout plans that align with your nutrition goals. Synced calorie targets for rest days vs training days.",
    color: "bg-indigo-500/10 text-indigo-600",
    tag: "Fitness",
  },
  {
    icon: Zap,
    title: "Recipe Library",
    description:
      "Hundreds of AI-generated and curated recipes filtered by cuisine, dietary restrictions, prep time, and calorie targets.",
    color: "bg-green-500/10 text-green-700",
    tag: "Content",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary font-semibold text-sm mb-3 uppercase tracking-wider">
            Everything you need
          </p>
          <h2
            className="text-4xl sm:text-5xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Not just a calorie counter
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            NutriMind is a complete nutrition intelligence platform. Every
            feature is designed to work together.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
                style={{ "--delay": `${i * 60}ms` } as React.CSSProperties}
              >
                <div className={`inline-flex p-2.5 rounded-xl mb-4 ${feature.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-base leading-tight">
                    {feature.title}
                  </h3>
                  <span className="text-[10px] font-medium text-muted-foreground border border-border rounded-full px-2 py-0.5 shrink-0 ml-2">
                    {feature.tag}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
