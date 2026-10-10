import type { Project } from "../schema";

export const dinSolution: Project = {
  slug: "din-solution",
  index: 2,
  name: "DIN Solution",
  categories: ["FinTech", "Consulting", "Technology leadership"],
  oneLiner: "Owning the technology function of an international FinTech consulting firm.",
  role: "CTO & Head of Software Development",
  period: "2026 — present",
  // stack: verified from the live site (Next.js `_next/static` assets, `server: Vercel`)
  stack: ["Next.js", "Vercel"],
  focus: ["Technology leadership", "IT solutions", "FinTech consulting"],
  live: { label: "dinsolution.com", url: "https://www.dinsolution.com/" },
  body: {
    overview:
      "DIN Solution is an international consulting firm with offices in London, Sheridan (Wyoming) and Luxembourg, serving clients across the US and Europe. Its service lines cover bookkeeping and accounting to US GAAP, IFRS and LUX GAAP, business and financial consulting, FinTech advisory, marketing, and IT and engineering solutions.",
    problem:
      "A consulting firm that sells precision has to run its own technology precisely. The role points two ways: the technology behind the firm itself, and the software capability it sells to clients through its IT and FinTech service lines. Four specialized teams share one four-stage process (Discover, Plan, Execute, Optimize), and engineering has to speak the language of finance.",
    contribution:
      "I set the firm's technology direction and lead its software development function: delivery behind the IT-solutions service line, build decisions across client engagements, and the firm's own digital presence.",
    engineering:
      "This is the leadership counterpart to the hands-on work elsewhere on this site: setting technical direction, choosing stacks per engagement, reviewing architecture and owning outcomes rather than tickets. The web platform is the visible part. The rest is getting four teams in three time zones to ship on one process.",
  },
  delivered: [
    "Technology leadership across an international, multi-office consulting firm",
    "The software development function behind DIN's IT and FinTech service lines",
    "The firm's public web presence",
  ],
  media: {
    hero: { src: "/media/work/din-solution/hero-desktop-1600.webp", alt: "dinsolution.com home page", kind: "desktop", width: 1600, height: 1000 },
    gallery: [
      { src: "/media/work/din-solution/gallery-1-800.webp", alt: "dinsolution.com on a phone", kind: "mobile", width: 800, height: 1734, caption: "dinsolution.com · mobile" },
    ],
  },
  cvLine: "Technology direction and the software development function of an international FinTech consulting firm (London, Luxembourg, US), including delivery behind its IT-solutions service line and the firm's web platform.",
  featured: true,
};
