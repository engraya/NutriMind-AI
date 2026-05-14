const STEPS = [
  {
    number: "01",
    title: "Complete your profile",
    description:
      "Tell us your age, weight, goals, dietary restrictions, and cuisine preferences. Takes 2 minutes.",
    detail:
      "Our 5-step onboarding calculates your TDEE, optimal macro splits, and daily water intake automatically.",
  },
  {
    number: "02",
    title: "Get your AI meal plan",
    description:
      "Receive a personalized 7-day meal plan generated specifically for your body and goals.",
    detail:
      "Powered by Google Gemini, plans adapt to your feedback. Don't like a meal? Swap it instantly.",
  },
  {
    number: "03",
    title: "Track, scan, improve",
    description:
      "Log meals, scan your fridge, chat with your AI nutritionist, and watch your progress.",
    detail:
      "Analytics show you exactly where you're succeeding and where to improve — updated every single day.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 px-4 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary font-semibold text-sm mb-3 uppercase tracking-wider">
            Simple process
          </p>
          <h2
            className="text-4xl sm:text-5xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            From sign-up to results in minutes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {STEPS.map((step, i) => (
            <div key={step.number} className="relative">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <span
                    className="text-xl font-bold text-primary"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {step.number}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block flex-1 h-px bg-border" />
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground mb-3 leading-relaxed">
                {step.description}
              </p>
              <p className="text-sm text-muted-foreground/70 leading-relaxed border-l-2 border-primary/30 pl-3">
                {step.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
