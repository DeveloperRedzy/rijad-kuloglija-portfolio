import Link from "next/link";
import { projects } from "@/content";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/brand/Icon";
import { Aura } from "@/components/brand/Aura";
import { ProductFrame } from "@/components/work/ProductFrame";

export function WorkChapters() {
  return (
    <section id="work" data-chapters className="relative">
      <div className="container-site pb-6 pt-24 md:pt-32">
        <Eyebrow>01 — Selected work</Eyebrow>
        <h2 data-split className="display-lg mt-4 max-w-[16ch]">Real products, in production.</h2>
      </div>
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
              <div className="container-site relative grid min-h-[calc(100dvh-4rem)] items-center gap-10 py-16 lg:grid-cols-12">
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
                <div className="lg:col-span-7">
                  <Link href={`/work/${p.slug}/`} transitionTypes={["nav-forward"]} aria-label={`Open ${p.name} case study`} className="block">
                    <ProductFrame media={hero} slug={p.slug} url={p.live?.label} priority={i === 0} />
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
