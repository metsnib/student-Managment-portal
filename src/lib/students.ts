/** Shared helpers for student records used across dashboard, catalog, and detail pages. */

export type StudentStatus = "active" | "inactive";

export const PROGRAMS = [
  "Computer Science",
  "Business Administration",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Design",
  "Mathematics",
  "Medicine",
  "Law",
] as const;

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function formatJoined(timestamp: number) {
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function statusClasses(status: StudentStatus) {
  return status === "active"
    ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-300"
    : "border-red-400/25 bg-red-400/10 text-red-300";
}

export function statusLabel(status: StudentStatus) {
  return status === "active" ? "Active" : "Inactive";
}

/** Rough match of the user's email against the student record on the detail page. */
export function isOwnRecord(userEmail: string | undefined, studentEmail: string) {
  return !!userEmail && userEmail.trim().toLowerCase() === studentEmail.toLowerCase();
}
