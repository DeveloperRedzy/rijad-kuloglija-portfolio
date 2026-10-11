import { profile } from "@/content/profile";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/brand/Icon";
import { ContactAssemble } from "./ContactAssemble";
import { CopyEmailButton } from "./CopyEmailButton";
import { AvailabilityBadge } from "@/components/hero/AvailabilityBadge";

/** 44 px hit areas; the list's negative margin keeps the visual spacing it had with text-height links. */
const LINK = "eyebrow inline-flex min-h-11 items-center gap-2 hover:text-ink";

export function Contact() {
  return (
    <section id="contact" data-sweep-section className="relative border-t border-hairline py-28 md:py-44">
      <div className="container-site">
        <Eyebrow as="h2">05 — Contact</Eyebrow>
        <div className="mt-6 flex items-center gap-6">
          <p data-split className="display-xl">Send a signal.</p>
          <ContactAssemble />
        </div>
        <p className="mt-8 max-w-[62ch] text-lg leading-relaxed text-ink-soft">{profile.contactNote}</p>
        <div className="mt-10 flex flex-col items-start gap-6">
          <CopyEmailButton email={profile.email} />
          <div className="-my-3.5 flex flex-wrap gap-x-6">
            <a href={profile.links.github} target="_blank" rel="noreferrer" className={LINK}><Icon name="github" size={16} /> GitHub</a>
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className={LINK}><Icon name="linkedin" size={16} /> LinkedIn</a>
            <a href="/Rijad-Kuloglija-CV.pdf" className={LINK}><Icon name="download" size={16} /> Download CV (PDF)</a>
            <a href="/cv/" className={LINK}><Icon name="arrow-up-right" size={16} /> CV page</a>
          </div>
          <AvailabilityBadge />
        </div>
      </div>
    </section>
  );
}
