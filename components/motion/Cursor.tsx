"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useTier } from "@/lib/tiers";

export function Cursor() {
  const tier = useTier();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (tier !== "A" || !dot.current || !ring.current) return;
    const d = dot.current, r = ring.current;
    document.documentElement.dataset.cursor = "custom";
    const ctx = gsap.context(() => {});
    gsap.set([d, r], { opacity: 0 });
    let shown = false;
    let current: "default" | "link" | "frame" | "signal" = "default";
    const dx = gsap.quickTo(d, "x", { duration: 0.05 }), dy = gsap.quickTo(d, "y", { duration: 0.05 });
    const rx = gsap.quickTo(r, "x", { duration: 0.12 }), ry = gsap.quickTo(r, "y", { duration: 0.12 });
    const mode = (m: "default" | "link" | "frame" | "signal", force = false) => {
      if (m === current && !force) return;
      current = m;
      // the frame pill gets a canvas backdrop (styled via data-mode) so its label reads over any capture
      r.dataset.mode = m;
      ctx.add(() => {
      // frame: a pill sized to its label (width auto, 0 14px padding), so the text never clips
      const size = m === "link" ? 48 : m === "signal" ? 10 : 28;
      gsap.to(r, m === "frame"
        ? { width: "auto", height: 32, paddingLeft: 14, paddingRight: 14, borderRadius: 999, duration: 0.24, overwrite: "auto" }
        : { width: size, height: size, paddingLeft: 0, paddingRight: 0, borderRadius: 999, duration: 0.24, overwrite: "auto" });
      gsap.to(d, { opacity: m === "link" || m === "frame" ? 0 : 1, scale: m === "signal" ? 1.6 : 1, duration: 0.2, overwrite: "auto" });
      if (label.current) {
        label.current.style.opacity = m === "frame" ? "1" : "0";
        // out of the layout when hidden, so the auto width of the frame pill is the label's width
        label.current.style.display = m === "frame" ? "" : "none";
      }
      });
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!shown) {
        shown = true;
        gsap.set([d, r], { x: e.clientX, y: e.clientY });
        gsap.set(r, { opacity: 1 });
        mode(current, true);
      }
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    };
    const over = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const t = e.target as HTMLElement;
      if (!t.closest) return;
      if (t.closest("[data-hero-poster], [data-hero-scene]")) return mode("signal");
      // "Open case" only over frames that are (inside) a link; other frames keep the default cursor
      if (t.closest("a [data-frame], a[data-frame]")) return mode("frame");
      if (t.closest("[data-frame]")) return mode("default");
      if (t.closest("a, button, [role=button], [role=tab]")) return mode("link");
      mode("default");
    };
    const leave = () => { shown = false; gsap.to([d, r], { opacity: 0, duration: 0.2, overwrite: "auto" }); };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      delete document.documentElement.dataset.cursor;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      gsap.killTweensOf([d, r]);
      ctx.revert();
    };
  }, [tier]);
  if (tier !== "A") return null;
  return (
    <>
      <div ref={dot} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[70] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal shadow-[0_0_8px_2px_rgba(255,74,38,.7)]" data-cursor-dot />
      <div ref={ring} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[70] flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-signal/70 shadow-[0_0_16px_4px_rgba(255,74,38,.18)] data-[mode=frame]:bg-canvas/80 data-[mode=frame]:backdrop-blur-sm" data-cursor-ring>
        <span ref={label} className="eyebrow whitespace-nowrap text-ink opacity-0 transition-opacity" style={{ display: "none" }}>Open case ↗</span>
      </div>
    </>
  );
}
