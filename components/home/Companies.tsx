import { profile } from "@/content/profile";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function Companies() {
  const names = [...profile.companies, ...profile.companies];
  return (
    <section aria-label="Products and companies" className="relative border-t border-hairline bg-canvas py-14 md:py-20">
      <div className="container-site"><Eyebrow>Products and companies I've built for</Eyebrow></div>
      <div className="group mt-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <ul className="flex w-max gap-12 whitespace-nowrap motion-safe:animate-[marquee_60s_linear_infinite] group-hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
          {names.map((n, i) => (
            <li key={`${n}-${i}`} aria-hidden={i >= profile.companies.length} className="display-md text-ink-muted transition-colors hover:text-ink">
              <span className="decoration-signal underline-offset-8 hover:underline">{n}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
