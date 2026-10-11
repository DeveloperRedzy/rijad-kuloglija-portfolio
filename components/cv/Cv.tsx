import { profile } from "@/content/profile";
import { projects } from "@/content";
import { formatPeriodMonths, PRESENT } from "@/lib/format";
import { Monogram } from "@/components/brand/Monogram";

const host = (u: string) => u.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
const built = process.env.NEXT_PUBLIC_BUILD_DATE ?? "dev";

// Screen sizes first, print sizes after: the screen reads at ≥ 13 px body / 11 px labels,
// while print keeps the dense scale that fits the CV on two A4 pages.
const BODY = "text-[13px] print:text-[12px]";
const BODY_DENSE = "text-[13px] print:text-[11px]";
const LABEL = "text-[11px] print:text-[10px]";
// Below sm (screen only; A4 print is wider) the period column narrows so the text column keeps room at 320 px.
const PERIOD_COL = "grid-cols-[136px_minmax(0,1fr)] max-sm:grid-cols-[88px_minmax(0,1fr)] print:grid-cols-[88px_1fr]";
// .cv-h and .cv-foot set their print sizes in globals.css; ! lets the screen size win over that unlayered rule.
const HEADING = "text-[11px]! print:text-[10px]!";
const FOOT = "text-[11px]! print:text-[9px]!";

export function Cv() {
  const roles = profile.roles.filter((r) => r.showOnCv);
  const moreWork = profile.lab.filter((l) => l.showOnCv);
  return (
    <div style={{ ["--color-signal" as string]: "var(--color-signal-print)" }} className="cv mx-auto max-w-[800px] bg-paper px-8 py-10 text-paper-ink md:px-12 md:py-14 print:max-w-none print:px-0 print:py-0">
      <section className="cv-page">
        {/* Below sm the address drops under the name (left-aligned) so a long email cannot widen a 320 px page. */}
        <header className="flex items-end justify-between gap-6 border-b border-paper-ink pb-4 max-sm:flex-col max-sm:items-start max-sm:gap-3">
          <div className="min-w-0">
            <p className="eyebrow inline-flex items-center gap-2 text-paper-ink/70"><Monogram size={12} glow={false} className="text-paper-ink" decorative /> {profile.title}</p>
            <h1 className="mt-2 font-display text-[34px] font-extrabold leading-none tracking-[-0.03em]">{profile.name}</h1>
          </div>
          <address className="eyebrow min-w-0 not-italic text-right [overflow-wrap:anywhere] max-sm:text-left normal-case tracking-[0.04em] leading-[1.7] text-paper-ink/80">
            <a href={`mailto:${profile.email}`}>{profile.email}</a><br />
            <a href={`https://www.${profile.domain}`}>{profile.domain}</a><br />
            <a href={profile.links.github}>{host(profile.links.github)}</a><br />
            <a href={profile.links.linkedin}>{host(profile.links.linkedin)}</a><br />
            {profile.location} · Remote
          </address>
        </header>

        <p className="mt-3 max-w-[90ch] text-[13px] leading-relaxed text-paper-ink/85 print:text-[11.5px]">{profile.about}</p>

        <h2 className={`cv-h ${HEADING}`}>Experience <span className="float-right">{profile.since} → {PRESENT}</span></h2>
        <ol>
          {roles.map((r) => (
            <li key={`${r.company}-${r.start}`} className={`grid ${PERIOD_COL} gap-3 py-[3px] leading-snug ${BODY_DENSE}`}>
              <span className={`font-mono tracking-[0.06em] ${LABEL} ${r.current ? "text-signal" : "text-paper-ink/70"}`}>{formatPeriodMonths(r.start, r.end)}</span>
              <div className="min-w-0">
                <p><span className="font-semibold">{r.company} · {r.titleProgression ?? r.title}</span> <span className={`text-paper-ink/70 ${LABEL}`}>({r.location} · {r.mode})</span></p>
                <p className="mt-0.5 text-paper-ink/85">{r.summary}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-3 grid grid-cols-[1.5fr_1fr] gap-6 max-sm:grid-cols-1 max-sm:gap-0">
          <div className="min-w-0">
            <h2 className={`cv-h ${HEADING}`}>Stack</h2>
            <dl className="space-y-1.5">
              {profile.stack.map((g) => (
                <div key={g.group} className="grid grid-cols-[72px_1fr] gap-2 print:grid-cols-[64px_1fr]">
                  <dt className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-paper-ink/70 print:text-[9px]">{g.group}</dt>
                  <dd className="m-0 flex flex-wrap gap-1">
                    {g.items.map((i) => <span key={i} className="rounded border border-paper-ink/20 px-1.5 py-0.5 font-mono text-[11px] tracking-[0.04em] print:text-[9.5px]">{i}</span>)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="min-w-0">
            <h2 className={`cv-h ${HEADING}`}>Education · Languages</h2>
            {profile.education.map((e) => <p key={e.school} className={BODY}>{e.degree}, {e.school} ({e.years})</p>)}
            <p className={`mt-1 text-paper-ink/70 ${BODY}`}>{profile.languages.map((l) => `${l.name} ${l.level}`).join(" · ")}</p>
          </div>
        </div>
        <footer className={`cv-foot ${FOOT}`}><span>{profile.domain}/cv · generated {built}</span><span>1 / 2</span></footer>
      </section>

      <section className="cv-page break-before-page">
        <h2 className={`cv-h mt-0 ${HEADING}`}>Selected projects</h2>
        <ol>
          {projects.map((p) => (
            <li key={p.slug} className={`grid ${PERIOD_COL} gap-3 py-2.5 leading-snug ${BODY}`}>
              <span className={`font-mono tracking-[0.06em] text-paper-ink/70 ${LABEL}`}>{p.period}</span>
              <div className="min-w-0">
                <p className="font-semibold">{p.name} · {p.role}</p>
                <p className="mt-0.5 text-paper-ink/85">{p.cvLine}</p>
                {p.live && <p className="mt-0.5 text-[12px] text-paper-ink/70 [overflow-wrap:anywhere] print:text-[11px]"><a href={p.live.url}>{host(p.live.url)}</a></p>}
              </div>
            </li>
          ))}
        </ol>
        {moreWork.length > 0 && (
          <>
            <h2 className={`cv-h ${HEADING}`}>More work</h2>
            <ul>
              {moreWork.map((l) => <li key={l.name} className={`py-1 ${BODY}`}><span className="font-semibold">{l.name}</span> <span className="text-paper-ink/70">({l.year})</span> — {l.line}</li>)}
            </ul>
          </>
        )}
        <footer className={`cv-foot ${FOOT}`}><span>{profile.domain}/cv · generated {built}</span><span>2 / 2</span></footer>
      </section>
    </div>
  );
}
