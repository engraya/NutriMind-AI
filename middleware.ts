import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PUBLIC_PATHS = ["/login", "/signup", "/forgot-password", "/auth"];

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user, supabase } = await updateSession(request);
  const { pathname } = request.nextUrl;

  // Allow public assets and API routes to pass through
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/auth/callback") ||
    pathname === "/favicon.ico"
  ) {
    return supabaseResponse;
  }

  const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(`/(auth)/${p.slice(1)}`) || pathname.startsWith(p));
  const isDashboardPath = pathname.startsWith("/dashboard") ||
    pathname.startsWith("/meal-planner") ||
    pathname.startsWith("/fridge-scanner") ||
    pathname.startsWith("/analytics") ||
    pathname.startsWith("/chat") ||
    pathname.startsWith("/grocery-list") ||
    pathname.startsWith("/recipes") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/workout-plan");

  const isOnboardingPath = pathname.startsWith("/onboarding");
  const isAuthPath = pathname.startsWith("/login") || pathname.startsWith("/signup") || pathname.startsWith("/forgot-password");

  // No session: redirect dashboard routes to login
  if (!user && (isDashboardPath || isOnboardingPath)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Has session: redirect login/signup to dashboard
  if (user && isAuthPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Has session but onboarding not complete: redirect to onboarding
  if (user && isDashboardPath) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", user.id)
      .single<{ onboarding_completed: boolean }>();

    if (profile && !profile.onboarding_completed) {
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding/1";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
