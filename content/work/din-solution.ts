import type { Project } from "../schema";

export const dinSolution: Project = {
  slug: "din-solution",
  index: 2,
  name: "DIN Solution",
  categories: ["FinTech", "Consulting", "Technology leadership"],
  oneLiner: "Owning the technology function of an international FinTech consulting firm.",
  role: "CTO & Head of Software Development",
  period: "2026 — present",
  stack: ["Technology leadership", "IT solutions", "FinTech consulting", "Web platform"],
  live: { label: "dinsolution.com", url: "https://www.dinsolution.com/" },
  body: {
    overview:
      "DIN FinTech Solutions is an international consulting firm with offices in London, Sheridan (Wyoming) and Luxembourg, serving clients across the US and Europe. Its service lines span bookkeeping and accounting to US GAAP, IFRS and LUX GAAP standards, business and financial consulting, FinTech advisory, marketing, and IT and engineering solutions. The firm positions itself as an integrated strategy unit working as a long-term partner rather than a temporary provider.",
    problem:
      "A consulting firm whose pitch is precision has to run its own technology precisely. The role spans two directions at once: the technology behind the firm itself, and the software development capability it sells to clients through its IT and FinTech service lines. Four specialized teams run a shared four-stage process, Discover, Plan, Execute, Optimize, and the engineering side has to speak the language of the finance side.",
    contribution:
      "As CTO & Head of Software Development I am responsible for the firm's technology direction and for leading its software development function: the delivery behind the IT-solutions service line, build decisions across client engagements, and the firm's own digital presence.",
    engineering:
      "This is the leadership complement to the hands-on work elsewhere on this site: setting technical direction, choosing stacks per engagement, reviewing architecture, and owning outcomes rather than tickets. The firm's web platform is the visible part; the invisible part is making four teams in three time zones ship on one process.",
  },
  delivered: [
    "Technology leadership across an international, multi-office consulting firm",
    "The software development function behind DIN's IT and FinTech service lines",
    "The firm's public web presence",
  ],
  media: {
    hero: { src: "/media/work/din-solution/hero-desktop-1600.webp", alt: "dinsolution.com home page", kind: "desktop", width: 1600, height: 1000 },
    gallery: [
      { src: "/media/work/din-solution/gallery-1-800.webp", alt: "dinsolution.com on a phone", kind: "mobile", width: 800, height: 1734, caption: "Mobile · services" },
    ],
  },
  cvLine: "CTO & Head of Software Development of an international FinTech consulting firm (London, Luxembourg, US): technology direction, delivery behind the IT-solutions service line, the firm's web platform.",
  featured: true,
};
