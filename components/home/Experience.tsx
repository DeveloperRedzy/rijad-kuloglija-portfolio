import { profile } from "@/content/profile";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PRESENT } from "@/lib/format";
import { ExperienceList } from "./ExperienceList";

export function Experience() {
  return (
    <section id="experience" data-sweep-section className="border-t border-hairline py-24 md:py-40">
      <div className="container-site">
        <div className="flex items-end justify-between gap-6">
          <div>
            <Eyebrow as="h2">03 — Experience</Eyebrow>
            <p data-split className="display-lg mt-4">{profile.since} → {PRESENT}</p>
          </div>
          <p className="eyebrow hidden md:block">{profile.roles.length} roles</p>
        </div>
        <ExperienceList roles={profile.roles} />
      </div>
    </section>
  );
}
