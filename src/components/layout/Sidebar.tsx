"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  Camera,
  BarChart3,
  MessageCircle,
  ShoppingCart,
  BookOpen,
  User,
  Settings,
  Dumbbell,
  ChevronLeft,
  LogOut,
  Leaf,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const NAV_SECTIONS = [
  {
    label: "Core",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    label: "AI Tools",
    items: [
      { href: "/meal-planner", label: "Meal Planner", icon: CalendarDays },
      { href: "/fridge-scanner", label: "Fridge Scanner", icon: Camera },
      { href: "/chat", label: "Health Chat", icon: MessageCircle },
      { href: "/recipes", label: "Recipes", icon: BookOpen },
    ],
  },
  {
    label: "Manage",
    items: [
      { href: "/grocery-list", label: "Grocery List", icon: ShoppingCart },
      { href: "/workout-plan", label: "Workout Plan", icon: Dumbbell },
    ],
  },
];

const BOTTOM_ITEMS = [
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  const activeClass =
    "bg-linear-to-r from-primary/15 to-primary/5 text-primary border-l-2 border-primary";
  const inactiveClass =
    "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border-l-2 border-transparent";

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "hidden md:flex flex-col h-screen sticky top-0 border-r border-sidebar-border bg-sidebar-background transition-all duration-300",
          collapsed ? "w-16" : "w-56"
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 p-4 border-b border-sidebar-border hover:opacity-80 transition-opacity",
            collapsed && "justify-center"
          )}
        >
          <div
            className={cn(
              "w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0 transition-all duration-300",
              !collapsed && "shadow-brand"
            )}
          >
            <Leaf className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <span className="font-bold text-sm text-sidebar-foreground">
              NutriMind<span className="text-primary">AI</span>
            </span>
          )}
        </Link>

        {/* Nav sections */}
        <nav className="flex-1 p-2 overflow-y-auto space-y-4 py-4">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              {/* Section label */}
              {!collapsed && (
                <p className="text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40 px-3 mb-1.5">
                  {section.label}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map(({ href, label, icon: Icon }) => {
                  const active = isActive(href);
                  if (collapsed) {
                    return (
                      <Tooltip key={href}>
                        <TooltipTrigger asChild>
                          <Link
                            href={href}
                            className={cn(
                              "flex items-center justify-center w-full h-9 rounded-lg transition-all duration-150",
                              active
                                ? "bg-primary/15 text-primary"
                                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">{label}</TooltipContent>
                      </Tooltip>
                    );
                  }
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 pl-3",
                        active ? activeClass : inactiveClass
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          active && "text-primary"
                        )}
                      />
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom items */}
        <div className="p-2 border-t border-sidebar-border space-y-0.5 pb-4">
          {BOTTOM_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            if (collapsed) {
              return (
                <Tooltip key={href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={href}
                      className={cn(
                        "flex items-center justify-center w-full h-9 rounded-lg transition-all duration-150",
                        active
                          ? "bg-primary/15 text-primary"
                          : "text-sidebar-foreground hover:bg-sidebar-accent"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{label}</TooltipContent>
                </Tooltip>
              );
            }
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 pl-3",
                  active ? activeClass : inactiveClass
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    active && "text-primary"
                  )}
                />
                {!collapsed && label}
              </Link>
            );
          })}

          {/* Sign out */}
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleSignOut}
                  className="flex items-center justify-center w-full h-9 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Sign Out</TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          )}

          {/* Collapse toggle */}
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full mt-2 h-8 text-sidebar-foreground/60 hover:text-sidebar-foreground",
              collapsed && "justify-center"
            )}
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform duration-300",
                collapsed && "rotate-180"
              )}
            />
            {!collapsed && <span className="ml-1 text-xs">Collapse</span>}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
