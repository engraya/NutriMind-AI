"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  CalendarDays,
  Camera,
  BarChart3,
  MessageCircle,
  ShoppingCart,
  BookOpen,
  Dumbbell,
  User,
  Settings,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";
import { useCommandPaletteStore } from "@/store/ui.store";

const NAV_COMMANDS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Meal Planner", href: "/meal-planner", icon: CalendarDays },
  { label: "Fridge Scanner", href: "/fridge-scanner", icon: Camera },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Health Chat", href: "/chat", icon: MessageCircle },
  { label: "Grocery List", href: "/grocery-list", icon: ShoppingCart },
  { label: "Recipes", href: "/recipes", icon: BookOpen },
  { label: "Workout Plan", href: "/workout-plan", icon: Dumbbell },
];

const ACCOUNT_COMMANDS = [
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function CommandPalette() {
  const { open, setOpen } = useCommandPaletteStore();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const supabase = createClient();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [setOpen]);

  const runCommand = useCallback(
    (fn: () => void) => {
      setOpen(false);
      fn();
    },
    [setOpen]
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages, actions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigate">
          {NAV_COMMANDS.map((cmd) => {
            const Icon = cmd.icon;
            return (
              <CommandItem
                key={cmd.href}
                onSelect={() => runCommand(() => router.push(cmd.href))}
              >
                <Icon className="mr-2 h-4 w-4" />
                {cmd.label}
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Account">
          {ACCOUNT_COMMANDS.map((cmd) => {
            const Icon = cmd.icon;
            return (
              <CommandItem
                key={cmd.href}
                onSelect={() => runCommand(() => router.push(cmd.href))}
              >
                <Icon className="mr-2 h-4 w-4" />
                {cmd.label}
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() =>
              runCommand(() =>
                setTheme(theme === "dark" ? "light" : "dark")
              )
            }
          >
            {theme === "dark" ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            Toggle theme
            <CommandShortcut>⌘T</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(async () => {
                await supabase.auth.signOut();
                router.push("/login");
              })
            }
            className="text-destructive data-[selected=true]:bg-destructive/10 data-[selected=true]:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
