import type { Metadata } from "next";
import { Leaf } from "lucide-react";
import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";

export const metadata: Metadata = {
  title: "NutriMind AI — Sign In",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — brand side (desktop only) */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden">
        <AuthBrandPanel />
      </div>

      {/* Right panel — form side */}
      <div className="flex-1 flex flex-col bg-background">
        {/* Mobile logo bar */}
        <div className="lg:hidden flex items-center gap-2 p-6 border-b border-border">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Leaf className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-bold text-sm">
            NutriMind<span className="text-primary">AI</span>
          </span>
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>

        {/* Legal footer */}
        <div className="p-6 text-center">
          <p className="text-xs text-muted-foreground">
            By continuing you agree to our{" "}
            <a href="#" className="underline hover:text-foreground transition-colors">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-foreground transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
