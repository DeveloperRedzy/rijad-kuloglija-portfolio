import type { Project } from "../schema";

export const arkona: Project = {
  slug: "arkona",
  index: 4,
  name: "Arkona + GumaMax",
  categories: ["Software company", "Web platform", "Commerce dashboard"],
  oneLiner: "End-to-end ownership of a software company's own web presence, plus a multi-vendor tire-ordering dashboard.",
  role: "Senior Frontend Developer",
  roleNote: "part-time, Oct 2024 — Mar 2025",
  period: "Oct 2024 — Mar 2025",
  stack: ["React", "Responsive UI", "Performance", "i18n (EN/SR)", "Dashboard workflows"],
  live: { label: "arkonatechnology.com", url: "https://www.arkonatechnology.com/" },
  body: {
    overview:
      "Arkona Technology is a Belgrade software development company positioning itself as a long-term technology partner, building web, mobile and e-commerce products on a stack running from Symfony and Node.js to React and Next.js. A software company's own website is a portfolio piece by definition: it gets judged by engineers.",
    problem:
      "Full frontend ownership with the client's own developers as the audience: one engineer responsible for the architecture, the responsive behavior, the performance and the production delivery of a bilingual (English/Serbian) single-page React site with a dark visual identity. Alongside it, a commercial product with real operational complexity: tire ordering across multiple vendors.",
    contribution:
      "I led the end-to-end development of the website, architecture through deployment. I also developed GumaMax, a web-based tire-ordering dashboard enabling multi-vendor product sales and management: catalog, vendor management and ordering workflows.",
    engineering:
      "Responsive React frontend engineering with bilingual content and performance work on an image-heavy marketing site, plus a separate dashboard product handling multi-vendor catalog and ordering workflows where correctness of stock and pricing matters more than visual flourish.",
  },
  delivered: [
    "Arkona's production website, live and maintained",
    "GumaMax multi-vendor tire-ordering dashboard",
    "Frontend ownership from first commit to production",
  ],
  media: {
    hero: { src: "/media/work/arkona/hero-desktop-1600.webp", alt: "arkonatechnology.com home page", kind: "desktop", width: 1600, height: 1000 },
    gallery: [
      { src: "/media/work/arkona/gallery-1-800.webp", alt: "arkonatechnology.com on a phone", kind: "mobile", width: 800, height: 1734, caption: "Mobile · services" },
    ],
  },
  cvLine: "Led end-to-end development of Arkona Technology's bilingual React website and built GumaMax, a multi-vendor tire-ordering dashboard.",
  featured: true,
};
