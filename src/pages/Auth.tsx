import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuth } from "@/hooks/use-auth";
import {
  GraduationCap,
  Loader2,
  Mail,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

interface AuthProps {
  redirectAfterAuth?: string;
}

function resolveRedirectAfterAuth(
  returnTo: string | null,
  fallback = "/dashboard",
) {
  if (returnTo?.startsWith("/") && !returnTo.startsWith("//")) {
    return returnTo;
  }
  return fallback;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = resolveRedirectAfterAuth(
    searchParams.get("returnTo"),
    redirectAfterAuth,
  );
  const mode = searchParams.get("mode") === "signup" ? "signup" : "signin";
  const [step, setStep] = useState<"email" | { email: string }>("email");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirect, { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate, redirect]);

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      setStep({ email: formData.get("email") as string });
      setIsLoading(false);
    } catch (error) {
      console.error("Email sign-in error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to send verification code. Please try again.",
      );
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      navigate(redirect, { replace: true });
    } catch (error) {
      console.error("OTP verification error:", error);
      setError("The verification code you entered is incorrect.");
      setIsLoading(false);
      setOtp("");
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
      <div
        className="grid-pattern pointer-events-none absolute inset-0"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-96 w-144 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
        aria-hidden
      />

      <div className="relative flex w-full max-w-sm flex-col items-center">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-6 flex cursor-pointer items-center gap-2.5"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow">
            <GraduationCap className="size-5" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            Student Management System
          </span>
        </button>

        <Card className="w-full border-border/70 bg-card/90 shadow-lift backdrop-blur">
          {step === "email" ? (
            <>
              <CardHeader className="text-center">
                <CardTitle className="font-display text-xl">
                  {mode === "signup" ? "Create your account" : "Sign in"}
                </CardTitle>
                <CardDescription>
                  {mode === "signup"
                    ? "Enter your email to set up your institution's workspace. We'll send a one-time code to verify it."
                    : "Enter your email and we'll send a one-time code to sign you in."}
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleEmailSubmit}>
                <CardContent>
                  <div className="relative flex items-center gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        name="email"
                        placeholder={mode === "signup" ? "you@school.edu" : "name@school.edu"}
                        type="email"
                        className="pl-9"
                        autoComplete="email"
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <Button type="submit" disabled={isLoading} className="rounded-lg px-4">
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Send code"
                      )}
                    </Button>
                  </div>
                  {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
                </CardContent>
              </form>
            </>
          ) : (
            <>
              <CardHeader className="text-center">
                <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="size-5" />
                </div>
                <CardTitle>Check your email</CardTitle>
                <CardDescription>
                  We sent a 6-digit code to {step.email}
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleOtpSubmit}>
                <CardContent className="pb-4">
                  <input type="hidden" name="email" value={step.email} />
                  <input type="hidden" name="code" value={otp} />

                  <div className="flex justify-center">
                    <InputOTP
                      value={otp}
                      onChange={setOtp}
                      maxLength={6}
                      disabled={isLoading}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && otp.length === 6 && !isLoading) {
                          const form = (e.target as HTMLElement).closest("form");
                          if (form) {
                            form.requestSubmit();
                          }
                        }
                      }}
                    >
                      <InputOTPGroup>
                        {Array.from({ length: 6 }).map((_, index) => (
                          <InputOTPSlot key={index} index={index} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  {error && (
                    <p className="mt-2 text-center text-sm text-destructive">
                      {error}
                    </p>
                  )}
                  <p className="mt-4 text-center text-sm text-muted-foreground">
                    Didn't receive a code?{" "}
                    <Button
                      variant="link"
                      className="h-auto p-0"
                      onClick={() => setStep("email")}
                    >
                      Try again
                    </Button>
                  </p>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify code"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep("email")}
                    disabled={isLoading}
                    className="w-full"
                  >
                    Use a different email
                  </Button>
                </CardFooter>
              </form>
            </>
          )}

          <div className="rounded-b-lg border-t bg-secondary/50 px-6 py-4 text-center text-xs text-muted-foreground">
            {mode === "signup" ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                  onClick={() => navigate("/auth")}
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                New here?{" "}
                <button
                  type="button"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                  onClick={() => navigate("/auth?mode=signup")}
                >
                  Create an account
                  <UserPlus className="ml-1 inline size-3" />
                </button>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}
