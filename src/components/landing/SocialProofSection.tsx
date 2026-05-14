const STATS = [
  { value: "10,000+", label: "Active users" },
  { value: "2.4M+", label: "Meals planned" },
  { value: "98%", label: "User satisfaction" },
  { value: "4.9/5", label: "App rating" },
];

export function SocialProofSection() {
  return (
    <section className="py-16 border-y border-border bg-muted/30">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-sm text-muted-foreground mb-10">
          Trusted by health-conscious people worldwide
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p
                className="text-3xl font-bold gradient-text"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {value}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
