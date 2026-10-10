import { profile } from "@/content/profile";
import { projects } from "@/content";
import { formatPeriod } from "@/lib/format";
import { Monogram } from "@/components/brand/Monogram";

const host = (u: string) => u.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
const built = process.env.NEXT_PUBLIC_BUILD_DATE ?? "dev";

export function Cv() {
  const roles = profile.roles.filter((r) => r.showOnCv);
  return (
    <div style={{ ["--color-signal" as string]: "var(--color-signal-print)" }} className="cv mx-auto max-w-[800px] bg-paper px-8 py-10 text-paper-ink md:px-12 md:py-14 print:max-w-none print:px-0 print:py-0">
      <section className="cv-page">
        <header className="flex items-end justify-between gap-6 border-b border-paper-ink pb-4">
          <div>
            <p className="eyebrow inline-flex items-center gap-2 text-paper-ink/70"><Monogram size={12} glow={false} className="text-paper-ink" decorative /> {profile.title}</p>
            <h1 className="mt-2 font-display text-[34px] font-extrabold leading-none tracking-[-0.03em]">{profile.name}</h1>
          </div>
          <address className="eyebrow not-italic text-right normal-case tracking-[0.04em] leading-[1.7] text-paper-ink/80">
            <a href={`mailto:${profile.email}`}>{profile.email}</a><br />
            <a href={`https://www.${profile.domain}`}>{profile.domain}</a><br />
            <a href={profile.links.github}>{host(profile.links.github)}</a><br />
            <a href={profile.links.linkedin}>{host(profile.links.linkedin)}</a><br />
            {profile.location} · Remote
          </address>
        </header>

        <p className="mt-3 max-w-[90ch] text-[11.5px] leading-relaxed text-paper-ink/85">{profile.about}</p>

        <h2 className="cv-h">Experience <span className="float-right">{profile.since} → now</span></h2>
        <ol>
          {roles.map((r) => (
            <li key={`${r.company}-${r.start}`} className="grid grid-cols-[88px_1fr] gap-3 py-[3px] text-[11px] leading-snug">
              <span className={`font-mono text-[10px] tracking-[0.06em] ${r.current ? "text-signal" : "text-paper-ink/70"}`}>{formatPeriod(r.start, r.end)}</span>
              <div>
                <p><span className="font-semibold">{r.company} · {r.titleProgression ?? r.title}</span> <span className="text-[10.5px] text-paper-ink/70">({r.location} · {r.mode})</span></p>
                <p className="mt-0.5 text-paper-ink/85">{r.summary}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-3 grid grid-cols-[1.5fr_1fr] gap-6">
          <div>
            <h2 className="cv-h">Stack</h2>
            <ul className="flex flex-wrap gap-1">
              {profile.stack.flatMap((g) => g.items).map((i) => <li key={i} className="rounded border border-paper-ink/20 px-1.5 py-0.5 font-mono text-[9.5px] tracking-[0.04em]">{i}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="cv-h">Education · Languages</h2>
            {profile.education.map((e) => <p key={e.school} className="text-[12px]">{e.degree}, {e.school} ({e.years})</p>)}
            <p className="mt-1 text-[12px] text-paper-ink/70">{profile.languages.map((l) => `${l.name} ${l.level}`).join(" · ")}</p>
          </div>
        </div>
        <footer className="cv-foot"><span>{profile.domain}/cv · generated {built}</span><span>1 / 2</span></footer>
      </section>

      <section className="cv-page break-before-page">
        <h2 className="cv-h mt-0">Selected projects</h2>
        <ol>
          {projects.map((p) => (
            <li key={p.slug} className="grid grid-cols-[88px_1fr] gap-3 py-2.5 text-[12px] leading-snug">
              <span className="font-mono text-[10px] tracking-[0.06em] text-paper-ink/70">{p.period}</span>
              <div>
                <p className="font-semibold">{p.name} · {p.role}</p>
                <p className="mt-0.5 text-paper-ink/85">{p.cvLine}</p>
                {p.live && <p className="mt-0.5 text-[11px] text-paper-ink/70"><a href={p.live.url}>{host(p.live.url)}</a></p>}
              </div>
            </li>
          ))}
        </ol>
        <h2 className="cv-h">Lab &amp; more</h2>
        <ul>
          {profile.lab.map((l) => <li key={l.name} className="py-1 text-[12px]"><span className="font-semibold">{l.name}</span> <span className="text-paper-ink/70">({l.year})</span> — {l.line}</li>)}
        </ul>
        <footer className="cv-foot"><span>{profile.domain}/cv · generated {built}</span><span>2 / 2</span></footer>
      </section>
    </div>
  );
}
