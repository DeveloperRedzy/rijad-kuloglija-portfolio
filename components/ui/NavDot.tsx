"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useTier } from "@/lib/tiers";
import { hasLanded } from "@/lib/ready";

export function NavDot() {
  const tier = useTier();
  const ref = useRef<HTMLButtonElement>(null);
  const ctx = useRef<gsap.Context | null>(null);
  const [landed, setLanded] = useState(false);

  useEffect(() => {
    const on = () => setLanded(true);
    if (hasLanded()) on();
    window.addEventListener("redzy:landed", on);
    return () => window.removeEventListener("redzy:landed", on);
  }, []);

  useEffect(() => () => {
    ctx.current?.revert();
    ctx.current = null;
    document.querySelectorAll("[data-ping-band]").forEach((b) => b.remove());
  }, []);

  const ping = () => {
    if (!tier || tier === "C") return;
    ctx.current ??= gsap.context(() => {});
    ctx.current.add(() => {
      const band = document.createElement("span");
      band.className = "pointer-events-none fixed inset-x-0 z-[75] h-[40vh]";
      band.style.background = "linear-gradient(180deg, rgba(255,74,38,0), rgba(255,74,38,.18), rgba(255,74,38,0))";
      band.setAttribute("data-ping-band", "");
      document.body.append(band);
      gsap.fromTo(band, { top: "-40vh" }, { top: "110vh", duration: 0.6, ease: "power2.inOut", onComplete: () => band.remove() });
      gsap.fromTo(ref.current, { scale: 1.8 }, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" });
    });
  };

  return (
    <button
      ref={ref}
      type="button"
      data-nav-dot
      onClick={ping}
      aria-label="Send a ping"
      className={`nav-dot-landed pointer-events-auto relative inline-flex h-[5px] w-[5px] items-center after:absolute after:-inset-[10px] after:content-[''] justify-center rounded-full transition-opacity focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal ${landed ? "opacity-100" : "opacity-0"}`}
    >
      <span aria-hidden className="absolute inset-0 rounded-full bg-signal motion-safe:animate-[navpulse_2.4s_ease-in-out_infinite] shadow-[0_0_6px_1px_rgba(255,74,38,.6)]" />
    </button>
  );
}
