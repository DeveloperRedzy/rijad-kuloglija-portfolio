import type { Project } from "../schema";

export const nepaInvest: Project = {
  slug: "nepa-invest",
  index: 5,
  name: "Nepa Invest",
  categories: ["Real estate", "Digital product"],
  oneLiner: "A commercial digital presence for a real-estate developer: galleries, video tours and lead capture.",
  role: "Web Engineering",
  period: "2025",
  stack: ["Next.js", "Project galleries", "Video tours", "Lead generation", "Responsive UI"],
  live: { label: "nepainvest.com", url: "https://www.nepainvest.com/" },
  body: {
    overview:
      "Nepa Invest is a real-estate investment and development company that acquires, develops and sells residential and commercial property. Its site presents active developments, Villa Park Obarak, Projekat Pobjeda and Bulevar Goražde, combining investment positioning with architecture imagery.",
    problem:
      "Outside SaaS the job changes: the site sells trust in physical assets. Image-heavy galleries have to stay fast on mobile connections, video tours have to play without stalling, and the composition has to feel like the buildings it presents: polished and solid.",
    contribution:
      "I engineered Nepa Invest's web presence: per-project presentations with substantial render galleries, video tours for selected projects, an investment-approach narrative, and consultation and lead-generation flows for buyers and partners.",
    engineering:
      "An image-forward site where performance work concentrates on media: galleries of up to eleven renders per project and embedded video tours, delivered responsively with modern formats, lazy loading and posters, so the first view of each development lands fast.",
  },
  delivered: [
    "Live commercial web presence for an active property developer",
    "Project galleries and video-tour presentation for three developments",
    "Lead-generation and consultation flows",
  ],
  media: {
    hero: { src: "/media/work/nepa-invest/hero-desktop-1600.webp", alt: "nepainvest.com home page with the Villa Park Obarak render", kind: "desktop", width: 1600, height: 1000 },
    gallery: [
      { src: "/media/work/nepa-invest/render-villa-park-obarak-1600.webp", alt: "Villa Park Obarak render", kind: "desktop", width: 1600, height: 1000, caption: "Villa Park Obarak" },
      { src: "/media/work/nepa-invest/render-bulevar-gorazde-1600.webp", alt: "Bulevar Goražde render", kind: "desktop", width: 1600, height: 1000, caption: "Bulevar Goražde" },
      { src: "/media/work/nepa-invest/tour-pobjeda-1280.mp4", alt: "Projekat Pobjeda video tour", kind: "video", width: 1280, height: 720, caption: "Projekat Pobjeda · tour", poster: "/media/work/nepa-invest/tour-pobjeda-poster-1280.webp" },
    ],
  },
  cvLine: "Engineered the web presence of a real-estate developer: render galleries, video tours and lead-generation flows for three developments.",
  featured: true,
};
