"use client";
import { useRef, useState, type KeyboardEvent } from "react";
import type { Media } from "@/content/schema";
import { ProductFrame } from "./ProductFrame";

export function HeroTabs({ heroes, slug, url }: { heroes: Media[]; slug: string; url?: string }) {
  const [i, setI] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  const select = (idx: number) => {
    setI(idx);
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
            aria-controls={`hero-panel-${idx}`}
            tabIndex={i === idx ? 0 : -1}
            onClick={() => setI(idx)}
            className={`eyebrow rounded-full border px-3 py-1.5 transition-colors ${i === idx ? "border-signal text-ink" : "border-hairline hover:text-ink"}`}
          >
            {h.caption ?? `0${idx + 1}`}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`hero-panel-${i}`} aria-labelledby={`hero-tab-${i}`}>
        {/* Only the first hero shares the frame-<slug> name with the home chapter. */}
        <ProductFrame media={heroes[i]} slug={slug} url={url} priority morph={i === 0} />
      </div>
    </div>
  );
}
