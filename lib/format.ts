export function formatPeriod(start: string, end: string | null): string {
  const s = start.slice(0, 4);
  if (end === null) return `${s} — now`;
  const e = end.slice(0, 4);
  return s === e ? s : `${s} — ${e}`;
}

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}
