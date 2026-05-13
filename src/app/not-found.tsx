import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-8xl font-black text-brand-600 mb-2">404</h1>
      <h2 className="text-xl font-semibold mb-2">Page not found</h2>
      <p className="text-muted-foreground mb-6 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild className="bg-brand-600 hover:bg-brand-700 text-white">
        <Link href="/dashboard">
          <Home className="h-4 w-4 mr-1.5" />
          Back to Dashboard
        </Link>
      </Button>
    </div>
  );
}
