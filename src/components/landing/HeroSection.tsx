import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-28 pb-20 px-4 overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "var(--gradient-hero)" }}
      />
      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div
            className="inline-flex mb-6 animate-fade-up"
            style={{ "--delay": "0ms" } as React.CSSProperties}
          >
            <Badge
              variant="outline"
              className="gap-1.5 px-3 py-1 text-xs font-medium border-primary/30 bg-primary/5 text-primary"
            >
              <Sparkles className="h-3 w-3" />
              Powered by Google Gemini AI
            </Badge>
          </div>

          {/* Headline */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6 animate-fade-up"
            style={
              {
                fontFamily: "var(--font-display)",
                "--delay": "100ms",
              } as React.CSSProperties
            }
          >
            Your AI{" "}
            <span className="gradient-text">Nutrition Coach</span>
            {" "}That Actually Learns
          </h1>

          {/* Subheadline */}
          <p
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-up"
            style={{ "--delay": "200ms" } as React.CSSProperties}
          >
            Personalized meal plans, AI fridge scanning, real-time calorie
            tracking, and a 24/7 health assistant. Your body has unique
            needs — NutriMind adapts to them daily.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-up"
            style={{ "--delay": "300ms" } as React.CSSProperties}
          >
            <Button size="lg" className="h-12 px-8 text-base shadow-brand-lg" asChild>
              <Link href="/signup">
                Start for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-8 text-base" asChild>
              <Link href="/login">Sign in to dashboard</Link>
            </Button>
          </div>

          {/* Micro social proof */}
          <p
            className="mt-5 text-xs text-muted-foreground animate-fade-up"
            style={{ "--delay": "400ms" } as React.CSSProperties}
          >
            No credit card required · Free plan forever · Set up in 2 minutes
          </p>
        </div>

        {/* Product mockup */}
        <div
          className="mt-16 relative animate-fade-up"
          style={{ "--delay": "500ms" } as React.CSSProperties}
        >
          <div className="relative mx-auto max-w-5xl">
            {/* Glow behind mockup */}
            <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-2xl" />

            {/* Mockup frame */}
            <div className="relative rounded-2xl border border-border/60 bg-card shadow-medium overflow-hidden">
              {/* Browser chrome bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/40 border-b border-border/40">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
                  <div className="w-3 h-3 rounded-full bg-green-400/70" />
                </div>
                <div className="flex-1 mx-4 h-5 rounded bg-muted/60 text-xs flex items-center px-3 text-muted-foreground">
                  app.nutrimind.ai/dashboard
                </div>
              </div>

              {/* Dashboard preview */}
              <DashboardMockupContent />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardMockupContent() {
  const kpiCards = [
    { label: "Calories Today", value: "1,840", sub: "of 2,200 kcal", color: "text-primary", bg: "bg-primary/10" },
    { label: "Protein", value: "142g", sub: "of 150g target", color: "text-blue-600", bg: "bg-blue-500/10" },
    { label: "Water", value: "1.8L", sub: "of 2.5L goal", color: "text-cyan-600", bg: "bg-cyan-500/10" },
  ];

  const meals = [
    { name: "Avocado Toast & Eggs", time: "8:15 AM", cal: "420 kcal" },
    { name: "Grilled Chicken Salad", time: "12:30 PM", cal: "380 kcal" },
    { name: "Greek Yogurt Bowl", time: "3:00 PM", cal: "210 kcal" },
  ];

  return (
    <div className="p-5 bg-background min-h-72">
      {/* Welcome banner mockup */}
      <div className="rounded-xl bg-linear-to-r from-brand-700 to-brand-600 p-4 mb-4 text-white">
        <p className="text-white/70 text-xs mb-0.5">Good morning, Alex 👋</p>
        <p className="font-semibold text-sm">You&apos;re 84% toward your daily calorie goal</p>
        <div className="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full w-[84%] bg-white rounded-full" />
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {kpiCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-border bg-card p-3 shadow-soft">
            <p className="text-[10px] text-muted-foreground mb-1">{card.label}</p>
            <p className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{card.value}</p>
            <span className={`text-[10px] mt-1 px-1.5 py-0.5 rounded-full inline-block ${card.bg} ${card.color}`}>
              {card.sub}
            </span>
          </div>
        ))}
      </div>

      {/* Recent meals */}
      <div className="rounded-xl border border-border bg-card p-3">
        <p className="text-xs font-semibold mb-2">Recent Meals</p>
        <div className="space-y-2">
          {meals.map((meal) => (
            <div key={meal.name} className="flex items-center justify-between text-xs">
              <div>
                <p className="font-medium">{meal.name}</p>
                <p className="text-muted-foreground">{meal.time}</p>
              </div>
              <span className="text-primary font-medium">{meal.cal}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
