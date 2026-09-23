"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { login, bypassLogin } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isBypassing, setIsBypassing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleLogin(formData: FormData) {
    setIsPending(true);
    setError(null);
    try {
      const result = await login(formData);
      if (result?.error) {
        setError(result.error);
        setIsPending(false);
      } else if (result?.success) {
        window.location.href = "/dashboard";
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred during login.");
      setIsPending(false);
    }
  }

  async function handleBypass() {
    setIsBypassing(true);
    setError(null);
    try {
      document.cookie = "auth_bypass=true; path=/; max-age=604800; SameSite=Lax";
      await bypassLogin();
    } catch (e: any) {
      console.warn("Bypass login warning:", e);
    }
    window.location.href = "/dashboard";
  }

  return (
    <Card className="border-0 shadow-lg sm:border sm:shadow-sm">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Welcome back
        </CardTitle>
        <CardDescription>
          Enter your email and password or use the instant bypass.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Instant Access / Bypass Button */}
        <div className="mb-5">
          <Button
            type="button"
            onClick={handleBypass}
            disabled={isPending || isBypassing}
            className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm transition-all shadow-md group"
          >
            {isBypassing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Entering website...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-300 fill-amber-300" />
                Bypass Login (Enter Main Website)
                <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
              </span>
            )}
          </Button>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground font-medium">
                Or sign in with email
              </span>
            </div>
          </div>
        </div>

        <form action={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="rahul@example.com"
              required
              disabled={isPending || isBypassing}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-muted-foreground hover:text-primary"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                disabled={isPending || isBypassing}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          {error && (
            <div className="p-3 rounded-md bg-destructive/15 text-destructive text-sm font-medium">
              {error}
            </div>
          )}
          <Button type="submit" variant="outline" className="w-full" disabled={isPending || isBypassing}>
            {isPending ? "Logging in..." : "Log in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
