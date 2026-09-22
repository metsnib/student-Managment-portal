import { useMutation, useQuery } from "convex/react";
import {
  GraduationCap,
  Loader2,
  LogOut,
  Plus,
  Search,
  Trash2,
  UserPlus,
  Users,
  UserCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@/hooks/use-auth";

const PROGRAMS = [
  "Computer Science",
  "Business Administration",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Design",
  "Mathematics",
  "Medicine",
  "Law",
];

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

type Student = Doc<"students">;

function AddStudentDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const addStudent = useMutation(api.students.add);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [program, setProgram] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setName("");
    setEmail("");
    setProgram("");
    setYear("");
    setError(null);
  };

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
    if (!next) reset();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await addStudent({
        name,
        email,
        program,
        year: Number(year),
      });
      toast.success(`${name.trim()} added to the roster`);
      handleOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Register a student</DialogTitle>
          <DialogDescription>
            Add a student to the roster. The email must be unique.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="student-name">Full name</Label>
            <Input
              id="student-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Amara Okafor"
              required
              minLength={2}
              maxLength={80}
              autoFocus
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="student-email">Email</Label>
            <Input
              id="student-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="amara@school.edu"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="student-program">Program</Label>
              <Select value={program} onValueChange={setProgram}>
                <SelectTrigger id="student-program" className="w-full">
                  <SelectValue placeholder="Choose program" />
                </SelectTrigger>
                <SelectContent>
                  {PROGRAMS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="student-year">Year</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger id="student-year" className="w-full">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4].map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      Year {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter className="mt-1">
            <Button
              type="button"
              variant="outline"
              className="rounded-lg"
              onClick={() => handleOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-lg"
              disabled={
                submitting || !name.trim() || !email.trim() || !program || !year
              }
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add student"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

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
    <Card className="border-border/70 shadow-soft transition-shadow hover:shadow-lift">
      <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
        <CardDescription className="text-xs font-medium uppercase tracking-wide">
          {label}
        </CardDescription>
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight tabular-nums">
          {value}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <UserPlus className="size-7" />
      </div>
      <div>
        <h3 className="font-semibold tracking-tight">Your roster is empty</h3>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
          Version 1 does two things well: register students and keep a clean,
          searchable list. Start by adding your first student.
        </p>
      </div>
      <Button className="cursor-pointer gap-2 rounded-xl" onClick={onAdd}>
        <Plus className="size-4" />
        Add first student
      </Button>
    </div>
  );
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const students = useQuery(api.students.list);
  const count = useQuery(api.students.count);
  const removeStudent = useMutation(api.students.remove);

  const [query, setQuery] = useState("");
  const [removingId, setRemovingId] = useState<Id<"students"> | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const list: Student[] = students ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.program.toLowerCase().includes(q),
    );
  }, [list, query]);

  const activeCount = list.filter((s) => s.status === "active").length;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleRemove = async (id: Id<"students">, name: string) => {
    if (!window.confirm(`Remove ${name} from the roster?`)) return;
    setRemovingId(id);
    try {
      await removeStudent({ id });
      toast.success(`${name} removed`);
    } catch {
      toast.error("Failed to remove student.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div
        className="grid-pattern pointer-events-none absolute inset-0"
        aria-hidden
      />

      <div className="relative flex min-h-screen flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-border/70 bg-background/80 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-soft">
                <GraduationCap className="size-5" />
              </div>
              <span className="text-lg font-semibold tracking-tight">
                Rostera
              </span>
              <Badge
                variant="secondary"
                className="ml-1 hidden rounded-full text-xs font-medium sm:inline-flex"
              >
                Admin
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              {user?.name || user?.email ? (
                <span className="hidden text-sm font-medium text-muted-foreground sm:block">
                  {user.name ?? user.email}
                </span>
              ) : null}
              <Button
                variant="outline"
                className="cursor-pointer gap-2 rounded-xl"
                onClick={handleSignOut}
              >
                <LogOut className="size-4" />
                Sign out
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
          {/* Page heading */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Admin portal
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                Student roster
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Register students and keep your list clean — that&apos;s
                version 1.
              </p>
            </div>
            <Button
              className="cursor-pointer gap-2 rounded-xl shadow-soft sm:self-end"
              onClick={() => setAddOpen(true)}
            >
              <Plus className="size-4" />
              Add student
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <StatCard
              label="Total students"
              value={count ?? 0}
              icon={Users}
              hint="All students ever registered"
            />
            <StatCard
              label="Active"
              value={activeCount}
              icon={UserCheck}
              hint="Currently enrolled"
            />
          </div>

          {/* Roster table */}
          <Card className="mt-8 overflow-hidden border-border/70 shadow-soft">
            <CardHeader className="flex-row items-center justify-between space-y-0 gap-4 border-b border-border/70 pb-4 pt-5">
              <div>
                <CardTitle>Roster</CardTitle>
                <CardDescription>
                  {students === undefined
                    ? "Loading…"
                    : list.length === 0
                      ? "No students yet"
                      : `${filtered.length} of ${list.length} student${list.length === 1 ? "" : "s"}`}
                </CardDescription>
              </div>
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name, email, program…"
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
                <EmptyState onAdd={() => setAddOpen(true)} />
              ) : filtered.length === 0 ? (
                <div className="px-6 py-12 text-center text-sm text-muted-foreground">
                  No students match “{query}”.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Student</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Program
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Year
                      </TableHead>
                      <TableHead className="hidden lg:table-cell">
                        Joined
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-12" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((s) => (
                      <TableRow key={s._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                              {initials(s.name)}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">
                                {s.name}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">
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
                          <span className="text-sm tabular-nums text-muted-foreground">
                            Y{s.year}
                          </span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className="text-sm text-muted-foreground">
                            {new Date(s.createdAt).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              s.status === "active"
                                ? "rounded-full border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "rounded-full border-red-200 bg-red-50 text-red-700"
                            }
                          >
                            {s.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemove(s._id, s.name)}
                            disabled={removingId === s._id}
                            aria-label={`Remove ${s.name}`}
                          >
                            {removingId === s._id ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <Trash2 className="size-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </main>

        <footer className="border-t border-border/70 py-6">
          <div className="mx-auto w-full max-w-6xl px-6 text-sm text-muted-foreground">
            Rostera — Version 1: registration + roster. Grades and attendance
            coming later.
          </div>
        </footer>
      </div>

      <AddStudentDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
