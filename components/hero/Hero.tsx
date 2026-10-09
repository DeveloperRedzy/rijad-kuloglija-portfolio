import { Pill } from "@/components/ui/Pill";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { HeroPoster } from "./HeroPoster";
import { AvailabilityBadge } from "./AvailabilityBadge";
import { profile } from "@/content/profile";

export function Hero() {
  return (
    <section id="hero" data-hero className="relative min-h-[calc(100dvh-4rem)] overflow-hidden">
      <div className="container-site grid min-h-[calc(100dvh-4rem)] items-center gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
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
    </section>
  );
}
