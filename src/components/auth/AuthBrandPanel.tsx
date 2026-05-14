import { Leaf, Star } from "lucide-react";

const TESTIMONIALS = [
  {
    text: "Lost 12 lbs in 8 weeks. The AI meal plans are genuinely delicious and I never felt hungry.",
    author: "Sarah K.",
    role: "Nurse, Dublin",
  },
  {
    text: "Finally a nutrition app that understands my Mediterranean diet preferences perfectly.",
    author: "Marco V.",
    role: "Chef, Milan",
  },
];

export function AuthBrandPanel() {
  return (
    <div className="w-full bg-linear-to-br from-brand-800 via-brand-700 to-brand-600 flex flex-col p-12 text-white relative overflow-hidden h-full min-h-screen">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] rounded-full bg-white/3 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Logo */}
      <div className="relative flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
          <Leaf className="h-5 w-5" />
        </div>
        <span className="font-bold text-lg">NutriMind AI</span>
      </div>

      {/* Main copy */}
      <div className="relative my-auto py-12">
        <p className="text-white/60 text-sm font-medium mb-4 uppercase tracking-wider">
          Nutrition Intelligence
        </p>
        <h2
          className="text-4xl font-bold leading-tight mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Your personal AI dietitian,
          <br />
          available 24/7
        </h2>
        <p className="text-white/70 text-base leading-relaxed max-w-sm">
          Personalized meal plans, smart fridge scanning, and real nutrition
          science — all powered by Google Gemini AI.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 mt-6">
          {["AI Meal Plans", "Fridge Scanner", "Calorie Tracking", "Health Chat"].map(
            (feature) => (
              <span
                key={feature}
                className="text-xs font-medium px-3 py-1 rounded-full bg-white/15 border border-white/20"
              >
                {feature}
              </span>
            )
          )}
        </div>
      </div>

      {/* Testimonials */}
      <div className="relative space-y-3">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.author}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10"
          >
            <div className="flex gap-0.5 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-white/80 text-white/80" />
              ))}
            </div>
            <p className="text-sm text-white/85 leading-relaxed mb-2">
              &ldquo;{t.text}&rdquo;
            </p>
            <div>
              <p className="text-xs font-semibold">{t.author}</p>
              <p className="text-xs text-white/50">{t.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
