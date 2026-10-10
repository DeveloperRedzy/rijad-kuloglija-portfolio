"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { useTier } from "@/lib/tiers";
import { projects } from "@/content";

export function HoverPreview() {
  const tier = useTier();
  const pathname = usePathname();
  const box = useRef<HTMLDivElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    if (tier !== "A" || !box.current) return;
    const el = box.current;
    const ctx = gsap.context(() => {});
    gsap.set(el, { scale: 0.96, opacity: 0 });
    const x = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });
    let lastX = 0;
    const show = () => ctx.add(() => { gsap.to(el, { opacity: 1, scale: 1, duration: 0.25, overwrite: "auto" }); });
    const rows = document.querySelectorAll<HTMLElement>("[data-row][data-preview]");
    const cleanups: Array<() => void> = [];
    rows.forEach((row) => {
      const slug = row.dataset.preview!;
      const p = projects.find((pr) => pr.slug === slug);
      if (!p) return;
      const hero = Array.isArray(p.media.hero) ? p.media.hero[0] : p.media.hero;
      const enter = (e: PointerEvent) => { lastX = e.clientX; setSrc(hero.src); gsap.set(el, { x: e.clientX + 24, y: e.clientY - 75 }); show(); };
      const move = (e: PointerEvent) => {
        x(e.clientX + 24); y(e.clientY - 75);
        const rot = gsap.utils.clamp(-6, 6, (e.clientX - lastX) * 0.4);
        lastX = e.clientX;
        ctx.add(() => { gsap.to(el, { rotate: rot, duration: 0.3, overwrite: "auto" }); });
      };
      const leave = () => ctx.add(() => { gsap.to(el, { opacity: 0, scale: 0.96, rotate: 0, duration: 0.2, overwrite: "auto" }); });
      const focus = () => { const r = row.getBoundingClientRect(); setSrc(hero.src); gsap.set(el, { x: r.right - 260, y: r.top - 20 }); show(); };
      row.addEventListener("pointerenter", enter); row.addEventListener("pointermove", move); row.addEventListener("pointerleave", leave);
      row.addEventListener("focusin", focus); row.addEventListener("focusout", leave);
      cleanups.push(() => { row.removeEventListener("pointerenter", enter); row.removeEventListener("pointermove", move); row.removeEventListener("pointerleave", leave); row.removeEventListener("focusin", focus); row.removeEventListener("focusout", leave); });
    });
    return () => { cleanups.forEach((c) => c()); gsap.killTweensOf(el); ctx.revert(); };
  }, [tier, pathname]);
  if (tier !== "A") return null;
  return (
    <div ref={box} aria-hidden data-preview-box className="pointer-events-none fixed left-0 top-0 z-[65] w-[240px] overflow-hidden rounded-lg border border-hairline bg-surface-1 p-1 opacity-0 shadow-[0_20px_50px_rgba(0,0,0,.6)]">
      {src && (
        // eslint-disable-next-line @next/next/no-img-element -- static export, decorative preview
        <img src={src} alt="" width={240} height={150} className="block h-[150px] w-full rounded object-cover object-top" />
      )}
    </div>
  );
}
