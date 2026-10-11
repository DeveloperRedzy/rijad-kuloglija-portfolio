import type { Profile } from "./schema";

export const profile: Profile = {
  name: "Rijad Kuloglija",
  brand: "Redzy",
  title: "Lead Software Developer · Full-stack",
  jobTitle: "Lead Software Developer",
  secondTitle: "CTO",
  headline: "I build products and stand behind them.",
  lead:
    "Lead Software Developer at LibLynx and CTO at DIN Solution. Since 2021 I've built products for teams in Germany, Switzerland, the UK, Luxembourg and the US: identity and analytics, internal banking tools, AI voice platforms.",
  aboutHeading: "Hands-on engineering, with the lead role around it.",
  about:
    "I've built software professionally since 2021, from Sarajevo, for teams in Germany, Switzerland, the UK, Luxembourg and the US. I lead development of the report-builder application at LibLynx, an identity and analytics platform whose customers include PLOS, The Economist Group and Digital Science. I'm CTO at DIN Solution, an international FinTech consulting firm, where I set technology direction and run software delivery. At Neo Labs, a four-person AI company, I engineered the customer-facing platforms of two AI voice products. My core is frontend architecture in React, Vue 3, TypeScript and Next.js, with backend work in Laravel, Flask and Node. Before that: internal tools for ProCredit Bank, two years with Bloola on projects for German enterprise clients, and an OpenAI integration for a Swiss legal-tech product.",
  availability: null,
  contactNote:
    "Write about the product you need built or led: what it does, where it stands today, who is already on the team and your timeline. I work alone by default and bring in other engineers when the scope calls for it. I read and answer every message myself.",
  location: "Sarajevo, Bosnia and Herzegovina",
  city: "Sarajevo",
  countryCode: "BA",
  since: 2021,
  email: "rkuloglija@gmail.com",
  domain: "rijadkuloglija.com",
  links: {
    github: "https://github.com/DeveloperRedzy",
    linkedin: "https://linkedin.com/in/rijad-kuloglija",
  },
  strengths: [
    "Frontend architecture",
    "Product delivery and technical leadership",
    "Design-to-deployment ownership",
    "Enterprise and internal banking tools",
    "Products built around AI services",
    "Performance & UI engineering",
  ],
  stack: [
    { group: "Frontend", items: ["React / Next.js", "Vue 3", "TypeScript", "Material UI", "Tailwind CSS", "TanStack Query", "Storybook"] },
    { group: "Backend", items: ["PHP (Laravel)", "Python (Flask)", "Node.js / Express", "GraphQL", "REST APIs"] },
    { group: "Data", items: ["MySQL", "PostgreSQL", "MongoDB", "SQLite"] },
    { group: "Infrastructure", items: ["Docker", "CI/CD", "Vercel", "Git"] },
  ],
  education: [
    { school: "International Burch University, Sarajevo", short: "International Burch University", degree: "B.Sc. Computer Science", years: "2017 — 2023" },
  ],
  languages: [
    { name: "Bosnian", code: "BS", level: "native" },
    { name: "English", code: "EN", level: "professional" },
    { name: "German", code: "DE", level: "upper intermediate" },
  ],
  // LibLynx is a placement through Clearview, so Clearview is the employer.
  worksFor: [
    { name: "Clearview" },
    { name: "DIN Solution", url: "https://www.dinsolution.com/" },
  ],
  companies: [
    "LibLynx", "Clearview", "Neo Labs", "DIN Solution", "ProCredit Bank", "Bloola",
    "Arkona Technology", "Superlex", "Amodo", "Nepa Invest", "Solution404",
  ],
  roles: [
    {
      company: "DIN Solution", title: "CTO & Head of Software Development",
      start: "2026-01", end: null, location: "London / Luxembourg / US", mode: "remote",
      summary: "Set the technology direction and lead the software development function of an international FinTech consulting firm, including delivery behind its IT-solutions service line.",
      url: "https://www.dinsolution.com/", current: true, showOnCv: true,
    },
    {
      company: "Neo Labs", title: "Head of Communications & Software Innovation",
      start: "2025-09", end: null, location: "EU", mode: "remote",
      summary: "One of four people at the company. Engineered the customer-facing platforms of its two AI voice products, Neo Care and Neo Therapy, and lead product communication.",
      stack: ["Next.js", "Tailwind CSS", "Vercel"], url: "https://www.neo-labs.ai/", current: true, showOnCv: true, projectSlug: "neo-labs",
    },
    {
      company: "LibLynx via Clearview", title: "Lead Software Developer", titleProgression: "Senior Frontend Developer → Lead Software Developer",
      start: "2025-07", end: null, location: "Sarajevo", mode: "remote",
      summary: "Sole engineer and designer of LibLynx's report-builder application, placed through Clearview. Joined in July 2025 as Senior Frontend Developer; promoted to Lead three months later.",
      stack: ["React 19", "TypeScript", "Vite", "Material UI", "TanStack Query", "Storybook"], url: "https://www.liblynx.com/", current: true, showOnCv: true, projectSlug: "liblynx",
    },
    {
      company: "Arkona Technology", title: "Senior Frontend Developer",
      start: "2024-10", end: "2025-03", location: "Belgrade", mode: "part-time",
      summary: "Built Arkona's website end to end, as the sole frontend engineer, and the GumaMax multi-vendor tire-ordering dashboard.",
      stack: ["React", "i18n"], url: "https://www.arkonatechnology.com/", current: false, showOnCv: true, projectSlug: "arkona",
    },
    {
      company: "ProCredit Bank", title: "Full-stack Developer",
      start: "2024-03", end: "2025-10", location: "Sarajevo", mode: "on-site",
      summary: "Built internal tools for the bank from design to deployment: an HR dashboard, a customer-referral system and ATM-feedback tooling.",
      stack: ["Vue", "React", "Flask", "Laravel", "MySQL"], current: false, showOnCv: true,
    },
    {
      company: "Superlex", title: "React + AI Engineer",
      start: "2024-02", end: "2024-05", location: "Switzerland", mode: "contract",
      summary: "Developed authentication, verification, dashboard and file-upload features for an AI legal-advice product built on the OpenAI API.",
      stack: ["React", "OpenAI API"], current: false, showOnCv: true,
    },
    {
      company: "ACKE Creative Studio", title: "React Developer",
      start: "2023-05", end: "2023-07", location: "Ilijaš", mode: "contract",
      summary: "Delivered a personalized React dashboard MVP for music producers in three months, from concept to release.",
      stack: ["React", "Material UI"], current: false, showOnCv: true,
    },
    {
      company: "Amodo", title: "Flutter Developer",
      start: "2022-09", end: "2022-10", location: "Zagreb", mode: "contract",
      summary: "Flutter work on the Porsche Smart Driver App, in a team building for international insurtech clients.",
      stack: ["Flutter"], current: false, showOnCv: false,
    },
    {
      company: "Bloola GmbH & Co. KG", title: "React Developer",
      start: "2021-09", end: "2023-11", location: "Gevelsberg, Germany", mode: "contract",
      summary: "Projects for BMW and Deutsche Bundesbank: contract management, a drag-and-drop app builder and course-discovery tooling on React and SharePoint.",
      stack: ["React", "Material UI", "SharePoint"], current: false, showOnCv: true,
    },
    {
      company: "Solution404", title: "Software Developer",
      start: "2021-01", end: "2021-09", location: "Sarajevo", mode: "on-site",
      summary: "Full-stack work (React, Node.js) on MyLawyer; led the Mine Tracking app from conception to deployment.",
      stack: ["React", "Node.js"], url: "https://solution404.io/", current: false, showOnCv: true,
    },
  ],
  lab: [
    {
      name: "Sui NFT dApp", year: "2024",
      line: "Running on Sui: wallet connection, on-chain NFT minting and leveling, SUI coin management. A personal project. Next.js, TypeScript, Zustand.",
      links: [{ label: "Live", url: "https://dapp-test-hazel.vercel.app/" }],
      showOnCv: true,
    },
    {
      name: "ProCredit internal tools", year: "2024 — 2025",
      line: "HR dashboard, customer-referral system and ATM-feedback tooling. Vue, React, Flask, Laravel, MySQL. Internal systems, not shown publicly.",
      showOnCv: false,
    },
    {
      name: "Bloola CM & Bloola Factory", year: "2022 — 2023",
      line: "Contract management as a Microsoft Teams app, and a no-code drag-and-drop builder for small web apps on Material UI and Java Spring.",
      showOnCv: true,
    },
    {
      name: "Learning Finder (at Bloola)", year: "2023",
      line: "Course-discovery tooling for a client's learning platform, on React and SharePoint.",
      showOnCv: false,
    },
  ],
};
