import { LocalTime } from "./LocalTime";
import { profile } from "@/content/profile";
import { buildDay } from "@/lib/format";

export function Footer() {
  const updated = buildDay();
  return (
    <footer className="container-site flex flex-col gap-3 border-t border-hairline py-8 md:flex-row md:items-center md:justify-between">
      <p className="eyebrow"><LocalTime city={profile.city} /></p>
      {updated && <p className="eyebrow">Updated {updated}</p>}
      <p className="eyebrow">© {new Date().getFullYear()} {profile.name}</p>
    </footer>
  );
}
