"use client";
import { usePathname } from "next/navigation";
export function Vignette() {
  if (usePathname().startsWith("/cv")) return null;
  return (
    <div
      data-grain
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[59]"
      style={{ background: "radial-gradient(120% 90% at 50% 50%, transparent 60%, rgba(10,9,8,.55) 100%)", opacity: 0.6 }}
    />
  );
}
