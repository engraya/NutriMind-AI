"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Free",
    priceMonthly: 0,
    priceAnnual: 0,
    description: "Perfect for getting started with AI nutrition",
    features: [
      "1 AI meal plan per month",
      "Basic calorie & macro tracking",
      "5 fridge scans per month",
      "10 AI chat messages/month",
      "Recipe library access",
    ],
    cta: "Get started free",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Pro",
    priceMonthly: 12,
    priceAnnual: 8,
    description: "For serious health optimization",
    features: [
      "Unlimited AI meal plans",
      "Advanced nutrition analytics",
      "Unlimited fridge scans",
      "Unlimited AI health chat",
      "Workout plan generation",
      "Smart grocery lists",
      "Priority support",
    ],
    cta: "Start Pro trial",
    href: "/signup?plan=pro",
    highlight: true,
    badge: "Most Popular",
  },
  {
    name: "Team",
    priceMonthly: 29,
    priceAnnual: 19,
    description: "For nutritionists and wellness coaches",
    features: [
      "Everything in Pro",
      "Up to 10 client profiles",
      "Client progress dashboards",
      "Custom meal plan templates",
      "White-label reports",
      "Dedicated account manager",
    ],
    cta: "Contact sales",
    href: "/signup?plan=team",
    highlight: false,
  },
];

export function PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold text-sm mb-3 uppercase tracking-wider">
            Pricing
          </p>
          <h2
            className="text-4xl sm:text-5xl font-bold tracking-tight mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Simple, transparent pricing
          </h2>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-0.5 bg-muted rounded-full p-1">
            <button
              onClick={() => setAnnual(false)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                !annual
                  ? "bg-background shadow-soft text-foreground"
                  : "text-muted-foreground"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5",
                annual
                  ? "bg-background shadow-soft text-foreground"
                  : "text-muted-foreground"
              )}
            >
              Annual
              <Badge className="bg-primary/10 text-primary border-0 text-[10px] px-1.5 py-0">
                Save 33%
              </Badge>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan) => {
            const price = annual ? plan.priceAnnual : plan.priceMonthly;
            return (
              <div
                key={plan.name}
                className={cn(
                  "relative rounded-2xl border p-8 transition-all duration-300",
                  plan.highlight
                    ? "border-primary bg-primary/5 shadow-brand"
                    : "border-border bg-card shadow-soft hover:shadow-medium"
                )}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground border-0 shadow-brand">
                      <Zap className="h-3 w-3 mr-1" />
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span
                      className="text-4xl font-bold"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      ${price}
                    </span>
                    {price > 0 && (
                      <span className="text-muted-foreground text-sm">
                        {annual ? "/mo, billed annually" : "/month"}
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  className={cn("w-full mb-6", plan.highlight && "shadow-brand")}
                  variant={plan.highlight ? "default" : "outline"}
                  asChild
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>

                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
