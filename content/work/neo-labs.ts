import type { Project } from "../schema";

export const neoLabs: Project = {
  slug: "neo-labs",
  index: 3,
  name: "Neo Labs",
  categories: ["AI voice", "Care technology", "Mental wellness"],
  oneLiner: "AI voice products people talk to every day: Neo Care and Neo Therapy on one product model.",
  role: "Head of Communications & Software Innovation",
  roleNote: "one of four members · engineered both customer-facing platforms",
  period: "2025 — present",
  stack: ["Next.js", "Tailwind CSS", "Vercel", "AI voice calls", "Scheduling & reports", "Escalation workflows"],
  live: { label: "neo-labs.ai", url: "https://www.neo-labs.ai/" },
  body: {
    overview:
      "Neo Labs is an EU-based AI company (Ljubljana, founded 2025) building intelligent AI voices and assistants for communication across industries, starting with care and mental wellness. Its shipped products are Neo Care, a daily AI check-in call service for seniors, and Neo Therapy, structured AI support calls between therapy sessions. Both run on the same product model, scheduled calls, structured check-ins, personal or family reporting, expressed through two distinct brands with their own design systems.",
    problem:
      "Voice AI in care and mental wellness is a trust problem before it is a technology problem. The buyer and the user are different people: an adult child configures and pays on the web, the parent just answers the phone. The products serve vulnerable users in the EU, which means GDPR by default, honest positioning about what an AI service is and isn't, and escalation paths that cannot silently fail.",
    contribution:
      "I am one of Neo Labs' four members, responsible for how the products are engineered and how they speak to the people who depend on them. On the software side I engineered the customer-facing web platforms of both live products: sign-up, call scheduling, per-person check-in configuration, multiple emergency contacts, and report delivery for Neo Care; onboarding, therapeutic-goal configuration, scheduling and progress tracking for Neo Therapy.",
    engineering:
      "Both platforms are Next.js and Tailwind CSS applications on Vercel: one shared product model shipped twice, with each brand keeping its own visual identity, configuration flows and reporting surfaces. The engineering weight is in the workflow surface around the calls, not the calls themselves: schedules, customization, escalation, reporting, and the crisis-prevention layer in Neo Therapy, the most sensitive workflow in the product.",
  },
  delivered: [
    "Two live subscription products shipped on a shared product model",
    "Customer-facing platforms for onboarding, scheduling and reporting",
    "A company-level product and communications remit in a four-person team",
  ],
  media: {
    hero: [
      { src: "/media/work/neo-labs/hero-labs-1600.webp", alt: "neo-labs.ai home page", kind: "desktop", width: 1600, height: 1000, caption: "Neo Labs" },
      { src: "/media/work/neo-labs/hero-care-1600.webp", alt: "neo-care.ai home page", kind: "desktop", width: 1600, height: 1000, caption: "Neo Care" },
      { src: "/media/work/neo-labs/hero-therapy-1600.webp", alt: "neo-therapy.ai home page", kind: "desktop", width: 1600, height: 1000, caption: "Neo Therapy" },
    ],
    gallery: [
      { src: "/media/work/neo-labs/gallery-1-800.webp", alt: "Neo Care on a phone", kind: "mobile", width: 800, height: 1734, caption: "Neo Care · mobile" },
      { src: "/media/work/neo-labs/gallery-2-800.webp", alt: "Neo Therapy on a phone", kind: "mobile", width: 800, height: 1734, caption: "Neo Therapy · mobile" },
    ],
  },
  cvLine: "One of four members of an EU AI-voice company; engineered the customer-facing Next.js platforms of Neo Care (daily AI calls for seniors) and Neo Therapy (structured support between therapy sessions).",
  featured: true,
};
