import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-background mesh-bg">
      <p
        className="text-8xl font-black gradient-text mb-2 leading-none"
        style={{ fontFamily: "var(--font-display)" }}
      >
        404
      </p>
      <h2
        className="text-2xl font-bold mb-3"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Page not found
      </h2>
      <p className="text-muted-foreground mb-8 max-w-sm leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Button asChild className="shadow-brand">
        <Link href="/dashboard">
          <Home className="h-4 w-4 mr-1.5" />
          Back to Dashboard
        </Link>
      </Button>
    </div>
  );
}
