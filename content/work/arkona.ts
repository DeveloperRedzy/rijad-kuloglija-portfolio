import type { Project } from "../schema";

export const arkona: Project = {
  slug: "arkona",
  index: 3,
  name: "Arkona + GumaMax",
  categories: ["Company website", "Commerce dashboard"],
  oneLiner: "Sole frontend engineer on a software company's bilingual website, plus a multi-vendor tire-ordering dashboard.",
  role: "Senior Frontend Developer",
  roleNote: "Part-time",
  period: "Oct 2024 — Mar 2025",
  stack: ["React"],
  focus: ["Responsive UI", "Performance", "i18n (EN/SR)", "Dashboard workflows"],
  live: { label: "arkonatechnology.com", url: "https://www.arkonatechnology.com/" },
  body: {
    overview:
      "Arkona Technology is a Belgrade software company building web, mobile and e-commerce products on a stack that runs from Symfony and Node.js to React and Next.js.",
    problem:
      "The brief was the whole frontend, with the client's own developers as the audience: one engineer responsible for the architecture, responsive behavior, performance and production delivery of a bilingual (English/Serbian) single-page React site with a dark visual identity. Alongside it came a commercial product with operational weight: tire ordering across multiple vendors.",
    contribution:
      "I built the website end to end, from architecture to deployment. I also developed GumaMax, a web-based tire-ordering dashboard for selling and managing products across multiple vendors: catalog, vendor management and ordering workflows.",
    engineering:
      "The website is responsive React engineering with bilingual content and performance work on an image-heavy marketing site. GumaMax is a separate product: multi-vendor catalog and ordering workflows where correct stock and pricing matter more than visual flourish.",
  },
  delivered: [
    "Arkona's production website, live at arkonatechnology.com",
    "GumaMax multi-vendor tire-ordering dashboard",
    "Architecture, responsive build and deployment of the website",
  ],
  decisions: [
    { choice: "English and Serbian content in one React codebase", why: "Both audiences get the same site in the same release, with no second build to keep in sync." },
    { choice: "GumaMax built as a separate product", why: "Its multi-vendor catalog and ordering put correct stock and pricing first, and the marketing site stays simple." },
  ],
  sinceLaunch:
    "The website is live at arkonatechnology.com. My part-time engagement ended in March 2025, and the site has stayed in production since.",
  media: {
    hero: { src: "/media/work/arkona/hero-desktop-1600.webp", alt: "arkonatechnology.com home page", kind: "desktop", width: 1600, height: 1000 },
    gallery: [
      { src: "/media/work/arkona/gallery-1-800.webp", alt: "arkonatechnology.com on a phone", kind: "mobile", width: 800, height: 1734, caption: "arkonatechnology.com · mobile" },
    ],
  },
  cvLine: "Built Arkona Technology's bilingual React website end to end as the sole frontend engineer, and GumaMax, a multi-vendor tire-ordering dashboard.",
  featured: true,
};
