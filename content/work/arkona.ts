import type { Project } from "../schema";

export const arkona: Project = {
  slug: "arkona",
  index: 4,
  name: "Arkona + GumaMax",
  categories: ["Software company", "Web platform", "Commerce dashboard"],
  oneLiner: "End-to-end ownership of a software company's own web presence, plus a multi-vendor tire-ordering dashboard.",
  role: "Senior Frontend Developer",
  roleNote: "part-time",
  period: "Oct 2024 — Mar 2025",
  stack: ["React", "Responsive UI", "Performance", "i18n (EN/SR)", "Dashboard workflows"],
  live: { label: "arkonatechnology.com", url: "https://www.arkonatechnology.com/" },
  body: {
    overview:
      "Arkona Technology is a Belgrade software company building web, mobile and e-commerce products on a stack that runs from Symfony and Node.js to React and Next.js. A software company's own website is a portfolio piece by definition: engineers judge it.",
    problem:
      "Full frontend ownership, with the client's own developers as the audience: one engineer responsible for the architecture, responsive behavior, performance and production delivery of a bilingual (English/Serbian) single-page React site with a dark visual identity. Alongside it came a commercial product with real operational complexity: tire ordering across multiple vendors.",
    contribution:
      "I led development of the website end to end, from architecture to deployment. I also developed GumaMax, a web-based tire-ordering dashboard for selling and managing products across multiple vendors: catalog, vendor management and ordering workflows.",
    engineering:
      "The website is responsive React engineering with bilingual content and performance work on an image-heavy marketing site. GumaMax is a separate product: multi-vendor catalog and ordering workflows where correct stock and pricing matter more than visual flourish.",
  },
  delivered: [
    "Arkona's production website, live and maintained",
    "GumaMax multi-vendor tire-ordering dashboard",
    "Frontend ownership from first commit to production",
  ],
  media: {
    hero: { src: "/media/work/arkona/hero-desktop-1600.webp", alt: "arkonatechnology.com home page", kind: "desktop", width: 1600, height: 1000 },
    gallery: [
      { src: "/media/work/arkona/gallery-1-800.webp", alt: "arkonatechnology.com on a phone", kind: "mobile", width: 800, height: 1734, caption: "arkonatechnology.com · mobile" },
    ],
  },
  cvLine: "Led end-to-end development of Arkona Technology's bilingual React website and built GumaMax, a multi-vendor tire-ordering dashboard.",
  featured: true,
};
