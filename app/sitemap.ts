import type { MetadataRoute } from "next";
import { projectSlugs, profile } from "@/content";

export const dynamic = "force-static";
const base = `https://www.${profile.domain}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, priority: 1 },
    { url: `${base}/cv/`, lastModified: now, priority: 0.6 },
    ...projectSlugs.map((s) => ({ url: `${base}/work/${s}/`, lastModified: now, priority: 0.8 })),
  ];
}
