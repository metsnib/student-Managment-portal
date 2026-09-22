import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { GraduationCap, LogOut } from "lucide-react";
import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router";

/**
 * Top navigation bar for authenticated pages. `variant="public"` swaps the
 * admin badge for a plain logo link (used on the detail page, where visitors
 * may be signed out).
 */
export function AppHeader({
  variant = "app",
  children,
}: {
  variant?: "app" | "public";
  children?: ReactNode;
}) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <Link
            to="/dashboard"
            className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow"
          >
            <GraduationCap className="size-5" />
          </Link>
          <Link
            to="/dashboard"
            className="truncate font-display text-lg font-semibold tracking-tight"
          >
            Student Management System
          </Link>
          {variant === "app" && (
            <Badge
              variant="secondary"
              className="ml-1 hidden rounded-full font-mono text-[11px] font-medium tracking-wide sm:inline-flex"
            >
              admin
            </Badge>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {children}
          {user?.name || user?.email ? (
            <span className="hidden text-sm font-medium text-muted-foreground lg:block">
              {user.name ?? user.email}
            </span>
          ) : null}
          {variant === "app" && (
            <Button
              variant="outline"
              className="gap-2 rounded-xl"
              onClick={handleSignOut}
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
