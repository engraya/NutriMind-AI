import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-brand-800 via-brand-700 to-brand-600 p-12 text-white">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/3 -translate-x-1/3 pointer-events-none" />

          <div className="relative">
            <h2
              className="text-4xl sm:text-5xl font-bold mb-4 leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Transform your health,
              <br />
              starting today
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
              Join 10,000+ people who use NutriMind AI to eat better, feel
              stronger, and achieve their health goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="h-12 px-8 text-base bg-white text-brand-700 hover:bg-white/90"
                asChild
              >
                <Link href="/signup">
                  Get started for free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <p className="mt-4 text-white/50 text-sm">
              No credit card required · Cancel anytime · Free plan forever
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
