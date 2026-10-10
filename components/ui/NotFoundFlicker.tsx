"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useTier } from "@/lib/tiers";
import { Monogram } from "@/components/brand/Monogram";

const RADIUS = 120;

export function NotFoundFlicker() {
  const tier = useTier();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!tier || tier === "C" || !ref.current) return;
    const dot = ref.current.querySelector<SVGCircleElement>("[data-signal-dot]");
    if (!dot) return;
    const css = getComputedStyle(document.documentElement);
    const LIT = css.getPropertyValue("--color-signal").trim() || "#FF4A26";
    const MUTED = css.getPropertyValue("--color-ink-muted").trim() || "#8A857E";
    let removeListener: (() => void) | undefined;
    const ctx = gsap.context(() => {
      const flicker = () =>
        gsap.timeline()
          .to(dot, { fill: LIT, duration: 0.05 })
          .to(dot, { fill: MUTED, duration: 0.05 })
          .to(dot, { fill: LIT, duration: 0.08 })
          .to(dot, { fill: MUTED, duration: 0.12 })
          .to(dot, { fill: LIT, duration: 0.3, delay: 0.1 });
      if (tier === "B") {
        flicker();
        return;
      }
      // idle -> busy (flickering, lit, then back to muted) -> away (waits for the pointer to leave) -> idle
      let state: "idle" | "busy" | "away" = "idle";
      const onMove = (e: PointerEvent) => {
        if (state === "busy") return;
        const r = dot.getBoundingClientRect();
        const near = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)) < RADIUS;
        if (!near) { if (state === "away") state = "idle"; return; }
        if (state !== "idle") return;
        state = "busy";
        ctx.add(() => {
          flicker().to(dot, { fill: MUTED, duration: 0.3, delay: 1.2, onComplete: () => { state = "away"; } });
        });
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      removeListener = () => window.removeEventListener("pointermove", onMove);
    });
    return () => {
      removeListener?.();
      ctx.revert();
    };
  }, [tier]);
  return (
    <div ref={ref}>
      <Monogram size={160} lit={false} glow={false} className="text-[#1C1A18]" title="Redzy monogram, unlit" />
    </div>
  );
}
