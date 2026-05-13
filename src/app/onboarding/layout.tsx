import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NutriMind AI — Set Up Your Profile",
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-linear-to-br from-brand-50 via-white to-warm-50 flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-center border-b border-border/40 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">N</span>
          </div>
          <span className="font-bold text-foreground">NutriMind AI</span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">{children}</div>
      </main>
    </div>
  );
}
