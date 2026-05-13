import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NutriMind AI — Sign In",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-brand-50 via-white to-warm-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
              <span className="text-white text-xl font-bold">N</span>
            </div>
            <span className="text-2xl font-bold text-foreground">NutriMind</span>
            <span className="text-2xl font-bold text-brand-600">AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Your personal AI nutrition companion
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
