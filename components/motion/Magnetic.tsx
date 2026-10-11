"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { useTier } from "@/lib/tiers";

export function Magnetic() {
  const tier = useTier();
  const pathname = usePathname();
  useEffect(() => {
    if (tier !== "A") return;
    const ctx = gsap.context(() => {});
    const cleanups: Array<() => void> = [];
    document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
      const dot = el.querySelector<HTMLElement>("[data-magnetic-dot]");
      // The pull uses quickTo setters; the elastic return is a separate tween that overwrites them, so the setters are
      // re-created on the next pull (a quickTo whose tween was overwritten warns "not eligible for reset").
      const QUICK = { duration: 0.4, ease: "power3.out" } as const;
      let x = gsap.quickTo(el, "x", QUICK);
      let y = gsap.quickTo(el, "y", QUICK);
      let pulled = false;
      const leave = () => {
        if (!pulled) return;
        pulled = false;
        ctx.add(() => {
          gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)", overwrite: "auto" });
          x = gsap.quickTo(el, "x", QUICK);
          y = gsap.quickTo(el, "y", QUICK);
          if (dot) gsap.to(dot, { x: 0, y: 0, duration: 0.4, overwrite: "auto" });
        });
      };
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const dx = e.clientX - cx, dy = e.clientY - cy;
        if (Math.hypot(dx, dy) > 80 + r.width / 2) return leave();
        pulled = true;
        x(gsap.utils.clamp(-12, 12, dx * 0.25)); y(gsap.utils.clamp(-12, 12, dy * 0.25));
        if (dot) ctx.add(() => { gsap.to(dot, { x: -dx * 0.04, y: -dy * 0.04, duration: 0.3, overwrite: "auto" }); });
      };
      const parent = el.parentElement ?? el;
      parent.addEventListener("pointermove", move);
      parent.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        parent.removeEventListener("pointermove", move);
        parent.removeEventListener("pointerleave", leave);
        gsap.killTweensOf(el);
        if (dot) gsap.killTweensOf(dot);
        gsap.set(el, { clearProps: "x,y,transform" });
        if (dot) gsap.set(dot, { clearProps: "x,y,transform" });
      });
    });
    return () => { cleanups.forEach((c) => c()); ctx.revert(); };
  }, [tier, pathname]);
  return null;
}
