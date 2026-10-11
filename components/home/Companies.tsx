"use client";
import { useState } from "react";
import { profile } from "@/content/profile";
import { COMPANIES } from "@/content/labels";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/brand/Icon";

export function Companies() {
  // WCAG 2.2.2: the marquee moves for longer than 5 s, so it gets a control (hover/focus pausing alone is not enough)
  const [paused, setPaused] = useState(false);
  const names = [...profile.companies, ...profile.companies];
  return (
    <section aria-label="Companies" className="relative border-t border-hairline bg-canvas py-14 md:py-20">
      <div className="container-site flex items-center justify-between gap-4">
        <Eyebrow>{COMPANIES.eyebrow}</Eyebrow>
        {/* hidden where the marquee does not animate; negative margin keeps the 44 px hit area out of the layout */}
        <button
          type="button"
          aria-label={COMPANIES.pause}
          aria-pressed={paused}
          onClick={() => setPaused((p) => !p)}
          className="-my-3.5 -mr-3 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:text-ink motion-reduce:hidden"
        >
          <Icon name={paused ? "play" : "pause"} size={16} />
        </button>
      </div>
      <div className="group mt-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        {/* The play state rides in --marquee-state: the motion-safe shorthand is emitted after the plain utilities and
            would reset an animation-play-state set beside it. */}
        <ul className={`flex w-max gap-12 whitespace-nowrap motion-safe:animate-[marquee_60s_linear_infinite_var(--marquee-state,running)] group-hover:[--marquee-state:paused] focus-within:[--marquee-state:paused] ${paused ? "[--marquee-state:paused]" : ""}`}>
          {names.map((n, i) => (
            <li key={`${n}-${i}`} aria-hidden={i >= profile.companies.length} className="display-md text-ink-muted transition-colors hover:text-ink">
              <span className="decoration-signal underline-offset-8 hover:underline">{n}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
