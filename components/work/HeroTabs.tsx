"use client";
import { startTransition, useRef, useState, ViewTransition, type KeyboardEvent } from "react";
import type { Media } from "@/content/schema";
import { ProductFrame } from "./ProductFrame";
import { pad2 } from "@/lib/format";

export function HeroTabs({ heroes, slug, url, shader }: { heroes: Media[]; slug: string; url?: string; shader?: boolean }) {
  const [i, setI] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  const select = (idx: number) => {
    startTransition(() => setI(idx));
    tabs.current[idx]?.focus();
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = heroes.length - 1;
    const next = e.key === "ArrowRight" ? (i === last ? 0 : i + 1)
      : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    select(next);
  };

  return (
    <div>
      <div role="tablist" aria-label="Products" onKeyDown={onKeyDown} className="mb-4 flex gap-2">
        {heroes.map((h, idx) => (
          <button
            key={h.src}
            ref={(el) => { tabs.current[idx] = el; }}
            id={`hero-tab-${idx}`}
            role="tab"
            aria-selected={i === idx}
            aria-controls="hero-panel"
            tabIndex={i === idx ? 0 : -1}
            onClick={() => startTransition(() => setI(idx))}
            className={`eyebrow rounded-full border px-3 py-1.5 transition-colors ${i === idx ? "border-signal text-ink" : "border-hairline hover:text-ink"}`}
          >
            {h.caption ?? pad2(idx + 1)}
          </button>
        ))}
      </div>
      {/* one panel, re-filled per tab: every tab controls it, it is labelled by the selected tab */}
      <div role="tabpanel" id="hero-panel" aria-labelledby={`hero-tab-${i}`}>
        {/* Only the first hero shares the frame-<slug> name with the home chapter. */}
        <ViewTransition key={i} name="neo-hero" share="auto" enter="auto" default="none">
          <ProductFrame media={heroes[i]} slug={slug} url={url} priority morph={i === 0} shader={shader} />
        </ViewTransition>
      </div>
    </div>
  );
}
