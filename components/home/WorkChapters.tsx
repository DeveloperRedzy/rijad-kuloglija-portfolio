import Link from "next/link";
import { projects } from "@/content";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/brand/Icon";
import { Aura } from "@/components/brand/Aura";
import { ProductFrame } from "@/components/work/ProductFrame";
import { ProgressRail } from "@/components/motion/ProgressRail";
import { ChapterChoreo } from "@/components/motion/ChapterChoreo";

export function WorkChapters() {
  return (
    <section id="work" data-chapters className="relative">
      <span id="projects" className="sr-only" aria-hidden />
      {/* Tier A: revealed when the hero dive lands on it, not while it passes under the pinned hero (SplitReveal). */}
      <div data-reveal-after-dive className="container-site pb-6 pt-24 md:pt-32">
        <Eyebrow>01 — Selected work</Eyebrow>
        <h2 data-split className="display-lg mt-4 max-w-[16ch]">Real products, in production.</h2>
      </div>
      <ProgressRail />
      <ol className="relative">
        {projects.map((p, i) => {
          const hero = Array.isArray(p.media.hero) ? p.media.hero[0] : p.media.hero;
          return (
            <li
              key={p.slug}
              data-chapter={p.slug}
              style={{ zIndex: i + 1 }}
              className="sticky top-16 min-h-[calc(100dvh-4rem)] border-t border-hairline bg-canvas"
            >
              <Aura seed={p.slug} className="absolute inset-0 opacity-[0.08]" />
              <div data-chapter-grid className="container-site relative grid items-center gap-10 py-12 lg:min-h-[calc(100dvh-4rem-1px)] lg:grid-cols-12 lg:py-10">
                <div className="lg:col-span-5">
                  <p className="eyebrow text-signal">{String(p.index).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</p>
                  <p className="eyebrow mt-3">{p.categories.join(" · ")}</p>
                  <h3 className="display-lg mt-5">{p.name}</h3>
                  <p className="mt-5 max-w-[40ch] text-lg text-ink-soft">{p.oneLiner}</p>
                  <p className="eyebrow mt-6 normal-case tracking-normal text-ink-muted">{p.role} · {p.stack.slice(0, 4).join(" · ")}</p>
                  <Link href={`/work/${p.slug}/`} transitionTypes={["nav-forward"]} className="mt-8 inline-flex items-center gap-2 font-medium text-ink hover:text-signal-soft">
                    Read case study <Icon name="arrow-up-right" size={16} />
                  </Link>
                </div>
                <div className="order-first lg:order-none lg:col-span-7 lg:[&_img]:mx-auto lg:[&_img]:w-auto lg:[&_img]:max-h-[calc(100dvh-14rem)] lg:[&_img]:object-contain">
                  <Link href={`/work/${p.slug}/`} transitionTypes={["nav-forward"]} aria-label={`Open ${p.name} case study`} className="block">
                    <ProductFrame media={hero} slug={p.slug} url={p.live?.label} priority={i === 0} />
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      <ChapterChoreo />
    </section>
  );
}
