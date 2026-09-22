import { useQuery } from "convex/react";
import { GraduationCap, Search, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";

import { AddStudentDialog } from "@/components/AddStudentDialog";
import { AppHeader } from "@/components/AppHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import {
  formatJoined,
  initials,
  statusClasses,
  statusLabel,
} from "@/lib/students";

type Student = Doc<"students">;

export default function Students() {
  const students = useQuery(api.students.list);

  const [query, setQuery] = useState("");
  const [programFilter, setProgramFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);

  const list: Student[] = students ?? [];

  const programs = useMemo(
    () => Array.from(new Set(list.map((s) => s.program))).sort(),
    [list],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list
      .filter((s) => programFilter === "all" || s.program === programFilter)
      .filter(
        (s) =>
          !q ||
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.program.toLowerCase().includes(q),
      )
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [list, query, programFilter]);

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
            <UserPlus className="size-4" />
            <span className="hidden sm:inline">Register student</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </AppHeader>

        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
          {/* heading */}
          <div className="flex flex-col gap-1">
            <p className="mono-label text-muted-foreground">// catalog</p>
            <h1 className="mt-1 font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Student catalog
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Every record in this workspace. Search by name, email, or program,
              then open a student to see their full profile.
            </p>
          </div>

          {/* controls */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search students by name, email, or program…"
                className="pl-9"
              />
            </div>
            <Select value={programFilter} onValueChange={setProgramFilter}>
              <SelectTrigger className="w-full sm:w-56">
                <SelectValue placeholder="All programs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All programs</SelectItem>
                {programs.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* results */}
          {students === undefined ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-xl" />
              ))}
            </div>
          ) : list.length === 0 ? (
            <Card className="mt-8 border-border/70 bg-card/70 shadow-soft">
              <CardContent className="flex flex-col items-center gap-4 px-6 py-16 text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <GraduationCap className="size-7" />
                </div>
                <div>
                  <h3 className="font-display font-semibold tracking-tight">
                    The catalog is empty
                  </h3>
                  <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                    Register your first student and they will appear here
                    instantly, searchable from day one.
                  </p>
                </div>
                <Button
                  className="gap-2 rounded-xl shadow-glow"
                  onClick={() => setAddOpen(true)}
                >
                  <UserPlus className="size-4" />
                  Register first student
                </Button>
              </CardContent>
            </Card>
          ) : filtered.length === 0 ? (
            <Card className="mt-8 border-border/70 bg-card/70 shadow-soft">
              <CardContent className="px-6 py-14 text-center">
                <p className="font-display font-semibold tracking-tight">
                  No matches for “{query}”
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try a different search term or clear the program filter.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <p className="mt-6 font-mono text-xs text-muted-foreground">
                {filtered.length} of {list.length} record
                {list.length === 1 ? "" : "s"}
              </p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((s) => (
                  <Link key={s._id} to={`/students/${s._id}`} className="group">
                    <Card className="h-full border-border/70 bg-card/70 shadow-soft transition-all group-hover:-translate-y-1 group-hover:shadow-glow">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-semibold text-primary">
                              {initials(s.name)}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-display font-semibold tracking-tight">
                                {s.name}
                              </p>
                              <p className="truncate font-mono text-xs text-muted-foreground">
                                {s.email}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={`shrink-0 rounded-full font-mono text-[11px] ${statusClasses(s.status)}`}
                          >
                            {statusLabel(s.status)}
                          </Badge>
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                          <span className="truncate text-sm text-muted-foreground">
                            {s.program} · Year {s.year}
                          </span>
                          <span className="shrink-0 font-mono text-[11px] text-muted-foreground/70">
                            {formatJoined(s.createdAt)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          )}
        </main>

        <footer className="border-t border-border/70 py-6">
          <div className="mx-auto w-full max-w-6xl px-6 font-mono text-xs text-muted-foreground">
            Student Management System · catalog
          </div>
        </footer>
      </div>

      <AddStudentDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
