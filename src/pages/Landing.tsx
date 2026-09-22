import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarRange,
  ChartColumn,
  CreditCard,
  Database,
  GraduationCap,
  Lock,
  MessageSquare,
  Terminal,
  Users,
} from "lucide-react";
import { Link } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: "easeOut" as const },
});

const modules = [
  {
    icon: Database,
    title: "Student records",
    body: "One searchable registry for every student — contact details, program, and enrollment history, deduplicated by email at the database level.",
  },
  {
    icon: CalendarRange,
    title: "Attendance",
    body: "Take attendance per class session and watch patterns surface over time, so chronic absence gets caught early instead of at term's end.",
  },
  {
    icon: ChartColumn,
    title: "Grades",
    body: "Record assessments against your own grading scale and compute per-student and per-course aggregates automatically.",
  },
  {
    icon: CreditCard,
    title: "Fees",
    body: "Track what each student owes, what has been paid, and what is overdue — with a clean ledger behind every balance.",
  },
  {
    icon: Terminal,
    title: "Timetables",
    body: "Schedule classes and rooms once, then publish live timetables to teachers and students without spreadsheet churn.",
  },
  {
    icon: MessageSquare,
    title: "Communication",
    body: "Announcements and direct threads connect teachers, students, and parents in one place — no more lost email chains.",
  },
];

const steps = [
  {
    label: "01",
    title: "Create an account",
    body: "Sign up with your email and verify with a one-time code. No credit card, no sales call.",
  },
  {
    label: "02",
    title: "Register your students",
    body: "Add students individually or browse the catalog — every record is searchable the moment it is saved.",
  },
  {
    label: "03",
    title: "Invite your people",
    body: "Each teacher, student, and parent signs in to their own dashboard with exactly the data they should see.",
  },
];

function TerminalPreview() {
  return (
    <Card className="overflow-hidden border-border/70 bg-card/80 text-left shadow-lift backdrop-blur">
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-border/70 bg-secondary/50 px-4 py-3">
        <span className="size-2.5 rounded-full bg-red-400/70" />
        <span className="size-2.5 rounded-full bg-amber-400/70" />
        <span className="size-2.5 rounded-full bg-emerald-400/70" />
        <span className="ml-3 font-mono text-xs text-muted-foreground">
          student-management — records
        </span>
      </div>
      <div className="space-y-3 p-5 font-mono text-[13px] leading-relaxed">
        <p>
          <span className="text-primary">$</span>{" "}
          <span className="text-foreground">sms search</span>{" "}
          <span className="text-muted-foreground">--query</span>{" "}
          <span className="text-violet-300">"okafor"</span>
        </p>
        <p className="text-muted-foreground">1 record found</p>
        <div className="rounded-lg border border-border/60 bg-background/60 p-3">
          <div className="flex items-center justify-between gap-3">
            <span className="font-semibold text-foreground">Amara Okafor</span>
            <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2 py-0.5 text-[11px] text-emerald-300">
              active
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Computer Science · Year 2 · amara@school.edu
          </p>
          <p className="mt-2 text-xs">
            <span className="text-primary">attendance</span>{" "}
            <span className="text-foreground">98%</span>
            <span className="mx-2 text-muted-foreground">·</span>
            <span className="text-violet-300">gpa</span>{" "}
            <span className="text-foreground">3.8</span>
            <span className="mx-2 text-muted-foreground">·</span>
            <span className="text-primary">fees</span>{" "}
            <span className="text-foreground">settled</span>
          </p>
        </div>
        <p>
          <span className="text-primary">$</span>{" "}
          <span className="text-foreground">sms record open</span>{" "}
          <span className="text-violet-300">stu_9f2c</span>
          <span className="ml-1 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-primary/70" />
        </p>
      </div>
    </Card>
  );
}

export default function Landing() {
  const { isAuthenticated, isLoading } = useAuth();
  const signedIn = !isLoading && isAuthenticated;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen overflow-hidden"
    >
      {/* backdrop */}
      <div className="grid-pattern pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute -top-48 left-1/2 h-130 w-220 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-0 top-1/3 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl"
        aria-hidden
      />

      <div className="relative flex flex-col">
        {/* nav */}
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow">
              <GraduationCap className="size-5" />
            </div>
            <span className="font-display text-lg font-semibold tracking-tight">
              Student Management System
            </span>
          </div>
          <div className="flex items-center gap-2">
            {signedIn ? (
              <Button asChild className="gap-2 rounded-xl">
                <Link to="/dashboard">
                  Open dashboard
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" className="rounded-xl">
                  <Link to="/auth">Sign in</Link>
                </Button>
                <Button asChild className="gap-2 rounded-xl shadow-glow">
                  <Link to="/auth?mode=signup">
                    Create account
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </header>

        <main className="flex-1">
          {/* hero */}
          <section className="mx-auto w-full max-w-6xl px-6 pb-20 pt-14 sm:pt-20">
            <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="text-center lg:text-left">
                <motion.p
                  {...fadeIn(0)}
                  className="mono-label text-primary"
                >
                  {/* eye-brow */}
                  School operations platform
                </motion.p>
                <motion.h1
                  {...fadeIn(0.08)}
                  className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl"
                >
                  Every student record, one{" "}
                  <span className="text-gradient">technical system</span>
                </motion.h1>
                <motion.p
                  {...fadeIn(0.16)}
                  className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0"
                >
                  Built for schools and universities: manage student data across
                  attendance, grades, fees, and timetables — and keep teachers,
                  students, and parents connected in the same workspace.
                </motion.p>
                <motion.div
                  {...fadeIn(0.24)}
                  className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
                >
                  <Button
                    asChild
                    size="lg"
                    className="h-12 gap-2 rounded-xl px-7 text-base shadow-glow transition-transform hover:-translate-y-0.5"
                  >
                    <Link to="/auth?mode=signup">
                      {signedIn ? "Open your dashboard" : "Create your account"}
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-12 gap-2 rounded-xl border-border/80 px-7 text-base"
                  >
                    <Link to={signedIn ? "/dashboard" : "/auth"}>
                      {signedIn ? (
                        "Go to dashboard"
                      ) : (
                        <>
                          <Lock className="size-4" />
                          Sign in
                        </>
                      )}
                    </Link>
                  </Button>
                </motion.div>
                <motion.p
                  {...fadeIn(0.3)}
                  className="mt-5 font-mono text-xs text-muted-foreground"
                >
                  email + one-time code · role-based access · no setup required
                </motion.p>
              </div>

              <motion.div {...fadeIn(0.32)}>
                <TerminalPreview />
              </motion.div>
            </div>
          </section>

          {/* modules */}
          <section className="mx-auto w-full max-w-6xl px-6 pb-20">
            <div className="flex flex-col gap-2 pb-8 text-center sm:text-left">
              <p className="mono-label text-muted-foreground">// modules</p>
              <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                What runs inside the system
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {modules.map((m, i) => (
                <motion.div
                  key={m.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                >
                  <Card className="group h-full border-border/70 bg-card/70 shadow-soft transition-all hover:-translate-y-1 hover:shadow-glow">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <m.icon className="size-5" />
                        </div>
                        <span className="font-mono text-xs text-muted-foreground/60">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="mt-4 font-display font-semibold tracking-tight">
                        {m.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {m.body}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* how it works */}
          <section className="mx-auto w-full max-w-6xl px-6 pb-20">
            <Card className="border-border/70 bg-secondary/40 shadow-none">
              <CardContent className="py-8">
                <p className="mono-label pb-6 text-muted-foreground">// getting started</p>
                <div className="grid gap-8 sm:grid-cols-3">
                  {steps.map((s) => (
                    <div key={s.label}>
                      <span className="font-mono text-sm text-primary">{s.label}</span>
                      <h3 className="mt-2 font-display font-semibold tracking-tight">
                        {s.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {s.body}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* audience */}
          <section className="mx-auto w-full max-w-6xl px-6 pb-20">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-border/70 bg-card/70 shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Users className="size-5" />
                  </div>
                  <h3 className="mt-4 font-display font-semibold tracking-tight">
                    Sold to institutions, not individuals
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    Schools and universities license the system as their records
                    platform of record. Administrators own the registry; staff
                    and families work from the same live data.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/70 bg-card/70 shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Terminal className="size-5" />
                  </div>
                  <h3 className="mt-4 font-display font-semibold tracking-tight">
                    Designed like a developer tool
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    Instant search, keyboard-first navigation, monospaced data
                    everywhere it matters. Built to feel like the systems your
                    IT team already trusts.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* CTA band */}
          <section className="mx-auto w-full max-w-6xl px-6 pb-24">
            <motion.div {...fadeIn(0)}>
              <div className="rounded-2xl bg-gradient-to-r from-primary/20 via-violet-500/20 to-primary/20 p-px">
                <div className="flex flex-col items-center gap-6 rounded-2xl bg-card/90 px-8 py-12 text-center">
                  <Badge
                    variant="outline"
                    className="rounded-full border-border/70 bg-background/60 font-mono text-xs text-muted-foreground"
                  >
                    version 1 · records + catalog live today
                  </Badge>
                  <h2 className="max-w-2xl font-display text-2xl font-bold tracking-tight text-balance sm:text-3xl">
                    Sign up and put your student registry online today
                  </h2>
                  <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                    Version 1 ships the foundation: accounts, your own
                    dashboard, and a searchable student catalog with full
                    detail pages. Attendance, grades, fees, timetables, and
                    messaging arrive as the platform grows.
                  </p>
                  <Button
                    asChild
                    size="lg"
                    className="h-12 gap-2 rounded-xl px-8 text-base shadow-glow"
                  >
                    <Link to="/auth?mode=signup">
                      {signedIn ? "Open dashboard" : "Create your account"}
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </section>
        </main>

        <footer className="border-t border-border/70 py-8">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 text-sm text-muted-foreground sm:flex-row">
            <div className="flex items-center gap-2">
              <GraduationCap className="size-4 text-primary" />
              <span>Student Management System</span>
            </div>
            <span className="font-mono text-xs">
              records · attendance · grades · fees · timetables · messaging
            </span>
          </div>
        </footer>
      </div>
    </motion.div>
  );
}
