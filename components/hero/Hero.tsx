import { Pill } from "@/components/ui/Pill";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { HeroPoster } from "./HeroPoster";
import { HeroOverlay } from "./HeroOverlay";
import { HeroDive } from "@/components/motion/lazy";
import { AvailabilityBadge } from "./AvailabilityBadge";
import { profile } from "@/content/profile";
import { CTA } from "@/content/nav";

export function Hero() {
  return (
    // No overflow clipping on the section: it is the ScrollTrigger pin target of the dive (Tier A).
    <section id="hero" data-hero className="relative min-h-[calc(100dvh-4rem)]">
      {/* Opaque backdrop (also under the navbar): while pinned, the hero covers the work section scrolling beneath it
          until the dive lands; HeroDive fades it out at .80. */}
      <div data-hero-bg aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -top-16 -z-10 bg-canvas" />
      <div className="overflow-hidden">
        {/* 8/4 with a 24 px column gap: the copy column is ~700 px at the 1200 px container, so the capped headline sets
            in three lines from 1024 up; the poster box fills its column (HeroPoster), capped at min(38vw, 620px).
            lg: more padding below than above sets the centred pair a little above the middle, so the CTAs clear the
            fold with room to spare at 1280×800 and 1440×900. */}
        <div className="container-site grid min-h-[calc(100dvh-4rem)] items-center gap-12 py-16 lg:grid-cols-12 lg:gap-x-6 lg:pb-32 lg:pt-10">
          <div data-hero-copy className="lg:col-span-8">
            {/* Segments never break inside; below 400 px the name is left to the logo so the line fits. */}
            <Eyebrow>
              <span className="hidden whitespace-nowrap min-[400px]:inline">{profile.name} ·</span>{" "}
              <span className="whitespace-nowrap">{profile.jobTitle} ·</span>{" "}
              <span className="whitespace-nowrap">{profile.city}</span>
            </Eyebrow>
            <h1 data-split className="display-hero mt-6 max-w-[14ch] text-balance lg:max-w-none">{profile.headline}</h1>
            <p data-split className="mt-8 max-w-[48ch] text-lg leading-relaxed text-ink-soft md:text-xl">{profile.lead}</p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Pill href={`mailto:${profile.email}?subject=${encodeURIComponent(CTA.subject)}`} external dot>{CTA.label}</Pill>
              <Pill href="/#work" variant="outline">Selected work</Pill>
            </div>
            <AvailabilityBadge className="mt-8" />
          </div>
          {/* The monogram may run into the right gutter (never past the viewport) so it keeps its weight next to the headline. */}
          <div className="lg:col-span-4 lg:-mr-12 xl:-mr-16"><HeroPoster /></div>
        </div>
      </div>
      <HeroOverlay />
      <HeroDive />
    </section>
  );
}
