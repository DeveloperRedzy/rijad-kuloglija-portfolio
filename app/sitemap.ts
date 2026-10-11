import type { MetadataRoute } from "next";
// validate: parses all content at build time, so an invalid edit fails `npm run build`
import { projectSlugs, profile } from "@/content/validate";

export const dynamic = "force-static";
const base = `https://www.${profile.domain}`;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/cv/`, priority: 0.6 },
    ...projectSlugs.map((s) => ({ url: `${base}/work/${s}/`, priority: 0.8 })),
  ];
}
