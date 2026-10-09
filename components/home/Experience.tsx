import { profile } from "@/content/profile";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ExperienceList } from "./ExperienceList";

export function Experience() {
  return (
    <section id="experience" className="border-t border-hairline py-24 md:py-40">
      <div className="container-site">
        <div className="flex items-end justify-between gap-6">
          <div>
            <Eyebrow>03 — Experience</Eyebrow>
            <h2 data-split className="display-lg mt-4">{profile.since} → now</h2>
          </div>
          <p className="eyebrow hidden md:block">{profile.roles.length} roles · {profile.roles.filter((r) => r.current).length} current</p>
        </div>
        <ExperienceList roles={profile.roles} />
      </div>
    </section>
  );
}
