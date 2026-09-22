import { useQuery } from "convex/react";
import {
  ArrowRight,
  GraduationCap,
  Search,
  UserCheck,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";

import { AddStudentDialog } from "@/components/AddStudentDialog";
import { AppHeader } from "@/components/AppHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { useAuth } from "@/hooks/use-auth";
import {
  formatJoined,
  initials,
  statusClasses,
  statusLabel,
} from "@/lib/students";

type Student = Doc<"students">;

function StatCard({
  label,
  value,
  icon: Icon,
  hint,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  hint: string;
}) {
  return (
    <Card className="border-border/70 bg-card/70 shadow-soft transition-shadow hover:shadow-glow">
      <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
        <CardDescription className="mono-label text-muted-foreground">
          {label}
        </CardDescription>
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="font-display text-3xl font-bold tracking-tight tabular-nums">
          {value}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const students = useQuery(api.students.list);
  const count = useQuery(api.students.count);

  const [addOpen, setAddOpen] = useState(false);
  const [query, setQuery] = useState("");

  const list: Student[] = useMemo(() => students ?? [], [students]);

  const recent = useMemo(
    () =>
      [...list]
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 5),
    [list],
  );

  const filteredRecent = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return recent;
    return recent.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.program.toLowerCase().includes(q),
    );
  }, [recent, query]);

  const activeCount = list.filter((s) => s.status === "active").length;
  const displayName = user?.name ?? user?.email?.split("@")[0] ?? "admin";

  return (
    <div className="relative min-h-screen">
      <div
        className="grid-pattern pointer-events-none absolute inset-0"
        aria-hidden
      />
      <div className="relative flex min-h-screen flex-col">
        <AppHeader>
          <Button
            className="gap-2 rounded-xl shadow-glow"
            onClick={() => setAddOpen(true)}
          >
            <span className="font-mono text-sm">+</span>
            Register student
          </Button>
        </AppHeader>

        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
          {/* heading */}
          <div className="flex flex-col gap-1">
            <p className="mono-label text-muted-foreground">// overview</p>
            <h1 className="mt-1 font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome back, {displayName}
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              This is your workspace dashboard. Version 1 tracks student records
              end to end; attendance, grades, and fee modules plug in here as
              they ship.
            </p>
          </div>

          {/* stats */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <StatCard
              label="total records"
              value={count ?? 0}
              icon={Users}
              hint="Students registered in this workspace"
            />
            <StatCard
              label="active"
              value={activeCount}
              icon={UserCheck}
              hint="Currently marked as enrolled"
            />
          </div>

          {/* quick links */}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Link to="/students" className="group">
              <Card className="h-full border-border/70 bg-card/70 shadow-soft transition-all group-hover:-translate-y-0.5 group-hover:shadow-glow">
                <CardContent className="flex items-center justify-between pt-6">
                  <div>
                    <p className="font-display font-semibold tracking-tight">
                      Browse the catalog
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Search every student record and open a full profile.
                    </p>
                  </div>
                  <ArrowRight className="size-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
                </CardContent>
              </Card>
            </Link>
            <Link to="/students" className="group">
              <Card className="h-full border-border/70 bg-card/70 shadow-soft transition-all group-hover:-translate-y-0.5 group-hover:shadow-glow">
                <CardContent className="flex items-center justify-between pt-6">
                  <div>
                    <p className="font-display font-semibold tracking-tight">
                      Register a student
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Add a record with name, email, program, and year.
                    </p>
                  </div>
                  <GraduationCap className="size-5 shrink-0 text-primary transition-transform group-hover:scale-110" />
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* recent students */}
          <Card className="mt-8 overflow-hidden border-border/70 bg-card/70 shadow-soft">
            <CardHeader className="flex-row items-center justify-between gap-4 space-y-0 border-b border-border/70 pb-4 pt-5">
              <div>
                <CardTitle className="font-display">Recent registrations</CardTitle>
                <CardDescription>
                  {students === undefined
                    ? "Loading…"
                    : "The five most recent records"}
                </CardDescription>
              </div>
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter recent…"
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {students === undefined ? (
                <div className="space-y-3 p-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : list.length === 0 ? (
                <div className="flex flex-col items-center gap-4 px-6 py-14 text-center">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <GraduationCap className="size-7" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold tracking-tight">
                      No student records yet
                    </h3>
                    <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                      Register your first student to see them here and in the
                      searchable catalog.
                    </p>
                  </div>
                  <Button
                    className="gap-2 rounded-xl shadow-glow"
                    onClick={() => setAddOpen(true)}
                  >
                    Register first student
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Student</TableHead>
                      <TableHead className="hidden sm:table-cell">Program</TableHead>
                      <TableHead className="hidden md:table-cell">Joined</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecent.map((s) => (
                      <TableRow
                        key={s._id}
                        className="cursor-pointer"
                        onClick={() => window.location.assign(`/students/${s._id}`)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-semibold text-primary">
                                {initials(s.name)}
                              </div>
                              <div className="min-w-0">
                                <Link
                                  to={`/students/${s._id}`}
                                  className="truncate text-sm font-medium hover:text-primary hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {s.name}
                                </Link>
                                <p className="truncate font-mono text-xs text-muted-foreground">
                                  {s.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <span className="text-sm text-muted-foreground">
                              {s.program}
                            </span>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <span className="font-mono text-xs text-muted-foreground">
                              {formatJoined(s.createdAt)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`rounded-full font-mono text-[11px] ${statusClasses(s.status)}`}
                            >
                              {statusLabel(s.status)}
                            </Badge>
                          </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <div className="mt-4 pb-4 text-center">
            <Link
              to="/students"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              Open the full student catalog
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </main>

        <footer className="border-t border-border/70 py-6">
          <div className="mx-auto w-full max-w-6xl px-6 font-mono text-xs text-muted-foreground">
            Student Management System · workspace dashboard
          </div>
        </footer>
      </div>

      <AddStudentDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
