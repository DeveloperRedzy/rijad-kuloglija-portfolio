import { profile } from "@/content/profile";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/brand/Icon";
import { Monogram } from "@/components/brand/Monogram";
import { CopyEmailButton } from "./CopyEmailButton";
import { AvailabilityBadge } from "@/components/hero/AvailabilityBadge";

export function Contact() {
  return (
    <section id="contact" data-sweep-section className="relative border-t border-hairline py-28 md:py-44">
      <div className="container-site">
        <Eyebrow>05 — Contact</Eyebrow>
        <div className="mt-6 flex items-center gap-6">
          <h2 data-split className="display-xl">Send a signal.</h2>
          <Monogram size={64} className="hidden text-ink md:block" title="Redzy monogram" />
        </div>
        <div className="mt-12 flex flex-col items-start gap-6">
          <CopyEmailButton email={profile.email} />
          <div className="flex flex-wrap gap-6">
            <a href={profile.links.github} target="_blank" rel="noreferrer" className="eyebrow inline-flex items-center gap-2 hover:text-ink"><Icon name="github" size={16} /> GitHub</a>
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="eyebrow inline-flex items-center gap-2 hover:text-ink"><Icon name="linkedin" size={16} /> LinkedIn</a>
            <a href="/Rijad-Kuloglija-CV.pdf" className="eyebrow inline-flex items-center gap-2 hover:text-ink"><Icon name="download" size={16} /> Download CV (PDF)</a>
            <a href="/cv/" className="eyebrow inline-flex items-center gap-2 hover:text-ink"><Icon name="arrow-up-right" size={16} /> CV page</a>
          </div>
          <AvailabilityBadge />
        </div>
      </div>
    </section>
  );
}
