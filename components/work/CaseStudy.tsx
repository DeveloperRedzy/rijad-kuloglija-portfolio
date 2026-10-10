import type { Project } from "@/content/schema";
import { profile } from "@/content/profile";
import { projects } from "@/content";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Pill } from "@/components/ui/Pill";
import { Aura } from "@/components/brand/Aura";
import { Icon } from "@/components/brand/Icon";
import { ProductFrame } from "./ProductFrame";
import { HeroTabs } from "./HeroTabs";
import { Gallery } from "./Gallery";
import { NextProject } from "./NextProject";
import { BackToWork } from "./BackToWork";
import { ReadingProgress } from "./ReadingProgress";
import { pad2 } from "@/lib/format";

const SECTIONS: Array<[keyof Project["body"], string]> = [
  ["overview", "Overview"], ["problem", "Problem"], ["contribution", "Contribution"], ["engineering", "Engineering"],
];

export function CaseStudy({ project, next }: { project: Project; next: Project }) {
  const heroes = Array.isArray(project.media.hero) ? project.media.hero : [project.media.hero];
  const subject = encodeURIComponent(`About ${project.name}`);
  return (
    <article className="relative">
      <ReadingProgress />
      <Aura seed={project.slug} className="pointer-events-none absolute inset-x-0 top-0 h-[520px] opacity-[0.18] [mask-image:linear-gradient(180deg,#000,transparent)]" />
      <div className="container-site relative pt-10 md:pt-14">
        <BackToWork />
        <header className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow><span className="text-signal">{pad2(project.index)} / {pad2(projects.length)}</span> &nbsp;·&nbsp; {project.categories.join(" · ")}</Eyebrow>
            <h1 data-split className="display-xl mt-5 max-w-[12ch]">{project.name}</h1>
            <p data-split className="mt-5 max-w-[30ch] text-xl leading-snug text-ink-soft">{project.oneLiner}</p>
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 lg:col-span-5">
            <div className="border-t border-hairline pt-3"><dt className="eyebrow">Role</dt><dd className="mt-1.5 text-ink">{project.role}{project.roleNote && <span className="block text-sm text-ink-muted">{project.roleNote}</span>}</dd></div>
            <div className="border-t border-hairline pt-3"><dt className="eyebrow">Period</dt><dd className="mt-1.5 text-ink">{project.period}</dd></div>
            <div className="border-t border-hairline pt-3"><dt className="eyebrow">Stack</dt><dd className="mt-1.5 text-sm leading-relaxed text-ink">{project.stack.join(" · ")}</dd></div>
            <div className="border-t border-hairline pt-3"><dt className="eyebrow">Live</dt><dd className="mt-1.5">{project.live ? <a href={project.live.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-signal-soft hover:text-ink">{project.live.label} <Icon name="arrow-up-right" size={14} /></a> : <span className="text-ink-muted">Private</span>}</dd></div>
          </dl>
        </header>

        <div className="mt-12 md:mt-16">
          {heroes.length > 1 ? <HeroTabs heroes={heroes} slug={project.slug} url={project.live?.label} shader /> : <ProductFrame media={heroes[0]} slug={project.slug} url={project.live?.label} priority shader />}
        </div>

        <div className="mt-16 grid md:mt-24 md:grid-cols-[200px_1fr]">
          {SECTIONS.map(([key, label]) => (
            <div key={key} className="contents">
              <h2 className="eyebrow border-t border-hairline pt-7 md:pb-7">{label}</h2>
              <p data-split className="max-w-[62ch] border-t border-hairline pb-7 pt-3 text-base leading-relaxed text-ink-soft md:pt-7 md:text-lg">{project.body[key]}</p>
            </div>
          ))}
          <h2 className="eyebrow border-t border-hairline pt-7 md:pb-7">Delivered</h2>
          <ul className="border-t border-hairline pb-7 pt-3 md:pt-7">
            {project.delivered.map((d) => <li key={d} className="flex gap-4 border-b border-surface-2 py-2.5 text-ink-soft"><span aria-hidden className="text-signal">—</span>{d}</li>)}
          </ul>
        </div>

        <div className="mt-12"><Gallery items={project.media.gallery} slug={project.slug} shader /></div>

        <div className="mt-14 flex flex-wrap gap-3">
          {project.live && <Pill href={project.live.url} external dot>Visit {project.live.label}</Pill>}
          <Pill href={`mailto:${profile.email}?subject=${subject}`} external variant="outline">Ask me about this project</Pill>
        </div>

        <div className="mb-24 mt-16"><NextProject project={next} /></div>
      </div>
    </article>
  );
}
