"use client";
import { useEffect, useState } from "react";

export function formatSarajevoTime(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Sarajevo", hour: "2-digit", minute: "2-digit", hour12: false, timeZoneName: "short",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const zone = get("timeZoneName").replace("GMT+1", "CET").replace("GMT+2", "CEST");
  return `${get("hour")}:${get("minute")} ${zone}`;
}

export function LocalTime() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setNow(formatSarajevoTime(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>Sarajevo · {now ?? "--:-- CET"}</span>;
}
