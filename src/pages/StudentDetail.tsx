import { useQuery } from "convex/react";
import {
  ArrowLeft,
  CalendarRange,
  ChartColumn,
  CreditCard,
  GraduationCap,
  Mail,
  ReceiptText,
  Terminal,
  UserRound,
} from "lucide-react";
import { Link, useParams } from "react-router";

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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { formatJoined, initials, statusClasses, statusLabel } from "@/lib/students";

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="shrink-0 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="min-w-0 text-right text-sm font-medium">{value}</span>
    </div>
  );
}

function ModuleStub({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/40 p-4">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4" />
      </div>
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {body}
        </p>
      </div>
    </div>
  );
}

export default function StudentDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const student = useQuery(api.students.getById, {
    id: (id ?? "") as never,
  });

  const loading = student === undefined;
  const notFound = student === null;

  return (
    <div className="relative min-h-screen">
      <div
        className="grid-pattern pointer-events-none absolute inset-0"
        aria-hidden
      />
      <div className="relative flex min-h-screen flex-col">
        <AppHeader />

        <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
          <Button
            asChild
            variant="ghost"
            className="-ml-2 gap-2 rounded-lg text-muted-foreground"
          >
            <Link to="/students">
              <ArrowLeft className="size-4" />
              Back to catalog
            </Link>
          </Button>

          {loading ? (
            <div className="mt-6 space-y-4">
              <Skeleton className="h-28 w-full rounded-xl" />
              <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
                <Skeleton className="h-64 w-full rounded-xl" />
                <Skeleton className="h-64 w-full rounded-xl" />
              </div>
            </div>
          ) : notFound ? (
            <Card className="mt-6 border-border/70 bg-card/70 shadow-soft">
              <CardContent className="flex flex-col items-center gap-4 px-6 py-16 text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <UserRound className="size-7" />
                </div>
                <div>
                  <h1 className="font-display font-semibold tracking-tight">
                    Record not found
                  </h1>
                  <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                    This student record doesn't exist or is no longer in the
                    catalog.
                  </p>
                </div>
                <Button asChild className="gap-2 rounded-xl">
                  <Link to="/students">Browse the catalog</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* identity card */}
              <Card className="mt-4 overflow-hidden border-border/70 bg-card/70 shadow-lift">
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 font-mono text-lg font-semibold text-primary">
                        {initials(student.name)}
                      </div>
                      <div className="min-w-0">
                        <h1 className="font-display text-2xl font-bold tracking-tight">
                          {student.name}
                        </h1>
                        <p className="mt-0.5 flex items-center gap-1.5 font-mono text-sm text-muted-foreground">
                          <Mail className="size-3.5 shrink-0" />
                          <span className="truncate">{student.email}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`rounded-full font-mono text-[11px] ${statusClasses(student.status)}`}
                      >
                        {statusLabel(student.status)}
                      </Badge>
                      <span className="rounded-full border border-border/60 bg-secondary/60 px-3 py-1 font-mono text-[11px] text-muted-foreground">
                        joined {formatJoined(student.createdAt)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
                {/* left: academic + module stubs */}
                <div className="space-y-4">
                  <Card className="border-border/70 bg-card/70 shadow-soft">
                    <CardHeader className="pb-3">
                      <CardTitle className="font-display text-base">
                        Academic record
                      </CardTitle>
                      <CardDescription>
                        Program and enrollment details for this student.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="divide-y divide-border/60 pt-0">
                      <DetailRow label="Program" value={student.program} />
                      <DetailRow label="Year" value={`Year ${student.year}`} />
                      <DetailRow
                        label="Status"
                        value={statusLabel(student.status)}
                      />
                      <DetailRow
                        label="Record created"
                        value={formatJoined(student.createdAt)}
                      />
                    </CardContent>
                  </Card>

                  <Card className="border-border/70 bg-card/70 shadow-soft">
                    <CardHeader className="pb-3">
                      <CardTitle className="font-display text-base">
                        Module data
                      </CardTitle>
                      <CardDescription>
                        These modules arrive in upcoming versions — the record
                        shell is ready for them.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3 pt-0 sm:grid-cols-2">
                      <ModuleStub
                        icon={CalendarRange}
                        title="Attendance"
                        body="Session-by-session presence history will live here."
                      />
                      <ModuleStub
                        icon={ChartColumn}
                        title="Grades"
                        body="Assessment scores and computed averages will appear here."
                      />
                      <ModuleStub
                        icon={CreditCard}
                        title="Fees"
                        body="Invoices, payments, and balances will be tracked here."
                      />
                      <ModuleStub
                        icon={Terminal}
                        title="Timetable"
                        body="This student's weekly class schedule will render here."
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* right: record sidebar */}
                <div className="space-y-4">
                  <Card className="border-border/70 bg-card/70 shadow-soft">
                    <CardHeader className="pb-3">
                      <CardTitle className="font-display text-base">
                        Record
                      </CardTitle>
                      <CardDescription className="font-mono text-xs">
                        id: {student._id}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-0">
                      <Separator className="opacity-50" />
                      <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
                        <p className="font-mono text-[11px] uppercase tracking-wider text-primary">
                          admin note
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                          This profile is your student record. In a later
                          version, teachers, students, and parents will each see
                          a tailored view of the same data here.
                        </p>
                      </div>
                      {user?.email && (
                        <p className="font-mono text-[11px] text-muted-foreground/70">
                          signed in as {user.email}
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-border/70 bg-card/70 shadow-soft">
                    <CardHeader className="pb-3">
                      <CardTitle className="font-display text-base">
                        Quick actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2 pt-0">
                      <Button asChild variant="outline" className="justify-start gap-2 rounded-xl">
                        <Link to="/students">
                          <GraduationCap className="size-4" />
                          Back to catalog
                        </Link>
                      </Button>
                      <Button variant="outline" disabled className="justify-start gap-2 rounded-xl opacity-60">
                        <ReceiptText className="size-4" />
                        Edit record (coming soon)
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </main>

        <footer className="border-t border-border/70 py-6">
          <div className="mx-auto w-full max-w-5xl px-6 font-mono text-xs text-muted-foreground">
            Student Management System · record detail
          </div>
        </footer>
      </div>
    </div>
  );
}
