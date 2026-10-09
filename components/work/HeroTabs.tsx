"use client";
import { useState } from "react";
import type { Media } from "@/content/schema";
import { ProductFrame } from "./ProductFrame";

export function HeroTabs({ heroes, slug, url }: { heroes: Media[]; slug: string; url?: string }) {
  const [i, setI] = useState(0);
  return (
    <div>
      <div role="tablist" aria-label="Products" className="mb-4 flex gap-2">
        {heroes.map((h, idx) => (
          <button key={h.src} role="tab" aria-selected={i === idx} onClick={() => setI(idx)} className={`eyebrow rounded-full border px-3 py-1.5 transition-colors ${i === idx ? "border-signal text-ink" : "border-hairline hover:text-ink"}`}>
            {h.caption ?? `0${idx + 1}`}
          </button>
        ))}
      </div>
      <ProductFrame media={heroes[i]} slug={slug} url={url} priority morph={i === 0} />
    </div>
  );
}
