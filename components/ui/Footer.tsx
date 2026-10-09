import { LocalTime } from "./LocalTime";
import { profile } from "@/content/profile";

export function Footer() {
  const built = process.env.NEXT_PUBLIC_BUILD_DATE ?? "dev";
  return (
    <footer className="container-site flex flex-col gap-3 border-t border-hairline py-8 md:flex-row md:items-center md:justify-between">
      <p className="eyebrow"><LocalTime /></p>
      <p className="eyebrow">Status · shipping · built {built}</p>
      <p className="eyebrow">© {new Date().getFullYear()} Redzy · {profile.name}</p>
    </footer>
  );
}
