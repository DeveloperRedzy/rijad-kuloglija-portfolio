# Redzy Portfolio Redesign, Plan 2: Signal Hero, Motion System and Launch

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** On top of the Plan 1 site, add the Three.js Signal hero with the scroll "dive into the dot", the GSAP motion system (text reveals, light sweeps, chapter choreography, progress rail), the signal cursor, magnetic pills, hover previews, the real-progress loader, shader-hover frames, performance gates, and ship to production at rijadkuloglija.com.

**Architecture:** A single `MotionTier` context (A full / B poster / C static) decided once on the client gates every effect. GSAP + ScrollTrigger drive all scroll-linked animation; Lenis provides smooth scroll on Tier A; React Three Fiber renders one lazy hero scene (and, on Tier A, a shared `View`-based canvas for shader frames). Every effect degrades to the Plan 1 static state.

**Tech Stack:** gsap 3.15 (ScrollTrigger, SplitText, DrawSVGPlugin, free license), lenis 1.3, three 0.186, @react-three/fiber 9, @react-three/drei 10, @react-three/postprocessing 3, detect-gpu 5, @lhci/cli 0.15, @next/bundle-analyzer.

**Spec:** `docs/superpowers/specs/2026-10-09-portfolio-redesign-design.md` §3.5, §6, §7.3, §10 budgets, §12, §13, §15.

## Global Constraints

- Everything in Plan 1's Global Constraints still applies.
- Tiers (spec §6.4): A = pointer: fine, width ≥ 1024, GPU tier ≥ 2, WebGL available, no reduced motion. B = touch or width < 1024 or GPU tier 1. C = reduced motion, GPU tier 0, or no WebGL. Every effect reads the tier from `useTier()`; no component may call `detect-gpu` or `matchMedia` directly.
- `prefers-reduced-motion: reduce` ⇒ Tier C ⇒ no GSAP tweens run, no canvas mounts, Lenis is not created, text is static.
- Budgets: initial JS ≤ 200 KB gzipped (GSAP core + ScrollTrigger + SplitText included); the 3D chunk (`three`, R3F, drei, postprocessing, scene code) is `dynamic(..., { ssr: false })`, loaded only on Tier A after `requestIdleCallback`, ≤ 400 KB gzipped. Lighthouse mobile on `/` ≥ 90 Performance, CLS ≤ 0.05; desktop ≥ 80.
- Register GSAP plugins once in `lib/gsap.ts`; import `gsap` only from there.
- Durations: UI 240 ms, section enters 600 ms, light sweeps 1200 ms; ease `power2.out` / `expo.out`; scrub 0.6 on scroll-linked timelines.
- All ScrollTriggers created inside `useGSAP(..., { scope })` (from `@gsap/react`) so they are cleaned up on unmount and on route change.
- Commit after every task; conventional prefixes; `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

## File structure (created by this plan)

```
lib/tiers.ts                     resolveTier() pure function + TierProvider + useTier()
lib/gsap.ts                      gsap + ScrollTrigger + SplitText + DrawSVGPlugin registration
components/motion/SmoothScroll.tsx      Lenis (Tier A)
components/motion/SplitReveal.tsx       line reveals on [data-split]
components/motion/LightSweeps.tsx       sweeps on [data-frame] and [data-sweep-section]
components/motion/ChapterChoreo.tsx     stacking scale/dim + progress rail
components/motion/ProgressRail.tsx
components/motion/Cursor.tsx            signal cursor (Tier A)
components/motion/Magnetic.tsx          magnetic pills (Tier A)
components/motion/HoverPreview.tsx      floating thumbnails on [data-row]
components/motion/DrawArrows.tsx        DrawSVG on arrow icons (Tier A)
components/brand/Loader.tsx             real-progress loader
components/ui/NavDot.tsx                pulsing navbar dot + ping
components/hero/HeroScene.tsx           R3F scene (dynamic)
components/hero/RLetter.tsx             extruded monogram mesh
components/hero/HeroDive.tsx            GSAP timeline binding scroll → scene + DOM
components/hero/HeroOverlay.tsx         white flash + receding radial + Tier B fade
components/work/ShaderFrame.tsx         Tier A hover shader on frames (drei View)
components/work/FrameCanvas.tsx         single shared canvas for shader frames
components/home/ContactAssemble.tsx     monogram assembles on enter
components/ui/NotFoundFlicker.tsx       404 dot flicker
scripts/render-poster.mjs               captures the 3D hero to WebP posters
lighthouserc.json, .github/workflows/lighthouse.yml
tests/unit/tiers.test.ts, tests/e2e/motion.spec.ts, tests/e2e/perf.spec.ts
```

---

### Task 1: Motion tiers, GSAP registration, smooth scroll

**Files:**
- Create: `lib/tiers.ts`, `lib/gsap.ts`, `components/motion/SmoothScroll.tsx`, `components/motion/MotionRoot.tsx`, `tests/unit/tiers.test.ts`
- Modify: `app/layout.tsx`, `package.json`

**Interfaces:**
- Produces: `type Tier = 'A' | 'B' | 'C'`; `resolveTier(input: TierInput): Tier` with `TierInput = { gpuTier: 0|1|2|3; pointerFine: boolean; width: number; reducedMotion: boolean; webgl: boolean }`; `<TierProvider>`; `useTier(): Tier | null` (null until resolved on the client); `gsap`, `ScrollTrigger`, `SplitText`, `DrawSVGPlugin` from `@/lib/gsap`; `document.documentElement.dataset.tier` set to the tier for CSS hooks.

- [ ] **Step 1: Write the tier test**

`tests/unit/tiers.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { resolveTier } from "../../lib/tiers";

const base = { gpuTier: 3 as const, pointerFine: true, width: 1440, reducedMotion: false, webgl: true };

describe("resolveTier", () => {
  it("A on a capable desktop", () => expect(resolveTier(base)).toBe("A"));
  it("B on touch", () => expect(resolveTier({ ...base, pointerFine: false })).toBe("B"));
  it("B under 1024px", () => expect(resolveTier({ ...base, width: 1023 })).toBe("B"));
  it("B on gpu tier 1", () => expect(resolveTier({ ...base, gpuTier: 1 })).toBe("B"));
  it("C on reduced motion even on a capable desktop", () => expect(resolveTier({ ...base, reducedMotion: true })).toBe("C"));
  it("C on gpu tier 0 or no webgl", () => {
    expect(resolveTier({ ...base, gpuTier: 0 })).toBe("C");
    expect(resolveTier({ ...base, webgl: false })).toBe("C");
  });
});
```

Run: `npm test` → FAIL.

- [ ] **Step 2: Install and write tiers**

```bash
npm install gsap@^3.15 @gsap/react@^2 lenis@^1.3 detect-gpu@^5
```

`lib/tiers.ts`:

```tsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";

export type Tier = "A" | "B" | "C";
export type TierInput = { gpuTier: 0 | 1 | 2 | 3; pointerFine: boolean; width: number; reducedMotion: boolean; webgl: boolean };

export function resolveTier(i: TierInput): Tier {
  if (i.reducedMotion || i.gpuTier === 0 || !i.webgl) return "C";
  if (!i.pointerFine || i.width < 1024 || i.gpuTier < 2) return "B";
  return "A";
}

const TierContext = createContext<Tier | null>(null);

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch { return false; }
}

export function TierProvider({ children }: { children: React.ReactNode }) {
  const [tier, setTier] = useState<Tier | null>(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const pointerFine = matchMedia("(pointer: fine)").matches;
      const webgl = hasWebGL();
      let gpuTier: TierInput["gpuTier"] = 1;
      if (!reducedMotion && webgl && pointerFine && innerWidth >= 1024) {
        const { getGPUTier } = await import("detect-gpu");
        gpuTier = (await getGPUTier()).tier as TierInput["gpuTier"];
      }
      const t = resolveTier({ gpuTier, pointerFine, width: innerWidth, reducedMotion, webgl });
      if (cancelled) return;
      document.documentElement.dataset.tier = t;
      setTier(t);
    })();
    return () => { cancelled = true; };
  }, []);
  return <TierContext.Provider value={tier}>{children}</TierContext.Provider>;
}

export function useTier(): Tier | null {
  return useContext(TierContext);
}
```

Run: `npm test` → PASS.

- [ ] **Step 3: Register GSAP once**

`lib/gsap.ts`:

```ts
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);
  gsap.defaults({ ease: "power2.out", duration: 0.6 });
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin };
```

- [ ] **Step 4: Smooth scroll and the motion root**

`components/motion/SmoothScroll.tsx`:

```tsx
"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useTier } from "@/lib/tiers";

export function SmoothScroll() {
  const tier = useTier();
  useEffect(() => {
    if (tier !== "A") return;
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    // anchor links: let Lenis scroll to hashes with the navbar offset
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a[href^='/#'], a[href^='#']") as HTMLAnchorElement | null;
      if (!a || location.pathname !== "/") return;
      const id = a.getAttribute("href")!.split("#")[1];
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -64 });
      history.pushState(null, "", `#${id}`);
    };
    document.addEventListener("click", onClick);
    return () => { document.removeEventListener("click", onClick); gsap.ticker.remove(raf); lenis.destroy(); };
  }, [tier]);
  return null;
}
```

`components/motion/MotionRoot.tsx` (mounts every global motion component; later tasks add to it):

```tsx
"use client";
import { TierProvider } from "@/lib/tiers";
import { SmoothScroll } from "./SmoothScroll";

export function MotionRoot({ children }: { children: React.ReactNode }) {
  return (
    <TierProvider>
      {children}
      <SmoothScroll />
    </TierProvider>
  );
}
```

In `app/layout.tsx` wrap the body content: `<MotionRoot> …skip link, Navbar, main, Footer, Vignette, Grain… </MotionRoot>` (FaviconSwap, ConsoleSignature and JsonLd can stay outside).

Add to `app/globals.css`: `html.lenis, html.lenis body { height: auto; } .lenis.lenis-smooth { scroll-behavior: auto !important; }` (Lenis adds the `lenis` class).

- [ ] **Step 5: Verify**

Run: `npm run check && npm run build && npm run dev`
Check in Chrome at 1440: `document.documentElement.dataset.tier === "A"`, scrolling is smooth, anchors land with the navbar offset. Chrome devtools → Rendering → emulate `prefers-reduced-motion: reduce` → reload → tier `C`, native scroll. Devtools device mode (Pixel 7) → tier `B`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(motion): tier detection, gsap registration and lenis smooth scroll

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---
### Task 2: Text reveals, light sweeps, chapter choreography and the progress rail

**Files:**
- Create: `components/motion/SplitReveal.tsx`, `components/motion/LightSweeps.tsx`, `components/motion/ChapterChoreo.tsx`, `components/motion/ProgressRail.tsx`, `tests/e2e/motion.spec.ts`
- Modify: `components/motion/MotionRoot.tsx`, `components/home/WorkChapters.tsx` (add rail + `data-sweep-section`), `app/globals.css`

**Interfaces:**
- Consumes: `useTier`, `gsap`, `ScrollTrigger`, `SplitText`; DOM hooks from Plan 1: `[data-split]`, `[data-frame] [data-sweep]`, `[data-chapters]`, `[data-chapter]`, `.eyebrow`.
- Produces: `data-revealed="true"` on split elements after reveal (used by tests); `[data-rail]` element with `--progress` CSS variable.

- [ ] **Step 1: Write the motion e2e test**

`tests/e2e/motion.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("headings reveal and sweeps run on desktop, not under reduced motion", async ({ page }, info) => {
  await page.goto("/");
  await page.waitForFunction(() => document.documentElement.dataset.tier !== undefined);
  const tier = await page.evaluate(() => document.documentElement.dataset.tier);
  if (info.project.name === "reduced-motion") {
    expect(tier).toBe("C");
    await expect(page.locator("h1")).not.toHaveAttribute("data-revealed", "true");
    expect(await page.locator("h1 .line").count()).toBe(0);
    return;
  }
  await expect(page.locator("h1")).toHaveAttribute("data-revealed", "true", { timeout: 5000 });
  await page.locator("#work").scrollIntoViewIfNeeded();
  await expect(page.locator("#work h2")).toHaveAttribute("data-revealed", "true", { timeout: 5000 });
});

test("progress rail reflects chapter progress on desktop", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/");
  await page.waitForFunction(() => document.documentElement.dataset.tier === "A" || document.documentElement.dataset.tier === "B");
  await page.locator("[data-chapter='nepa-invest']").scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const progress = await page.locator("[data-rail]").evaluate((el) => parseFloat(getComputedStyle(el).getPropertyValue("--progress")));
  expect(progress).toBeGreaterThan(0.7);
});
```

Run: `npm run e2e -- --grep "reveal|rail"` → FAIL.

- [ ] **Step 2: Write SplitReveal**

`components/motion/SplitReveal.tsx`:

```tsx
"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { useTier } from "@/lib/tiers";

export function SplitReveal() {
  const tier = useTier();
  const pathname = usePathname();
  useEffect(() => {
    if (!tier || tier === "C") return;
    const ctx = gsap.context(() => {
      document.fonts.ready.then(() => {
        gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
          if (el.dataset.revealed) return;
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit(self) {
              return gsap.from(self.lines, {
                yPercent: 100, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.08,
                scrollTrigger: { trigger: el, start: "top 80%", once: true },
                onComplete: () => { el.dataset.revealed = "true"; },
              });
            },
          });
        });
        gsap.utils.toArray<HTMLElement>(".eyebrow").forEach((el) => {
          gsap.from(el, { y: 2, opacity: 0, duration: 0.5, scrollTrigger: { trigger: el, start: "top 90%", once: true } });
        });
        ScrollTrigger.refresh();
      });
    });
    return () => ctx.revert();
  }, [tier, pathname]);
  return null;
}
```

- [ ] **Step 3: Write LightSweeps**

`components/motion/LightSweeps.tsx`:

```tsx
"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { useTier } from "@/lib/tiers";

export function sweep(target: Element, duration = 1.2) {
  return gsap.fromTo(target, { top: "-50%", opacity: 1 }, { top: "110%", duration, ease: "power2.inOut", onComplete: () => gsap.set(target, { opacity: 0 }) });
}

export function LightSweeps() {
  const tier = useTier();
  const pathname = usePathname();
  useEffect(() => {
    if (!tier || tier === "C") return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-frame]").forEach((frame) => {
        const band = frame.querySelector("[data-sweep]");
        if (!band) return;
        gsap.timeline({ scrollTrigger: { trigger: frame, start: "top 75%", once: true } }).add(() => { sweep(band); });
        if (tier === "A") {
          frame.addEventListener("mouseenter", () => sweep(band, 0.9));
        }
      });
      gsap.utils.toArray<HTMLElement>("[data-sweep-section]").forEach((section) => {
        const band = document.createElement("span");
        band.setAttribute("aria-hidden", "true");
        band.className = "pointer-events-none absolute inset-x-0 h-[40vh] opacity-0";
        band.style.background = "linear-gradient(180deg, rgba(255,74,38,0), rgba(255,74,38,.12), rgba(255,74,38,0))";
        section.style.position = "relative";
        section.prepend(band);
        gsap.timeline({ scrollTrigger: { trigger: section, start: "top 70%", once: true } }).add(() => { sweep(band, 1.4); });
      });
    });
    return () => ctx.revert();
  }, [tier, pathname]);
  return null;
}
```

Add `data-sweep-section` to the `<section>` roots of About, Experience, Lab and Contact (Plan 1 components) so each gets one sweep on enter.

- [ ] **Step 4: Chapter choreography and the rail**

`components/motion/ProgressRail.tsx` (rendered inside `WorkChapters`, desktop only):

```tsx
import { projects } from "@/content";

export function ProgressRail() {
  return (
    <div data-rail aria-hidden="true" className="pointer-events-none fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-3 opacity-0 lg:flex" style={{ ["--progress" as string]: 0 }}>
      <span data-rail-label className="eyebrow text-ink">01 / {String(projects.length).padStart(2, "0")}</span>
      <span className="relative block h-40 w-px bg-hairline">
        <span className="absolute left-0 top-0 block w-px bg-signal shadow-[0_0_8px_2px_rgba(255,74,38,.5)]" style={{ height: "calc(var(--progress) * 100%)" }} />
      </span>
    </div>
  );
}
```

`components/motion/ChapterChoreo.tsx`:

```tsx
"use client";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useTier } from "@/lib/tiers";

export function ChapterChoreo() {
  const tier = useTier();
  useEffect(() => {
    if (!tier || tier === "C" || innerWidth < 1024) return;
    const root = document.querySelector<HTMLElement>("[data-chapters]");
    const rail = document.querySelector<HTMLElement>("[data-rail]");
    const label = rail?.querySelector<HTMLElement>("[data-rail-label]");
    if (!root) return;
    const chapters = gsap.utils.toArray<HTMLElement>("[data-chapter]");
    const ctx = gsap.context(() => {
      chapters.forEach((ch, i) => {
        const next = chapters[i + 1];
        if (!next) return;
        // As the next chapter slides over, the current one recedes.
        gsap.to(ch.firstElementChild!.nextElementSibling, {
          scale: 0.96, opacity: 0.5, transformOrigin: "50% 0%", ease: "none",
          scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: 0.6 },
        });
      });
      ScrollTrigger.create({
        trigger: root, start: "top 60%", end: "bottom bottom",
        onToggle: (st) => gsap.to(rail, { opacity: st.isActive ? 1 : 0, duration: 0.3 }),
        onUpdate: (st) => {
          rail?.style.setProperty("--progress", st.progress.toFixed(3));
          const idx = Math.min(chapters.length, Math.floor(st.progress * chapters.length) + 1);
          if (label) label.textContent = `${String(idx).padStart(2, "0")} / ${String(chapters.length).padStart(2, "0")}`;
        },
      });
    }, root);
    return () => ctx.revert();
  }, [tier]);
  return null;
}
```

In `WorkChapters.tsx` render `<ProgressRail />` right after the heading block and `<ChapterChoreo />` at the end of the section. The `firstElementChild.nextElementSibling` is the `.container-site` grid (the first child is the `Aura`); keep that DOM order.

- [ ] **Step 5: Mount in MotionRoot and verify**

Add `<SplitReveal />` and `<LightSweeps />` to `MotionRoot` after `<SmoothScroll />`.

Run: `npm run e2e -- --grep "reveal|rail"` → PASS on `desktop`, `mobile`, `reduced-motion`.
Manual: headings reveal line by line once; each frame gets one sweep on enter and again on hover; chapters scale down as the next covers them; the rail appears during the work section and fills.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(motion): split-text reveals, light sweeps, chapter choreography and progress rail

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 3: Signal cursor, magnetic pills, drawn arrows and hover previews

**Files:**
- Create: `components/motion/Cursor.tsx`, `components/motion/Magnetic.tsx`, `components/motion/DrawArrows.tsx`, `components/motion/HoverPreview.tsx`
- Modify: `components/motion/MotionRoot.tsx`, `app/globals.css`, `components/home/ExperienceList.tsx` and `Lab.tsx` (no change needed if `data-preview` is set; verify)

**Interfaces:**
- Consumes: `useTier`, `gsap`, `DrawSVGPlugin`; hooks `[data-magnetic]`, `[data-frame]`, `[data-row][data-preview]`, `[data-hero-poster]`; `projects` (hero media per slug for previews).
- Produces: `html[data-cursor="custom"]` while the custom cursor is mounted (CSS hides the native cursor).

- [ ] **Step 1: Cursor**

`components/motion/Cursor.tsx`:

```tsx
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
    document.documentElement.dataset.cursor = "custom";
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.05 }), dy = gsap.quickTo(dot.current, "y", { duration: 0.05 });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.12 }), ry = gsap.quickTo(ring.current, "y", { duration: 0.12 });
    const move = (e: PointerEvent) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); };
    const mode = (m: "default" | "link" | "frame" | "signal") => {
      const r = ring.current!, d = dot.current!;
      gsap.to(r, { width: m === "link" ? 48 : m === "frame" ? 112 : m === "signal" ? 10 : 28, height: m === "frame" ? 32 : m === "link" ? 48 : m === "signal" ? 10 : 28, borderRadius: 999, duration: 0.24 });
      gsap.to(d, { opacity: m === "link" || m === "frame" ? 0 : 1, scale: m === "signal" ? 1.6 : 1, duration: 0.2 });
      if (label.current) label.current.style.opacity = m === "frame" ? "1" : "0";
    };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("[data-hero-poster], [data-hero-scene]")) return mode("signal");
      if (t.closest("[data-frame]")) return mode("frame");
      if (t.closest("a, button, [role=button], [role=tab]")) return mode("link");
      mode("default");
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    return () => {
      delete document.documentElement.dataset.cursor;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, [tier]);
  if (tier !== "A") return null;
  return (
    <>
      <div ref={dot} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[70] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal shadow-[0_0_8px_2px_rgba(255,74,38,.7)]" />
      <div ref={ring} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[70] flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-signal/70 shadow-[0_0_16px_4px_rgba(255,74,38,.18)]">
        <span ref={label} className="eyebrow whitespace-nowrap text-ink opacity-0 transition-opacity">Open case ↗</span>
      </div>
    </>
  );
}
```

Add to `app/globals.css`: `html[data-cursor="custom"], html[data-cursor="custom"] * { cursor: none !important; }`.

- [ ] **Step 2: Magnetic pills**

`components/motion/Magnetic.tsx`:

```tsx
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
    const cleanups: Array<() => void> = [];
    document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
      const dot = el.querySelector<HTMLElement>("span.rounded-full");
      const x = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
      const y = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const dx = e.clientX - cx, dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);
        if (dist > 80 + r.width / 2) return leave();
        x(gsap.utils.clamp(-12, 12, dx * 0.25)); y(gsap.utils.clamp(-12, 12, dy * 0.25));
        if (dot) gsap.to(dot, { x: -dx * 0.04, y: -dy * 0.04, duration: 0.3 });
      };
      const leave = () => { gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" }); if (dot) gsap.to(dot, { x: 0, y: 0, duration: 0.4 }); };
      const parent = el.parentElement ?? el;
      parent.addEventListener("pointermove", move);
      parent.addEventListener("pointerleave", leave);
      cleanups.push(() => { parent.removeEventListener("pointermove", move); parent.removeEventListener("pointerleave", leave); });
    });
    return () => cleanups.forEach((c) => c());
  }, [tier, pathname]);
  return null;
}
```

Touch feedback for Tier B/C (CSS, in `globals.css`): `@media (pointer: coarse) { [data-magnetic]:active { transform: scale(.98); transition: transform 120ms; } }`.

- [ ] **Step 3: Drawn arrows**

`components/motion/DrawArrows.tsx`:

```tsx
"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { useTier } from "@/lib/tiers";

// <use> sprites cannot be drawn; swap arrow icons for inline paths on hover targets.
const PATHS: Record<string, string[]> = {
  "arrow-up-right": ["M7 17 17 7", "M8.5 7H17v8.5"],
  "arrow-right": ["M4 12h15", "m13.5 6.5 5.5 5.5-5.5 5.5"],
  "arrow-left": ["M20 12H5", "M10.5 6.5 5 12l5.5 5.5"],
};

export function DrawArrows() {
  const tier = useTier();
  const pathname = usePathname();
  useEffect(() => {
    if (tier !== "A") return;
    const cleanups: Array<() => void> = [];
    document.querySelectorAll<SVGSVGElement>("a svg, button svg").forEach((svg) => {
      const use = svg.querySelector("use");
      const name = use?.getAttribute("href")?.split("#")[1];
      if (!name || !PATHS[name]) return;
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.innerHTML = PATHS[name].map((d) => `<path d="${d}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`).join("");
      const paths = svg.querySelectorAll("path");
      const host = svg.closest("a, button")!;
      const enter = () => gsap.fromTo(paths, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.45, stagger: 0.08, ease: "power2.out" });
      host.addEventListener("pointerenter", enter);
      cleanups.push(() => host.removeEventListener("pointerenter", enter));
    });
    return () => cleanups.forEach((c) => c());
  }, [tier, pathname]);
  return null;
}
```

- [ ] **Step 4: Hover previews**

`components/motion/HoverPreview.tsx`:

```tsx
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
    const x = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });
    let lastX = 0;
    const rows = document.querySelectorAll<HTMLElement>("[data-row][data-preview]");
    const cleanups: Array<() => void> = [];
    rows.forEach((row) => {
      const slug = row.dataset.preview!;
      const p = projects.find((pr) => pr.slug === slug);
      if (!p) return;
      const hero = Array.isArray(p.media.hero) ? p.media.hero[0] : p.media.hero;
      const enter = () => { setSrc(hero.src); gsap.to(el, { opacity: 1, scale: 1, duration: 0.25 }); };
      const move = (e: PointerEvent) => { x(e.clientX + 24); y(e.clientY - 75); gsap.to(el, { rotate: gsap.utils.clamp(-6, 6, (e.clientX - lastX) * 0.4), duration: 0.3 }); lastX = e.clientX; };
      const leave = () => gsap.to(el, { opacity: 0, scale: 0.96, duration: 0.2 });
      const focus = () => { const r = row.getBoundingClientRect(); setSrc(hero.src); gsap.set(el, { x: r.right - 260, y: r.top - 20 }); gsap.to(el, { opacity: 1, scale: 1, duration: 0.25 }); };
      row.addEventListener("pointerenter", enter); row.addEventListener("pointermove", move); row.addEventListener("pointerleave", leave);
      row.addEventListener("focusin", focus); row.addEventListener("focusout", leave);
      cleanups.push(() => { row.removeEventListener("pointerenter", enter); row.removeEventListener("pointermove", move); row.removeEventListener("pointerleave", leave); row.removeEventListener("focusin", focus); row.removeEventListener("focusout", leave); });
    });
    return () => cleanups.forEach((c) => c());
  }, [tier, pathname]);
  if (tier !== "A") return null;
  return (
    <div ref={box} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[65] w-[240px] overflow-hidden rounded-lg border border-hairline bg-surface-1 p-1 opacity-0 shadow-[0_20px_50px_rgba(0,0,0,.6)]" style={{ scale: 0.96 }}>
      {src && <img src={src} alt="" width={240} height={150} className="block h-[150px] w-full rounded object-cover object-top" />}
    </div>
  );
}
```

- [ ] **Step 5: Mount and verify**

Add `<Cursor />`, `<Magnetic />`, `<DrawArrows />`, `<HoverPreview />` to `MotionRoot` (Cursor last so it sits on top).

Manual check (Tier A): native cursor hidden, dot + lagging ring; ring grows over links, becomes the "Open case ↗" pill over frames, collapses over the hero poster; pills pull toward the pointer and spring back; arrows draw on hover; hovering a DIN/Neo/LibLynx/Arkona experience row shows the floating thumbnail that tilts with movement; Tab to a row shows it anchored. Pixel 7 emulation: none of this mounts, native cursor and tap feedback only. Run `npm run e2e` to confirm nothing regressed.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(motion): signal cursor, magnetic pills, drawn arrows and hover previews

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---
### Task 4: Loader with real progress and the navbar signal dot

**Files:**
- Create: `components/brand/Loader.tsx`, `components/ui/NavDot.tsx`, `lib/ready.ts`
- Modify: `components/ui/Navbar.tsx` (use `NavDot` in the lockup), `components/brand/Lockup.tsx` (accept a `dot` slot), `components/motion/MotionRoot.tsx`, `app/globals.css`

**Interfaces:**
- Consumes: `useTier`, `gsap`, `Monogram` geometry (`MONOGRAM`).
- Produces: `readiness(): Promise<void>` resolving when fonts are ready and the hero poster is decoded (and on Tier A when `window.__heroSceneReady` resolves, set by Task 5); `window.dispatchEvent(new CustomEvent("redzy:landed"))` when the loader finishes; `<NavDot />` with `data-nav-dot`, `ping()` on click; CSS class `.nav-dot-landed`.

- [ ] **Step 1: Readiness helper**

`lib/ready.ts`:

```ts
declare global { interface Window { __heroSceneReady?: Promise<void> } }

export async function readiness(tier: "A" | "B" | "C"): Promise<void> {
  const tasks: Promise<unknown>[] = [document.fonts.ready];
  const poster = document.querySelector<HTMLImageElement>("[data-hero-poster] img");
  if (poster && !poster.complete) tasks.push(new Promise((r) => { poster.onload = r; poster.onerror = r; }));
  if (tier === "A" && window.__heroSceneReady) tasks.push(window.__heroSceneReady);
  await Promise.all(tasks);
}
```

- [ ] **Step 2: Loader**

`components/brand/Loader.tsx`:

```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useTier } from "@/lib/tiers";
import { readiness } from "@/lib/ready";
import { MONOGRAM } from "./Monogram";

const KEY = "redzy:loaded";

export function Loader() {
  const tier = useTier();
  const root = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!tier) return;
    const skip = tier === "C" || sessionStorage.getItem(KEY) || location.pathname !== "/";
    if (skip) { window.dispatchEvent(new CustomEvent("redzy:landed")); return; }
    setShow(true);
  }, [tier]);
  useEffect(() => {
    if (!show || !root.current || !tier) return;
    const el = root.current;
    const dot = el.querySelector("[data-l-dot]"), parts = el.querySelectorAll("[data-l-part]"), word = el.querySelector("[data-l-word]");
    const fill = { v: 0 };
    const started = performance.now();
    let done = false;
    const tl = gsap.timeline({ paused: true });
    tl.fromTo(dot, { scale: 0 }, { scale: 1, duration: 0.3, ease: "back.out(2)" })
      .to(dot, { scale: 1.25, yoyo: true, repeat: 1, duration: 0.25 }, "+=0.05")
      .fromTo(parts, { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.08 }, "-=0.1")
      .fromTo(word, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.2");
    tl.play();
    const finish = () => {
      if (done) return; done = true;
      sessionStorage.setItem(KEY, "1");
      const nav = document.querySelector<HTMLElement>("[data-nav-dot]");
      const target = nav?.getBoundingClientRect();
      const from = (dot as HTMLElement).getBoundingClientRect();
      const land = gsap.timeline({ onComplete: () => { setShow(false); window.dispatchEvent(new CustomEvent("redzy:landed")); } });
      land.to([parts, word], { opacity: 0, duration: 0.25 })
        .to(dot, { x: (target ? target.left + target.width / 2 : 24) - (from.left + from.width / 2), y: (target ? target.top + target.height / 2 : 32) - (from.top + from.height / 2), scale: 0.6, duration: 0.4, ease: "power3.inOut" }, "-=0.1")
        .to(el, { opacity: 0, duration: 0.25 }, "-=0.1");
    };
    const progress = gsap.to(fill, { v: 0.85, duration: 2.4, ease: "none", onUpdate: () => el.style.setProperty("--fill", fill.v.toFixed(3)) });
    readiness(tier).then(() => {
      progress.kill();
      gsap.to(fill, { v: 1, duration: 0.2, onUpdate: () => el.style.setProperty("--fill", fill.v.toFixed(3)) });
      const wait = Math.max(0, 900 - (performance.now() - started));
      setTimeout(finish, wait);
    });
    const cap = setTimeout(finish, 2400);
    const skip = () => finish();
    window.addEventListener("wheel", skip, { once: true, passive: true });
    window.addEventListener("pointerdown", skip, { once: true });
    window.addEventListener("keydown", skip, { once: true });
    return () => { clearTimeout(cap); window.removeEventListener("wheel", skip); window.removeEventListener("pointerdown", skip); window.removeEventListener("keydown", skip); };
  }, [show, tier]);
  if (!show) return null;
  return (
    <div ref={root} role="status" aria-label="Loading" className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-canvas" style={{ ["--fill" as string]: 0 }}>
      <svg width="160" height="160" viewBox="0 0 100 100" aria-hidden="true">
        <defs><radialGradient id="lg" cx="46" cy="32" r="60" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#FF4A26" stopOpacity=".5" /><stop offset="1" stopColor="#FF4A26" stopOpacity="0" /></radialGradient></defs>
        <g fill="#1C1A18">
          <rect data-l-part x={MONOGRAM.stem.x} y={MONOGRAM.stem.y} width={MONOGRAM.stem.width} height={MONOGRAM.stem.height} />
          <path data-l-part fillRule="evenodd" d={MONOGRAM.bowl} />
          <polygon data-l-part points={MONOGRAM.leg} />
        </g>
        <g fill="url(#lg)" style={{ opacity: "var(--fill)" }}>
          <rect x={MONOGRAM.stem.x} y={MONOGRAM.stem.y} width={MONOGRAM.stem.width} height={MONOGRAM.stem.height} />
          <path fillRule="evenodd" d={MONOGRAM.bowl} />
          <polygon points={MONOGRAM.leg} />
        </g>
        <circle data-l-dot cx="46" cy="32" r="5" fill="#FF4A26" style={{ filter: "drop-shadow(0 0 6px #FF4A26)", transformOrigin: "46px 32px" }} />
      </svg>
      <p data-l-word className="font-display text-2xl font-extrabold tracking-[-0.045em] text-ink">Redzy</p>
    </div>
  );
}
```

- [ ] **Step 3: NavDot**

`components/ui/NavDot.tsx`:

```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useTier } from "@/lib/tiers";

export function NavDot() {
  const tier = useTier();
  const ref = useRef<HTMLButtonElement>(null);
  const [landed, setLanded] = useState(false);
  useEffect(() => {
    const on = () => setLanded(true);
    window.addEventListener("redzy:landed", on);
    return () => window.removeEventListener("redzy:landed", on);
  }, []);
  const ping = () => {
    if (!tier || tier === "C") return;
    const band = document.createElement("span");
    band.className = "pointer-events-none fixed inset-x-0 z-[75] h-[40vh]";
    band.style.background = "linear-gradient(180deg, rgba(255,74,38,0), rgba(255,74,38,.18), rgba(255,74,38,0))";
    document.body.append(band);
    gsap.fromTo(band, { top: "-40vh" }, { top: "110vh", duration: 0.6, ease: "power2.inOut", onComplete: () => band.remove() });
    gsap.fromTo(ref.current, { scale: 1.8 }, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" });
  };
  return (
    <button ref={ref} type="button" data-nav-dot onClick={ping} aria-label="Send a ping" className={`relative inline-flex h-3 w-3 items-center justify-center rounded-full transition-opacity ${landed ? "opacity-100" : "opacity-0"}`}>
      <span aria-hidden className="absolute inset-0 rounded-full bg-signal motion-safe:animate-[navpulse_2.4s_ease-in-out_infinite] shadow-[0_0_10px_3px_rgba(255,74,38,.6)]" />
    </button>
  );
}
```

`globals.css`: `@keyframes navpulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.18); } }` and `html[hidden-tab] [data-nav-dot] span { animation-play-state: paused; }`; in `FaviconSwap` toggle `document.documentElement.toggleAttribute("hidden-tab", document.hidden)`.

`Lockup.tsx`: add prop `dot?: React.ReactNode`; when provided, render `<Monogram lit={false} glow={false} />` with the `NavDot` absolutely positioned over the counter (`left: 46%; top: 32%` of the monogram box, translate -50%). `Navbar.tsx` passes `dot={<NavDot />}`. Under Tier C the dot renders static (`landed` becomes true immediately because the Loader dispatches `redzy:landed` when skipping).

- [ ] **Step 4: Mount and verify**

Add `<Loader />` to `MotionRoot` (first child after `TierProvider`). Check: first load on `/` shows the dot pulse, parts fading in, the fill rising with readiness, landing into the navbar; a reload in the same tab skips it; scrolling during the loader skips it; the nav dot pulses and pings on click; reduced motion shows no loader and a static dot.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(brand): real-progress loader landing into the navbar signal dot

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 5: The 3D hero scene (Tier A) and rendered posters (Tier B/C)

**Files:**
- Create: `components/hero/HeroScene.tsx`, `components/hero/RLetter.tsx`, `components/hero/SceneBridge.ts`, `scripts/render-poster.mjs`, `public/media/hero/poster-1600.webp`, `public/media/hero/poster-900.webp`
- Modify: `components/hero/HeroPoster.tsx`, `components/hero/Hero.tsx`, `package.json`

**Interfaces:**
- Consumes: `useTier`, `MONOGRAM`, `readiness` contract (`window.__heroSceneReady`).
- Produces: `sceneBridge` object `{ progress: number; pointer: {x,y}; flare: number; intensity: number; bloom: number; cameraZ: number }` mutated by Task 6's timeline and read every frame by the scene; `data-hero-scene` on the canvas wrapper.

- [ ] **Step 1: Install**

```bash
npm install three@^0.186 @react-three/fiber@^9 @react-three/drei@^10 @react-three/postprocessing@^3 postprocessing@^6
npm install -D @types/three
```

- [ ] **Step 2: Bridge**

`components/hero/SceneBridge.ts`:

```ts
export const sceneBridge = {
  progress: 0,     // 0..1 dive progress from scroll
  pointer: { x: 0, y: 0 }, // -1..1
  flare: 0,        // 0..1 pointer-near-dot boost
  intensity: 1,    // light multiplier
  bloom: 1.2,
  cameraZ: 6,
};
```

- [ ] **Step 3: The letter mesh**

`components/hero/RLetter.tsx`:

```tsx
"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { MONOGRAM } from "@/components/brand/Monogram";
import { sceneBridge } from "./SceneBridge";

const SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="${MONOGRAM.stem.x}" y="${MONOGRAM.stem.y}" width="${MONOGRAM.stem.width}" height="${MONOGRAM.stem.height}"/><path fill-rule="evenodd" d="${MONOGRAM.bowl}"/><polygon points="${MONOGRAM.leg}"/></svg>`;

export function RLetter() {
  const group = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  const geometry = useMemo(() => {
    const data = new SVGLoader().parse(SVG);
    const shapes = data.paths.flatMap((p) => SVGLoader.createShapes(p));
    const geo = new THREE.ExtrudeGeometry(shapes, { depth: 12, bevelEnabled: true, bevelThickness: 1.2, bevelSize: 1.2, bevelSegments: 3, curveSegments: 24 });
    geo.center();
    geo.scale(0.04, -0.04, 0.04); // SVG y is down; 100 units → 4 world units
    return geo;
  }, []);
  // The counter dot in world space after center()+scale(): (46-50, -(32-50)) * 0.04
  const dot = useMemo(() => new THREE.Vector3((MONOGRAM.dot.cx - 50) * 0.04, -(MONOGRAM.dot.cy - 50) * 0.04, 0.3), []);
  useFrame((_, dt) => {
    if (!group.current || !light.current) return;
    const { pointer, flare, intensity, progress } = sceneBridge;
    const tiltX = THREE.MathUtils.degToRad(-8 * pointer.y) * (1 - progress);
    const tiltY = THREE.MathUtils.degToRad(8 * pointer.x) * (1 - progress);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, tiltX, 6, dt);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, tiltY, 6, dt);
    const breathe = 1 + 0.1 * Math.sin(performance.now() / 640);
    light.current.intensity = 14 * intensity * breathe * (1 + 0.4 * flare);
  });
  return (
    <group ref={group}>
      <mesh geometry={geometry} castShadow={false} receiveShadow={false}>
        <meshPhysicalMaterial color="#1C1A18" metalness={0.85} roughness={0.38} clearcoat={0.2} clearcoatRoughness={0.4} />
      </mesh>
      <pointLight ref={light} position={dot} color="#FF4A26" intensity={14} distance={9} decay={2} />
      <mesh position={dot}>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshStandardMaterial color="#FF4A26" emissive="#FF4A26" emissiveIntensity={2.4} toneMapped={false} />
      </mesh>
    </group>
  );
}
```

- [ ] **Step 4: The scene**

`components/hero/HeroScene.tsx`:

```tsx
"use client";
import { useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { RLetter } from "./RLetter";
import { sceneBridge } from "./SceneBridge";

function Rig() {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.z = sceneBridge.cameraZ;
    camera.lookAt((46 - 50) * 0.04 * sceneBridge.progress, -(32 - 50) * 0.04 * sceneBridge.progress, 0);
  });
  return null;
}

function Ready({ resolve }: { resolve: () => void }) {
  useEffect(() => { resolve(); }, [resolve]);
  return null;
}

export default function HeroScene({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    const onMove = (e: PointerEvent) => { sceneBridge.pointer.x = (e.clientX / innerWidth) * 2 - 1; sceneBridge.pointer.y = (e.clientY / innerHeight) * 2 - 1; };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return (
    <div data-hero-scene className="absolute inset-0">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 35 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} frameloop="always">
        <ambientLight intensity={0.08} color="#9DB2FF" />
        <directionalLight position={[-4, 5, 6]} intensity={0.35} color="#B8C4FF" />
        <RLetter />
        <Rig />
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={sceneBridge.bloom} luminanceThreshold={0.8} luminanceSmoothing={0.2} levels={6} />
        </EffectComposer>
        <Ready resolve={onReady} />
      </Canvas>
    </div>
  );
}
```

Bloom intensity must follow the bridge every frame: give `<Bloom ref>` and set `ref.current.intensity = sceneBridge.bloom` inside `Rig`'s `useFrame` (pass the ref down). Keep `luminanceThreshold` at 0.8 so only the emissive dot blooms.

- [ ] **Step 5: Hero integration with tiers and posters**

`components/hero/HeroPoster.tsx` becomes tier-aware:

```tsx
"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTier } from "@/lib/tiers";
import { Monogram } from "@/components/brand/Monogram";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export function HeroPoster() {
  const tier = useTier();
  const [mount, setMount] = useState(false);
  useEffect(() => {
    if (tier !== "A") return;
    let resolve!: () => void;
    window.__heroSceneReady = new Promise<void>((r) => { resolve = r; });
    (window as unknown as { __resolveHero: () => void }).__resolveHero = resolve;
    const idle = (window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1)))(() => setMount(true));
    return () => { if (window.cancelIdleCallback) window.cancelIdleCallback(idle as number); };
  }, [tier]);
  return (
    <div data-hero-poster className="relative mx-auto aspect-square w-[min(72vw,520px)] lg:w-[min(38vw,620px)]">
      {tier === "A" && mount ? (
        <HeroScene onReady={() => (window as unknown as { __resolveHero: () => void }).__resolveHero()} />
      ) : (
        <picture>
          <source media="(min-width: 1024px)" srcSet="/media/hero/poster-1600.webp" />
          <img src="/media/hero/poster-900.webp" alt="" width={900} height={900} decoding="async" fetchPriority="high" className="block h-full w-full object-contain" />
        </picture>
      )}
      {tier !== "A" && (
        <span aria-hidden data-poster-dot className="absolute h-[2.6%] w-[2.6%] rounded-full bg-signal shadow-[0_0_18px_6px_rgba(255,74,38,.7)] motion-safe:animate-[navpulse_2.4s_ease-in-out_infinite]" style={{ left: "46%", top: "32%", transform: "translate(-50%,-50%)" }} />
      )}
      {tier === null && <Monogram size={620} className="absolute inset-0 h-full w-full text-[#1C1A18]" glow={false} />}
    </div>
  );
}
```

The poster images are produced by the script below; until then, keep the SVG `Monogram` fallback (the `tier === null` branch covers SSR and the first client frame so there is no layout shift).

- [ ] **Step 6: Render the posters**

`scripts/render-poster.mjs` (run against `npm run dev` with the scene forced on):

```js
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

await mkdir("public/media/hero", { recursive: true });
const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
for (const [name, size] of [["poster-1600", 1600], ["poster-900", 900]]) {
  const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
  await page.goto("http://localhost:3000/?poster=1", { waitUntil: "networkidle" });
  await page.waitForSelector("[data-hero-scene] canvas", { timeout: 60000 });
  await page.waitForTimeout(2500);
  const dataUrl = await page.evaluate(() => (document.querySelector("[data-hero-scene] canvas")).toDataURL("image/png"));
  const buf = Buffer.from(dataUrl.split(",")[1], "base64");
  await sharp(buf).webp({ quality: 86 }).toFile(`public/media/hero/${name}.webp`);
  console.log(name);
  await page.close();
}
await browser.close();
```

Support `?poster=1` in `HeroPoster`: when `new URLSearchParams(location.search).has("poster")`, force Tier A behaviour, mount the scene immediately, size the poster box to the viewport (`fixed inset-0`), and pass `gl={{ preserveDrawingBuffer: true }}` to the Canvas. Guard it with `process.env.NODE_ENV !== "production"`.

Run: `npm run dev & node scripts/render-poster.mjs` → two WebP files; open them: dark metal R, red glow at the counter, transparent background. Add `"poster": "node scripts/render-poster.mjs"` to scripts.

- [ ] **Step 7: Verify and commit**

Tier A: the R tilts toward the pointer, the dot flares when the pointer is near, bloom only on the dot, 60 fps idle (Chrome devtools Performance, no long frames). Tier B (Pixel 7 emulation): the WebP poster with a pulsing CSS dot, no canvas. `npm run build` passes; the 3D chunk is not in the initial JS (`npx next build` output lists it as a separate chunk; confirm size ≤ 400 KB gz via `ANALYZE=1`, Task 9).

```bash
git add -A
git commit -m "feat(hero): R3F signal scene with bloom, pointer tilt and rendered posters for lower tiers

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---
### Task 6: The dive: scroll timeline from hero into the dot and out into the first chapter

**Files:**
- Create: `components/hero/HeroDive.tsx`, `components/hero/HeroOverlay.tsx`
- Modify: `components/hero/Hero.tsx`, `components/hero/HeroScene.tsx` (bloom ref), `components/home/WorkChapters.tsx` (`data-chapter-first` reveal targets), `tests/e2e/motion.spec.ts`

**Interfaces:**
- Consumes: `sceneBridge`, `gsap`, `ScrollTrigger`, `useTier`, `sweep()` from `LightSweeps`, `[data-nav-dot]`, `[data-chapter='liblynx']`.
- Produces: `data-dive="landed"` on `[data-hero]` when progress ≥ 0.82 (used by tests and by `NavDot`).

- [ ] **Step 1: Extend the motion e2e test**

Append to `tests/e2e/motion.spec.ts`:

```ts
test("desktop dive lands in chapter 01; mobile has no pin", async ({ page }, info) => {
  await page.goto("/");
  await page.waitForFunction(() => !!document.documentElement.dataset.tier);
  const tier = await page.evaluate(() => document.documentElement.dataset.tier);
  if (tier === "A") {
    await page.mouse.wheel(0, 2600);
    await page.waitForTimeout(1500);
    await expect(page.locator("[data-hero]")).toHaveAttribute("data-dive", "landed", { timeout: 8000 });
    await expect(page.locator("[data-chapter='liblynx']")).toBeInViewport({ ratio: 0.5 });
    await expect(page.locator("[data-nav-dot]")).toHaveCSS("opacity", "1");
  } else {
    const pinned = await page.locator(".pin-spacer").count();
    expect(pinned).toBe(0);
    await page.mouse.wheel(0, 1200);
    await expect(page.locator("[data-chapter='liblynx']")).toBeInViewport({ ratio: 0.3, timeout: 5000 });
  }
});
```

Run: `npm run e2e -- --grep dive` → FAIL on desktop (no `data-dive`).

- [ ] **Step 2: Overlay**

`components/hero/HeroOverlay.tsx`:

```tsx
export function HeroOverlay() {
  return (
    <>
      <div data-flash aria-hidden className="pointer-events-none fixed inset-0 z-[45] bg-[#FFF1EC] opacity-0" />
      <div data-recede aria-hidden className="pointer-events-none fixed inset-0 z-[44] opacity-0" style={{ background: "radial-gradient(60% 50% at 50% 0%, rgba(255,74,38,.55), rgba(255,74,38,.08) 60%, rgba(255,74,38,0) 100%)" }} />
      <div data-redfade aria-hidden className="pointer-events-none fixed inset-0 z-[44] bg-signal opacity-0" />
    </>
  );
}
```

- [ ] **Step 3: The timeline**

`components/hero/HeroDive.tsx`:

```tsx
"use client";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useTier } from "@/lib/tiers";
import { sceneBridge } from "./SceneBridge";
import { sweep } from "@/components/motion/LightSweeps";

export function HeroDive() {
  const tier = useTier();
  useEffect(() => {
    if (!tier || tier === "C") return;
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    const chapter = document.querySelector<HTMLElement>("[data-chapter='liblynx']");
    const flash = document.querySelector<HTMLElement>("[data-flash]");
    const recede = document.querySelector<HTMLElement>("[data-recede]");
    const redfade = document.querySelector<HTMLElement>("[data-redfade]");
    const navDot = document.querySelector<HTMLElement>("[data-nav-dot]");
    if (!hero || !chapter) return;
    const ctx = gsap.context(() => {
      if (tier === "B") {
        // One red fade when the hero leaves; no pin, no camera.
        ScrollTrigger.create({
          trigger: hero, start: "bottom 60%", once: true,
          onEnter: () => gsap.timeline().to(redfade, { opacity: 0.7, duration: 0.2 }).to(redfade, { opacity: 0, duration: 0.4 }).add(() => { hero.dataset.dive = "landed"; window.dispatchEvent(new CustomEvent("redzy:landed")); }, "<"),
        });
        return;
      }
      const copy = hero.querySelectorAll("h1, p, .eyebrow, [data-magnetic]");
      const scene = hero.querySelector<HTMLElement>("[data-hero-scene]");
      const rows = chapter.querySelectorAll(".container-site > *");
      gsap.set(rows, { opacity: 0, y: 24 });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero, start: "top top", end: "+=250%", pin: true, scrub: 0.6, anticipatePin: 1,
          onUpdate: (st) => {
            sceneBridge.progress = st.progress;
            if (st.progress >= 0.82 && hero.dataset.dive !== "landed") { hero.dataset.dive = "landed"; window.dispatchEvent(new CustomEvent("redzy:landed")); }
            if (st.progress < 0.82 && hero.dataset.dive === "landed") delete hero.dataset.dive;
          },
        },
      });
      // 0 – .20 approach
      tl.to(copy, { y: -40, opacity: 0, stagger: 0.02, duration: 0.2, ease: "power1.in" }, 0)
        .to(sceneBridge, { cameraZ: 2.8, duration: 0.2, ease: "power1.inOut" }, 0)
        // .20 – .55 dive
        .to(sceneBridge, { cameraZ: 0.3, intensity: 3, bloom: 2.6, duration: 0.35, ease: "power2.in" }, 0.2)
        // .55 – .62 white core
        .to(flash, { opacity: 1, duration: 0.035, ease: "power1.in" }, 0.55)
        .to(flash, { opacity: 0, duration: 0.035, ease: "power1.out" }, 0.585)
        // .62 – .82 recede toward the navbar
        .to(scene, { opacity: 0, duration: 0.1 }, 0.62)
        .fromTo(recede, { opacity: 1, scale: 1.4, transformOrigin: "50% 0%" }, { opacity: 0, scale: 0.2, duration: 0.2, ease: "power2.out" }, 0.62)
        .fromTo(navDot, { scale: 6, opacity: 1 }, { scale: 1, duration: 0.2, ease: "power2.out" }, 0.62)
        // .82 – 1 chapter 01 reveals under a sweep
        .to(rows, { opacity: 1, y: 0, stagger: 0.05, duration: 0.18 }, 0.82)
        .add(() => { const band = chapter.querySelector("[data-sweep]"); if (band) sweep(band); }, 0.82);
      // Pause the R3F loop while the canvas is invisible.
      ScrollTrigger.create({ trigger: hero, start: "top top", end: "+=250%", onUpdate: (st) => { if (scene) scene.style.visibility = st.progress > 0.72 ? "hidden" : "visible"; } });
    }, hero);
    return () => ctx.revert();
  }, [tier]);
  return null;
}
```

In `HeroScene.tsx`, read `sceneBridge.cameraZ` (already in `Rig`) and set bloom intensity from the bridge each frame; also set `frameloop` to `"demand"` + `invalidate()` from `Rig` only when `scene.style.visibility !== "hidden"` is too fiddly: keep `frameloop="always"` and rely on the `visibility: hidden` wrapper, which skips compositing; measure in Task 9 and switch to `demand` if the hidden canvas still costs frames.

`Hero.tsx`: render `<HeroOverlay />` and `<HeroDive />` inside the section (after the grid). The `Hero` section must be the direct pin target: ensure it has no `overflow-hidden` on an ancestor between it and `main` (remove `overflow-hidden` from the section itself; put it on the inner grid wrapper instead).

- [ ] **Step 4: Verify**

Run: `npm run e2e -- --grep dive` → PASS (desktop lands, mobile unpinned).
Manual at 1440: scroll slowly; headline leaves, camera dives, red fills, white flash, light recedes into the navbar dot, chapter 01 fades in under a sweep. Scroll back: it reverses. Check no scroll jank: Chrome Performance panel during the dive, no frame > 32 ms. Then reduced motion: hero is static, chapter 01 fully visible.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(hero): scroll-scrubbed dive into the signal with landing in the navbar and chapter reveal

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 7: Shader hover on case study frames (Tier A)

**Files:**
- Create: `components/work/FrameCanvas.tsx`, `components/work/ShaderFrame.tsx`, `components/work/frameShader.ts`
- Modify: `components/work/ProductFrame.tsx` (opt-in `shader` prop), `components/work/CaseStudy.tsx` (pass `shader` on hero + gallery), `app/work/[slug]/page.tsx` (mount `FrameCanvas`)

**Interfaces:**
- Consumes: `useTier`, drei `View`, R3F `Canvas`, `useTexture`, `gsap`.
- Produces: `<FrameCanvas />` (one fixed, transparent canvas per case page, `pointer-events: none`), `<ShaderFrame src width height track={ref} />` rendered inside `ProductFrame` when `shader` and Tier A.

- [ ] **Step 1: Shader**

`components/work/frameShader.ts`:

```ts
export const vertex = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

export const fragment = /* glsl */ `
uniform sampler2D uMap;
uniform float uProgress;  // 0..1 ripple
uniform float uSweep;     // 0..1 light band position
uniform float uTime;
varying vec2 vUv;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1,0)), u.x), mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);
}

void main() {
  float n = noise(vUv * 6.0 + uTime * 0.15);
  float ripple = sin((vUv.y - uProgress) * 24.0) * 0.5 + 0.5;
  float strength = uProgress * (1.0 - uProgress) * 4.0; // peaks mid-way
  vec2 offset = (n - 0.5) * 0.03 * strength + vec2(0.0, ripple * 0.012 * strength);
  vec4 col = texture2D(uMap, vUv + offset);
  float band = smoothstep(0.0, 0.18, 1.0 - abs(vUv.y - (uSweep * 1.4 - 0.2)) / 0.18);
  vec3 light = vec3(1.0, 0.29, 0.15) * band * 0.22;
  gl_FragColor = vec4(col.rgb + light, col.a);
}
`;
```

- [ ] **Step 2: Shared canvas and the frame plane**

`components/work/FrameCanvas.tsx`:

```tsx
"use client";
import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import { useTier } from "@/lib/tiers";

export function FrameCanvas() {
  const tier = useTier();
  if (tier !== "A") return null;
  return (
    <Canvas dpr={[1, 1.5]} eventSource={typeof document !== "undefined" ? document.body : undefined} className="pointer-events-none !fixed inset-0 z-[35]" style={{ position: "fixed" }} gl={{ alpha: true, antialias: false }}>
      <View.Port />
    </Canvas>
  );
}
```

`components/work/ShaderFrame.tsx`:

```tsx
"use client";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { View, useTexture } from "@react-three/drei";
import { gsap } from "@/lib/gsap";
import { vertex, fragment } from "./frameShader";

function Plane({ src, host }: { src: string; host: React.RefObject<HTMLElement | null> }) {
  const tex = useTexture(src);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uMap: { value: tex }, uProgress: { value: 0 }, uSweep: { value: -1 }, uTime: { value: 0 } }), [tex]);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const enter = () => {
      gsap.fromTo(uniforms.uProgress, { value: 0 }, { value: 1, duration: 1.2, ease: "power2.out" });
      gsap.fromTo(uniforms.uSweep, { value: 0 }, { value: 1, duration: 1.2, ease: "power2.inOut" });
    };
    el.addEventListener("pointerenter", enter);
    return () => el.removeEventListener("pointerenter", enter);
  }, [host, uniforms]);
  useFrame((_, dt) => { uniforms.uTime.value += dt; });
  return (
    <mesh scale={[2, 2, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial ref={mat} uniforms={uniforms} vertexShader={vertex} fragmentShader={fragment} transparent />
    </mesh>
  );
}

export function ShaderFrame({ src, host }: { src: string; host: React.RefObject<HTMLElement | null> }) {
  return (
    <View track={host as React.RefObject<HTMLElement>} className="pointer-events-none absolute inset-0">
      <orthographicCamera makeDefault position={[0, 0, 1]} left={-1} right={1} top={1} bottom={-1} />
      <Plane src={src} host={host} />
    </View>
  );
}
```

`ProductFrame.tsx`: add `shader?: boolean`; when set, make the `<Picture>` wrapper a `relative` div with a `ref`, keep the `<img>` (fallback and for layout), and render `<ShaderFrameGate src={webp} host={ref} />` where `ShaderFrameGate` is a small client component that returns `<ShaderFrame>` only when `useTier() === "A"`. The plane draws on top of the image within the tracked rect, so the hover ripple and sweep replace the CSS sweep (skip the CSS sweep when `shader` is on and tier A).

`CaseStudy.tsx`: pass `shader` to the hero `ProductFrame`/`HeroTabs` and to `Gallery` frames (images only; video frames keep CSS). `app/work/[slug]/page.tsx`: render `<FrameCanvas />` after `<CaseStudy>`.

- [ ] **Step 3: Verify and commit**

Tier A on a case page: hovering the hero frame ripples the screenshot and runs a red light band through it; the image stays sharp at rest (progress 0 ⇒ no offset). No extra WebGL contexts beyond the single `FrameCanvas` (check `chrome://gpu` or count `canvas` elements = 1 on case pages). Tier B: CSS sweep as before.

```bash
git add -A
git commit -m "feat(work): shared-canvas shader hover with ripple and light band on case study frames

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 8: Small signature moments: contact assemble, 404 flicker, Neo tab crossfade, mobile polish

**Files:**
- Create: `components/home/ContactAssemble.tsx`, `components/ui/NotFoundFlicker.tsx`
- Modify: `components/home/Contact.tsx`, `app/not-found.tsx`, `components/work/HeroTabs.tsx`, `app/globals.css`

- [ ] **Step 1: Contact monogram assembles on enter**

`components/home/ContactAssemble.tsx` (client; wraps the Monogram next to "Send a signal."):

```tsx
"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useTier } from "@/lib/tiers";
import { Monogram } from "@/components/brand/Monogram";

export function ContactAssemble() {
  const tier = useTier();
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!tier || tier === "C" || !ref.current) return;
    const svg = ref.current.querySelector("svg")!;
    const parts = svg.querySelectorAll("rect, path, polygon");
    const dot = svg.querySelector("circle");
    const ctx = gsap.context(() => {
      gsap.set(parts, { opacity: 0, x: (i) => [-14, 0, 14][i], y: (i) => [0, -10, 10][i] });
      gsap.set(dot, { scale: 0, transformOrigin: "46px 32px" });
      gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 85%", once: true } })
        .to(dot, { scale: 1, duration: 0.3, ease: "back.out(2)" })
        .to(parts, { opacity: 1, x: 0, y: 0, duration: 0.6, stagger: 0.08, ease: "expo.out" }, "-=0.1");
    });
    return () => ctx.revert();
  }, [tier]);
  return <span ref={ref} className="hidden md:inline-block"><Monogram size={64} className="text-ink" title="Redzy monogram" /></span>;
}
```

Replace the static `<Monogram size={64} … />` in `Contact.tsx` with `<ContactAssemble />`.

- [ ] **Step 2: 404 flicker**

`components/ui/NotFoundFlicker.tsx`:

```tsx
"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useTier } from "@/lib/tiers";
import { Monogram } from "@/components/brand/Monogram";

export function NotFoundFlicker() {
  const tier = useTier();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!tier || tier === "C" || !ref.current) return;
    const dot = ref.current.querySelector<SVGCircleElement>("[data-signal-dot]")!;
    const flicker = () => gsap.timeline().to(dot, { fill: "#FF4A26", duration: 0.05 }).to(dot, { fill: "#8A857E", duration: 0.05 }).to(dot, { fill: "#FF4A26", duration: 0.08 }).to(dot, { fill: "#8A857E", duration: 0.12 }).to(dot, { fill: "#FF4A26", duration: 0.3, delay: 0.1 });
    if (tier === "B") { flicker(); return; }
    let armed = true;
    const onMove = (e: PointerEvent) => {
      const r = dot.getBoundingClientRect();
      const near = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)) < 120;
      if (near && armed) { armed = false; flicker().then(() => { armed = true; }); }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [tier]);
  return <div ref={ref}><Monogram size={160} lit={false} glow={false} className="text-[#1C1A18]" title="Redzy monogram, unlit" /></div>;
}
```

Use it in `app/not-found.tsx` in place of the static Monogram.

- [ ] **Step 3: Neo tabs crossfade**

In `HeroTabs.tsx` wrap the `ProductFrame` in `<ViewTransition key={i} name="neo-hero" share="auto" enter="auto" default="none">` and trigger the tab change inside `startTransition` (`import { startTransition, ViewTransition } from "react"`; `onClick={() => startTransition(() => setI(idx))}`). The three frames crossfade in place instead of swapping.

- [ ] **Step 4: Mobile polish (CSS only)**

Append to `globals.css`:

```css
@media (pointer: coarse) {
  [data-frame] { transition: transform 120ms var(--ease-out-quint); }
  [data-frame]:active { transform: scale(.985); }
  [data-row]:active { background: var(--color-surface-1); }
}
```

- [ ] **Step 5: Verify and commit**

Contact monogram assembles when scrolled into view; `/nope/` flickers the dot when the pointer nears it (desktop) or on load (mobile); Neo tabs crossfade; tapping a frame on a phone gives a subtle press.

```bash
git add -A
git commit -m "feat(polish): contact monogram assemble, 404 flicker, Neo tab crossfade and touch feedback

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---
### Task 9: Performance gates: bundle budgets, Lighthouse CI, frame-time trace

**Files:**
- Create: `lighthouserc.json`, `.github/workflows/lighthouse.yml`, `tests/e2e/perf.spec.ts`, `scripts/bundle-budget.mjs`
- Modify: `next.config.ts` (bundle analyzer), `package.json`

**Interfaces:**
- Produces: `npm run budget` (fails if initial JS > 200 KB gz or the 3D chunk > 400 KB gz); `npm run lhci` (fails on budgets from spec §10/§15.13).

- [ ] **Step 1: Bundle budget script**

```bash
npm install -D @next/bundle-analyzer@^16
```

`next.config.ts`: wrap with `withBundleAnalyzer({ enabled: process.env.ANALYZE === "1" })`.

`scripts/bundle-budget.mjs`:

```js
import { readdirSync, readFileSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";

const dir = "out/_next/static/chunks";
const files = readdirSync(dir).filter((f) => f.endsWith(".js")).map((f) => ({ f, gz: gzipSync(readFileSync(join(dir, f))).length }));
const three = files.filter((x) => /three|fiber|postprocessing|HeroScene/i.test(readFileSync(join(dir, x.f), "utf8").slice(0, 2000)) || x.gz > 150_000);
const threeTotal = three.reduce((a, b) => a + b.gz, 0);
const html = readFileSync("out/index.html", "utf8");
const initial = [...html.matchAll(/\/_next\/static\/chunks\/([^"]+\.js)/g)].map((m) => m[1]).filter((f, i, a) => a.indexOf(f) === i);
const initialTotal = initial.reduce((a, f) => a + gzipSync(readFileSync(join(dir, f))).length, 0);
console.log(`initial JS: ${(initialTotal / 1024).toFixed(1)} KB gz across ${initial.length} chunks`);
console.log(`3D chunks: ${(threeTotal / 1024).toFixed(1)} KB gz across ${three.length} chunks`);
let fail = false;
if (initialTotal > 200 * 1024) { console.error("FAIL initial JS budget 200 KB"); fail = true; }
if (threeTotal > 400 * 1024) { console.error("FAIL 3D chunk budget 400 KB"); fail = true; }
if (initial.some((f) => three.map((t) => t.f).includes(f))) { console.error("FAIL 3D chunk is in the initial bundle"); fail = true; }
process.exit(fail ? 1 : 0);
```

Add `"budget": "node scripts/bundle-budget.mjs"`. Run `npm run build && npm run budget` → both lines printed, exit 0. If the 3D chunk leaks into initial, check that nothing outside `HeroScene`/`ShaderFrame` imports `three` statically (`Monogram` must not).

- [ ] **Step 2: Lighthouse CI**

```bash
npm install -D @lhci/cli@^0.15
```

`lighthouserc.json`:

```json
{
  "ci": {
    "collect": { "staticDistDir": "./out", "url": ["http://localhost/index.html", "http://localhost/work/liblynx/index.html", "http://localhost/cv/index.html"], "numberOfRuns": 3, "settings": { "preset": "desktop" } },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.8 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 0.95 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.05 }]
      }
    },
    "upload": { "target": "temporary-public-storage" }
  }
}
```

Add a second config `lighthouserc.mobile.json` identical but without `"preset": "desktop"` and with `"categories:performance": ["error", { "minScore": 0.9 }]`, `"largest-contentful-paint": ["error", { "maxNumericValue": 2500 }]`, `"total-blocking-time": ["error", { "maxNumericValue": 200 }]`.

Scripts: `"lhci": "lhci autorun && lhci autorun --config=lighthouserc.mobile.json"`.

`.github/workflows/lighthouse.yml`:

```yaml
name: lighthouse
on: [pull_request]
jobs:
  lhci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 24, cache: npm }
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run build
      - run: npm run budget
      - run: npm run lhci
```

Run locally: `npm run lhci`. Fix regressions until green. Typical fixes: `preload` only the display font; `fetchPriority="high"` on the hero poster; keep `Bloom` levels at 6; defer `detect-gpu` (already lazy); ensure `HeroScene` is not fetched on mobile (check the network panel on Pixel 7 emulation: no `three` chunk).

- [ ] **Step 3: Frame-time trace of the dive**

`tests/e2e/perf.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("dive keeps frames under 32ms on desktop", async ({ page, browserName }, info) => {
  test.skip(info.project.name !== "desktop" || browserName !== "chromium");
  await page.goto("/");
  await page.waitForFunction(() => document.documentElement.dataset.tier === "A", null, { timeout: 10000 }).catch(() => test.skip(true, "no Tier A in this environment"));
  const client = await page.context().newCDPSession(page);
  await client.send("Overlay.setShowFPSCounter", { show: false }).catch(() => {});
  const longFrames = await page.evaluate(async () => {
    const times: number[] = [];
    let last = performance.now();
    const loop = () => { const now = performance.now(); times.push(now - last); last = now; if (times.length < 240) requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
    for (let i = 0; i < 24; i++) { window.scrollBy(0, 120); await new Promise((r) => setTimeout(r, 60)); }
    await new Promise((r) => setTimeout(r, 1500));
    return times.filter((t) => t > 32).length;
  });
  expect(longFrames).toBeLessThanOrEqual(6);
});
```

Headless Chromium uses SwiftShader, so this test is advisory in CI (allow up to 6 long frames); the real check is manual on an M1 Air with the Performance panel: no frame > 32 ms during the dive. Record the result in the plan's result section.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "perf: bundle budgets, lighthouse ci gates and a dive frame-time check

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 10: Content finalization and launch

**Files:**
- Modify: `content/work/liblynx.ts` (+ `arkona.ts`, `neo-labs.ts` if screenshots arrive), `scripts/process-assets.mjs`, `content/profile.ts` (copy pass), `docs/superpowers/plans/2026-10-10-portfolio-redesign-signal-motion.md` (results)
- Create: `docs/screenshots/after/*` (final), `docs/launch-checklist.md`

- [ ] **Step 1: Swap in owner app screenshots**

When files exist in `assets/source/app-screenshots/liblynx/` (e.g. `composer.png`, `saved-reports.png`, `mobile.png`): add `image()` jobs in `scripts/process-assets.mjs` writing `work/liblynx/hero-desktop-1600`, `gallery-1-1600`, `gallery-2-800`; update `alt` and `caption` in `content/work/liblynx.ts` to describe the report builder screens; run `npm run assets && npm test`. Same for `arkona` (GumaMax as `gallery-2-1600`, add it to the media list and `delivered`) and `neo-labs` panels (as extra gallery items). The media-exists test guards the paths.

- [ ] **Step 2: Copy pass with the owner**

Read `headline`, `lead`, `about`, `availability`, each `oneLiner` and `body` aloud against spec §5.2 and §7.2. Adjust in `content/` only. Confirm with the owner: Neo Labs start month, Amodo row, availability text, the "Head of Communications & Software Innovation" wording on the CV. Run `npm run check`.

- [ ] **Step 3: Final screenshots and checklist**

`docs/launch-checklist.md`:

```md
# Launch checklist (redesign/signal → main)

- [ ] `npm run check`, `npm run e2e`, `npm run budget`, `npm run lhci` green on the branch
- [ ] Vercel preview reviewed by the owner on phone + laptop (Tier B and Tier A)
- [ ] Manual Tier A dive on an M1 Air: no frame > 32 ms; loader lands in the navbar; cursor, magnetic, previews, shader frames work
- [ ] Reduced motion: no loader, static hero, all content visible
- [ ] CV PDF: 2 pages, dates correct, downloads from footer and /cv
- [ ] OG images render in a social preview tool for / and /work/liblynx/
- [ ] `docs/screenshots/after/` updated (`npm run screens` against the preview)
- [ ] Merge to main → production build on rijadkuloglija.com; `curl -I https://www.rijadkuloglija.com/` 200; old anchors (/#about) still land
- [ ] Submit sitemap in Google Search Console; verify robots.txt
- [ ] Post-launch Lighthouse on production; record numbers below
```

Run `npm run screens` with `BASE_URL` = preview URL; review every image against the spec; commit.

- [ ] **Step 4: Merge and deploy**

```bash
git checkout main && git pull
git merge --no-ff redesign/signal -m "feat: Redzy redesign (Signal) — Next.js 16, 3D hero, case studies, generated CV

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
git push origin main
```

Wait for the Vercel production deploy; walk the checklist; append "Plan 2 result" (preview URL, production URL, Lighthouse numbers, frame-time note, date) to this plan file and commit.

---

## Self-review against the spec

- §3.5 motion tokens: Task 2 (sweeps, eyebrow fades), Task 3 (cursor light as the cursor ring), Task 4 (navbar pulse), reduced motion everywhere via Tier C.
- §6.1 scene: Task 5. §6.2 timeline: Task 6 (phases 0–.20, .20–.55, .55–.62, .62–.82, .82–1 map one-to-one). §6.3 loader: Task 4. §6.4 tiers: Task 1; Tier B poster Task 5; Tier B red fade Task 6.
- §7.3 frame tilt: cursor "frame" mode + CSS; pointer tilt (3°) can be added to `LightSweeps` hover handler with `gsap.to(frame, { rotateX, rotateY })` if desired; sweeps Task 2; shader Task 7.
- §10 budgets: Task 9. §12 testing: Tasks 2, 6, 9. §13 delivery: Task 10.
- §15: 15.2 Task 2; 15.3 Task 3; 15.4 Task 3; 15.5 arrows Task 3; 15.6 Task 3; 15.8 Task 7; 15.9 Task 2 (rail) + Plan 1 (reading line); 15.10 Task 4; 15.11 ping Task 4; 15.12 flicker Task 8; 15.13 Task 9.
- Type consistency: `sceneBridge` fields (`progress, pointer, flare, intensity, bloom, cameraZ`) used identically in Tasks 5 and 6; `sweep()` exported from `LightSweeps` and consumed by `HeroDive`; `redzy:landed` event dispatched by Loader (Task 4) and HeroDive (Task 6), consumed by NavDot; `[data-hero]`, `[data-hero-poster]`, `[data-hero-scene]`, `[data-frame]`, `[data-sweep]`, `[data-chapter]`, `[data-chapters]`, `[data-rail]`, `[data-row][data-preview]`, `[data-magnetic]`, `[data-split]`, `[data-nav-dot]` hooks match Plan 1 markup.

## Open items
1. If `ViewTransition` is exported as `unstable_ViewTransition` in the installed React, alias the import in `PageTransition.tsx`, `ProductFrame.tsx` and `HeroTabs.tsx`.
2. If `gsap/DrawSVGPlugin` is not present in the installed GSAP build, drop `DrawArrows` (arrows keep the 2 px hover shift).
3. Headless WebGL in CI (SwiftShader) may report GPU tier 0 ⇒ Tier C; the desktop motion tests therefore branch on the detected tier and must not assume Tier A in CI.
