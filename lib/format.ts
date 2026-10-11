/** Label for an open-ended period, everywhere on the site and the CV. */
export const PRESENT = "present";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Years only, for compact lists: "2025 — present", "2024 — 2025", "2024". */
export function formatPeriod(start: string, end: string | null): string {
  const s = start.slice(0, 4);
  if (end === null) return `${s} — ${PRESENT}`;
  const e = end.slice(0, 4);
  return s === e ? s : `${s} — ${e}`;
}

/** "2025-07" → "Jul 2025". */
function monthYear(ym: string): string {
  return `${MONTHS[Number(ym.slice(5, 7)) - 1]} ${ym.slice(0, 4)}`;
}

/** With months: "Jul 2025 — present", "Oct 2024 — Mar 2025", "Feb — May 2024". */
export function formatPeriodMonths(start: string, end: string | null): string {
  if (end === null) return `${monthYear(start)} — ${PRESENT}`;
  if (start === end) return monthYear(start);
  if (start.slice(0, 4) === end.slice(0, 4)) return `${MONTHS[Number(start.slice(5, 7)) - 1]} — ${monthYear(end)}`;
  return `${monthYear(start)} — ${monthYear(end)}`;
}

/** "2026-10-10" → "10 Oct 2026". */
export function formatDay(isoDate: string): string {
  const [y, m, d] = isoDate.split("-");
  return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`;
}

/** The build date ("Updated …" in the footer and on /cv/); null outside `npm run build`. */
export function buildDay(): string | null {
  const built = process.env.NEXT_PUBLIC_BUILD_DATE;
  return built ? formatDay(built) : null;
}

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}
