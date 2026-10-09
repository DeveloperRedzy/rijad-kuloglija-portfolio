"use client";
import { useState } from "react";
import type { Role } from "@/content/schema";
import { formatPeriod } from "@/lib/format";
import { Icon } from "@/components/brand/Icon";

export function ExperienceList({ roles }: { roles: Role[] }) {
  const [all, setAll] = useState(false);
  const shown = all ? roles : roles.slice(0, 5);
  return (
    <>
      <ol className="mt-10 border-t border-hairline">
        {shown.map((r) => (
          <li key={`${r.company}-${r.start}`} data-row data-preview={r.projectSlug} className="group grid gap-2 border-b border-hairline py-5 transition-colors hover:border-signal/60 md:grid-cols-12 md:items-baseline md:gap-6">
            <p className={`eyebrow md:col-span-2 ${r.current ? "text-signal" : ""}`}>{formatPeriod(r.start, r.end)}</p>
            <div className="md:col-span-7">
              <p className="headline text-ink">{r.company} <span className="text-ink-muted">·</span> {r.titleProgression ?? r.title}</p>
              <p className="mt-1.5 max-w-[62ch] text-ink-soft">{r.summary}</p>
            </div>
            <p className="eyebrow md:col-span-3 md:text-right">{r.location} · {r.mode}</p>
          </li>
        ))}
      </ol>
      {roles.length > 5 && (
        <button type="button" onClick={() => setAll((a) => !a)} aria-expanded={all} className="mt-6 inline-flex items-center gap-2 font-medium text-ink hover:text-signal-soft">
          {all ? "Show fewer" : `Show all ${roles.length} roles`} <Icon name={all ? "arrow-up-right" : "arrow-right"} size={16} />
        </button>
      )}
    </>
  );
}
