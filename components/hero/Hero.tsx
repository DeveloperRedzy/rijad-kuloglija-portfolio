import { Pill } from "@/components/ui/Pill";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { HeroPoster } from "./HeroPoster";
import { HeroOverlay } from "./HeroOverlay";
import { HeroDive } from "./HeroDive";
import { AvailabilityBadge } from "./AvailabilityBadge";
import { profile } from "@/content/profile";

export function Hero() {
  return (
    // No overflow clipping on the section: it is the ScrollTrigger pin target of the dive (Tier A).
    <section id="hero" data-hero className="relative min-h-[calc(100dvh-4rem)]">
      {/* Opaque backdrop (also under the navbar): while pinned, the hero covers the work section scrolling beneath it
          until the dive lands; HeroDive fades it out at .80. */}
      <div data-hero-bg aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -top-16 -z-10 bg-canvas" />
      <div className="overflow-hidden">
        <div className="container-site grid min-h-[calc(100dvh-4rem)] items-center gap-12 py-16 lg:grid-cols-12">
          <div data-hero-copy className="lg:col-span-7">
            <Eyebrow>{profile.name} · {profile.title} · Sarajevo</Eyebrow>
            <h1 data-split className="display-xl mt-6 max-w-[14ch] text-balance">{profile.headline}</h1>
            <p data-split className="mt-8 max-w-[48ch] text-lg leading-relaxed text-ink-soft md:text-xl">{profile.lead}</p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Pill href={`mailto:${profile.email}`} external dot>Send a signal</Pill>
              <Pill href="/#work" variant="outline">Selected work</Pill>
            </div>
            <AvailabilityBadge className="mt-8" />
          </div>
          <div className="lg:col-span-5"><HeroPoster /></div>
        </div>
      </div>
      <HeroOverlay />
      <HeroDive />
    </section>
  );
}
