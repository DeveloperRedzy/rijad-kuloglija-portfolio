import type { Project } from "../schema";

export const neoLabs: Project = {
  slug: "neo-labs",
  index: 2,
  name: "Neo Labs",
  categories: ["AI voice", "Care technology", "Mental wellness"],
  oneLiner: "Engineering the customer-facing platforms of two AI voice products for care and mental wellness.",
  role: "Head of Communications & Software Innovation",
  roleNote: "One of four people at the company · engineered both customer-facing platforms",
  period: "Sep 2025 — present",
  stack: ["Next.js", "Tailwind CSS", "Supabase", "Vercel"],
  focus: ["AI voice calls", "Scheduling & reports", "Escalation workflows"],
  live: { label: "neo-labs.ai", url: "https://www.neo-labs.ai/" },
  body: {
    overview:
      "Neo Labs is an EU-based AI company (Ljubljana, founded 2025) building AI voices and assistants for communication across industries, starting with care and mental wellness. Its live products are Neo Care, daily AI check-in calls for seniors, and Neo Therapy, structured AI support calls between therapy sessions. Both share one product model (scheduled calls, structured check-ins, personal or family reporting) under two distinct brands with their own design systems.",
    problem:
      "Voice AI in care and mental wellness is a trust problem before it is a technology problem. In Neo Care the buyer and the user are different people: an adult child configures and pays on the web, and the parent just answers the phone. The products serve vulnerable users in the EU, which means GDPR by default, honest positioning about what an AI service is and isn't, and escalation paths that cannot silently fail.",
    contribution:
      "I'm responsible for the engineering of both web platforms and for how the company communicates its products. For Neo Care that means sign-up, call scheduling, per-person check-in configuration, multiple emergency contacts and report delivery; for Neo Therapy, onboarding, therapeutic-goal configuration, scheduling and progress tracking.",
    engineering:
      "Both platforms are Next.js and Tailwind CSS applications on Vercel: one product model shipped twice, each brand with its own visual identity, configuration flows and reporting surfaces. My work sits in the workflows around the calls: schedules, customization, escalation, reporting, and the web side of Neo Therapy's crisis-prevention layer, the most sensitive workflow in the product.",
  },
  delivered: [
    "Two live subscription products shipped on a shared product model",
    "Customer-facing platforms for onboarding, scheduling and reporting",
    "Product communication for the company, alongside the engineering",
  ],
  decisions: [
    { choice: "One product model, shipped as two brands", why: "Neo Care and Neo Therapy share scheduling, check-ins and reporting, so each brand differs only where its users differ: identity, configuration flows and reports." },
    { choice: "Escalation treated as a core workflow", why: "The products serve vulnerable users, and an escalation path must never fail silently." },
    { choice: "Next.js and Tailwind CSS on Vercel for both platforms", why: "A four-person company runs both products on one toolchain and one deployment path." },
  ],
  sinceLaunch:
    "Neo Care and Neo Therapy are both live on these platforms. I still develop both and handle how the company presents them.",
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
  cvLine: "One of four people at an EU AI-voice company; engineered the customer-facing Next.js platforms of Neo Care (daily AI calls for seniors) and Neo Therapy (structured support between therapy sessions).",
  featured: true,
};
