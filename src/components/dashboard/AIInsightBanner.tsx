interface AIInsightBannerProps {
  userName?: string | null;
  caloriesConsumed: number;
  calorieTarget: number;
}

export function AIInsightBanner({
  userName,
  caloriesConsumed,
  calorieTarget,
}: AIInsightBannerProps) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const percent = Math.min(
    Math.round((caloriesConsumed / calorieTarget) * 100),
    100
  );

  const insight =
    percent < 20
      ? "You're just getting started today. Log your first meal to kick off your nutrition tracking."
      : percent < 50
      ? "Great start! You've got plenty of room in your calorie budget — keep up the healthy choices."
      : percent < 80
      ? "You're tracking well today. Balance your remaining meals to hit your goals."
      : percent < 95
      ? "Almost there — you're close to your daily target. Choose your next meal carefully."
      : "You've hit your calorie target for today. Excellent discipline! 🎉";

  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-brand-800 via-brand-700 to-brand-600 p-6 text-white shadow-brand">
      {/* Decorative circles */}
      <div className="absolute right-0 top-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute right-16 bottom-0 w-32 h-32 rounded-full bg-white/5 translate-y-1/2 pointer-events-none" />

      <div className="relative">
        <p className="text-white/70 text-sm mb-1">
          {greeting}
          {userName ? `, ${userName}` : ""} 👋
        </p>
        <h2
          className="text-xl font-bold mb-3 leading-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Here&apos;s your nutrition snapshot
        </h2>

        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-700"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="text-sm font-semibold shrink-0 tabular-nums">
            {caloriesConsumed.toLocaleString()} / {calorieTarget.toLocaleString()} kcal
          </span>
        </div>

        <p className="text-white/75 text-sm leading-relaxed max-w-lg">
          {insight}
        </p>
      </div>
    </div>
  );
}
