"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Moon, Sun, Monitor, LogOut, Trash2, AlertTriangle, Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface SettingsClientProps {
  userId: string;
  email: string;
}

export function SettingsClient({ userId, email }: SettingsClientProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const signOut = async () => {
    setIsSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const THEME_OPTIONS = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ] as const;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Appearance */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-colors ${
                  theme === value
                    ? "border-brand-600 bg-brand-50 text-brand-700"
                    : "border-border hover:border-brand-300"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Account info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Email</p>
            <p className="text-sm">{email}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">User ID</p>
            <p className="text-xs text-muted-foreground font-mono">{userId}</p>
          </div>
        </CardContent>
      </Card>

      {/* Sign out */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Session</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={signOut}
            disabled={isSigningOut}
            className="w-full text-destructive hover:text-destructive hover:border-destructive"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {isSigningOut ? "Signing out..." : "Sign Out"}
          </Button>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-destructive/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-destructive flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!showDeleteConfirm ? (
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full text-destructive hover:text-destructive hover:border-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                This will permanently delete your account and all data. This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => toast.error("Account deletion requires contacting support.")}
                >
                  Confirm Delete
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
