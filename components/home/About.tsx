import { profile } from "@/content/profile";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Aura } from "@/components/brand/Aura";

export function About() {
  const portrait = { src: "/media/about/portrait-1200.webp", alt: `${profile.name}, portrait by a window`, kind: "desktop" as const, width: 1200, height: 1500 };
  return (
    <section id="about" className="relative border-t border-hairline py-24 md:py-40">
      <div className="container-site grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="relative overflow-hidden rounded-[var(--radius-frame)] border border-hairline">
            <picture>
              <source type="image/avif" srcSet="/media/about/portrait-1200.avif 1200w, /media/about/portrait-2400.avif 2400w" sizes="(min-width:1024px) 30vw, 90vw" />
              <img src={portrait.src} srcSet="/media/about/portrait-1200.webp 1200w, /media/about/portrait-2400.webp 2400w" sizes="(min-width:1024px) 30vw, 90vw" alt={portrait.alt} width={portrait.width} height={portrait.height} loading="lazy" decoding="async" className="block w-full" />
            </picture>
            <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-screen" style={{ background: "linear-gradient(90deg, rgba(255,74,38,0) 45%, rgba(255,74,38,.38))" }} />
            <Aura seed="rijad" className="pointer-events-none absolute inset-0 opacity-30 mix-blend-screen" />
          </div>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <Eyebrow>02 — About</Eyebrow>
          <h2 data-split className="display-lg mt-4 max-w-[16ch]">Frontend architecture, backed by real backend work.</h2>
          <p data-split className="mt-8 max-w-[62ch] text-lg leading-relaxed text-ink-soft">{profile.about}</p>
          <div className="mt-12 grid gap-10 sm:grid-cols-2">
            <div>
              <Eyebrow>Strengths</Eyebrow>
              <ul className="mt-4 divide-y divide-hairline">
                {profile.strengths.map((s) => <li key={s} className="py-3 text-ink">{s}</li>)}
              </ul>
            </div>
            <div>
              <Eyebrow>Core stack</Eyebrow>
              <div className="mt-4 space-y-4">
                {profile.stack.map((g) => (
                  <div key={g.group}>
                    <p className="eyebrow text-ink-muted/70">{g.group}</p>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {g.items.map((i) => <li key={i} className="rounded-md border border-hairline bg-surface-1 px-2 py-1 font-mono text-[11px] tracking-[0.06em] text-ink-soft">{i}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="eyebrow mt-12">{profile.location} · Building since {profile.since} · {profile.education[0].degree}, {profile.education[0].school.split(",")[0]} · {profile.languages.map((l) => l.name.slice(0, 2).toUpperCase()).join(" / ")}</p>
        </div>
      </div>
    </section>
  );
}
