import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  ChartColumn,
  GraduationCap,
  Lock,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import logo from "@/assets/logo.svg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "react-router";

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: "easeOut" as const },
});

const features = [
  {
    icon: UserPlus,
    title: "Instant registration",
    body: "Add a student in seconds with name, email, program and year — validated server-side before it ever lands in the roster.",
  },
  {
    icon: Users,
    title: "Living roster",
    body: "Every student in one calm, searchable table. Find anyone by name, program or email without leaving the keyboard.",
  },
  {
    icon: BadgeCheck,
    title: "Clean records",
    body: "Duplicate emails are rejected at the door, so your roster stays trustworthy from the very first entry.",
  },
];

const upcoming = [
  { icon: CalendarCheck, label: "Attendance tracking" },
  { icon: ChartColumn, label: "Grades & transcripts" },
];

export default function Landing() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen overflow-hidden"
    >
      {/* backdrop texture */}
      <div className="grid-pattern pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-130 w-200 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />

      <div className="relative flex flex-col">
        {/* Nav */}
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-soft">
              <GraduationCap className="size-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Rostera</span>
          </div>
          <div className="flex items-center gap-2">
            {!isLoading && isAuthenticated ? (
              <Button asChild className="cursor-pointer gap-2 rounded-xl">
                <Link to="/dashboard">
                  Open dashboard
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild className="cursor-pointer gap-2 rounded-xl">
                <Link to="/auth">
                  Admin sign in
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            )}
          </div>
        </header>

        {/* Hero */}
        <main className="flex-1">
          <section className="mx-auto w-full max-w-6xl px-6 pb-20 pt-16 text-center sm:pt-24">
            <motion.div {...fadeIn(0)}>
              <Badge
                variant="secondary"
                className="mb-6 gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
              >
                <ShieldCheck className="size-3.5 text-primary" />
                Version 1 — built for one admin
              </Badge>
            </motion.div>

            <motion.h1
              {...fadeIn(0.08)}
              className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl"
            >
              Student management,{" "}
              <span className="text-primary">without the busywork</span>
            </motion.h1>

            <motion.p
              {...fadeIn(0.16)}
              className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              Rostera is a focused admin portal: register students, keep a clean
              roster, and know your enrollment at a glance. Sign in and start
              adding students in under a minute.
            </motion.p>

            <motion.div
              {...fadeIn(0.24)}
              className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Button
                asChild
                size="lg"
                className="h-12 cursor-pointer gap-2 rounded-xl px-7 text-base shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                <Link to="/auth?returnTo=%2Fdashboard">
                  <Lock className="size-4" />
                  Sign in as admin
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 cursor-pointer gap-2 rounded-xl border-border/80 px-7 text-base"
              >
                <Link to="/dashboard">
                  Go to dashboard
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </motion.div>

            {/* Product preview */}
            <motion.div {...fadeIn(0.32)} className="mt-16">
              <Card className="relative mx-auto max-w-4xl overflow-hidden border-border/70 text-left shadow-lift">
                <div className="flex items-center gap-1.5 border-b border-border/70 bg-secondary/60 px-4 py-3">
                  <span className="size-2.5 rounded-full bg-red-400/70" />
                  <span className="size-2.5 rounded-full bg-amber-400/70" />
                  <span className="size-2.5 rounded-full bg-emerald-400/70" />
                  <span className="ml-3 text-xs font-medium text-muted-foreground">
                    Rostera — Dashboard
                  </span>
                </div>
                <div className="grid gap-3 p-5 sm:grid-cols-3">
                  {[
                    { label: "Total students", value: "248" },
                    { label: "New this week", value: "12" },
                    { label: "Active programs", value: "7" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-border/60 bg-background p-4"
                    >
                      <p className="text-xs font-medium text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="mt-1 text-2xl font-bold tracking-tight">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                  <div className="rounded-xl border border-border/60 sm:col-span-3">
                    <div className="divide-y divide-border/60">
                      {["Amara Okafor", "Diego Ramírez", "Lena Fischer"].map(
                        (name, i) => (
                          <div
                            key={name}
                            className="flex items-center justify-between px-4 py-2.5"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                {name
                                  .split(" ")
                                  .map((p) => p[0])
                                  .join("")}
                              </div>
                              <span className="text-sm font-medium">{name}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {["Computer Science · Y2", "Design · Y1", "Mathematics · Y3"][i]}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </section>

          {/* Features */}
          <section className="mx-auto w-full max-w-6xl px-6 pb-20">
            <div className="grid gap-5 md:grid-cols-3">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <Card className="h-full border-border/70 shadow-soft transition-shadow hover:shadow-lift">
                    <CardContent className="pt-6">
                      <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <f.icon className="size-5" />
                      </div>
                      <h3 className="font-semibold tracking-tight">{f.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {f.body}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Coming next */}
          <section className="mx-auto w-full max-w-6xl px-6 pb-24">
            <Card className="border-border/70 bg-secondary/50 shadow-none">
              <CardContent className="flex flex-col items-center gap-6 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
                <div>
                  <p className="text-sm font-semibold">Coming in a later version</p>
                  <p className="mt-1 max-w-md text-sm text-muted-foreground">
                    Version 1 keeps scope tight: add and list students. Grades
                    and attendance arrive next.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {upcoming.map((u) => (
                    <Badge
                      key={u.label}
                      variant="outline"
                      className="gap-1.5 rounded-full bg-background px-3 py-1.5 text-xs font-medium"
                    >
                      <u.icon className="size-3.5 text-primary" />
                      {u.label}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </main>

        <footer className="border-t border-border/70 py-8">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 text-sm text-muted-foreground sm:flex-row">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Rostera logo" className="size-5 rounded" />
              <span>Rostera — Student Management System</span>
            </div>
            <span>Version 1 · Admin portal</span>
          </div>
        </footer>
      </div>
    </motion.div>
  );
}
