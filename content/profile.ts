import type { Profile } from "./schema";

export const profile: Profile = {
  name: "Rijad Kuloglija",
  brand: "Redzy",
  title: "Lead Software Developer · Full-stack",
  jobTitle: "Lead Software Developer",
  headline: "Software that keeps working after launch.",
  lead:
    "Frontend architecture backed by real backend work. I take products from design to deployment and own them after. CTO at DIN Solution, Lead Software Developer at LibLynx.",
  about:
    "I've built software professionally since 2021, from Sarajevo, for teams in Germany, Switzerland, the UK, Luxembourg and the US. My focus is frontend architecture in React, Vue 3, TypeScript and Next.js, with backend work in Laravel, Flask and Node. I lead the report-builder application at LibLynx, the identity and analytics platform used by PLOS, The Economist Group and Digital Science. I'm also CTO at DIN Solution, an international FinTech consulting firm, and one of four members of Neo Labs, where I engineered the customer-facing platforms of two AI voice products. Earlier work includes internal banking products at ProCredit Bank, two years at Bloola on BMW and Deutsche Bundesbank projects, an AI integration for a Swiss legal-tech product and a dApp shipped on Sui.",
  availability: "Open to product engagements from Q1 2027",
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
    "React / Vue ecosystems",
    "Design-to-deployment ownership",
    "Enterprise & banking software",
    "AI integrations",
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
  companies: [
    "LibLynx", "Neo Labs", "DIN Solution", "ProCredit Bank", "BMW", "Deutsche Bundesbank",
    "Arkona Technology", "Superlex", "Nepa Invest", "Clearview", "Solution404",
  ],
  roles: [
    {
      company: "DIN Solution", title: "CTO & Head of Software Development",
      start: "2026-01", end: null, location: "London / Luxembourg / US", mode: "remote",
      summary: "Set the technology direction and lead the software development function of an international FinTech consulting firm, including delivery behind its IT-solutions service line.",
      url: "https://www.dinsolution.com/", current: true, showOnCv: true, projectSlug: "din-solution",
    },
    {
      company: "Neo Labs", title: "Head of Communications & Software Innovation",
      start: "2025-09", end: null, location: "EU", mode: "remote",
      summary: "One of the company's four members. Engineered the customer-facing platforms of its AI voice products, Neo Care and Neo Therapy, and own how they are built and communicated.",
      stack: ["Next.js", "Tailwind CSS", "Vercel"], url: "https://www.neo-labs.ai/", current: true, showOnCv: true, projectSlug: "neo-labs",
    },
    {
      company: "LibLynx via Clearview", title: "Lead Software Developer", titleProgression: "Senior Frontend Developer → Lead Software Developer",
      start: "2025-07", end: null, location: "Sarajevo", mode: "remote",
      summary: "Lead development of the platform's report-builder application. Joined through Clearview as Senior Frontend Developer in July 2025; promoted to Lead that October.",
      stack: ["React 19", "TypeScript", "Vite", "Material UI", "TanStack Query", "Storybook"], url: "https://www.liblynx.com/", current: true, showOnCv: true, projectSlug: "liblynx",
    },
    {
      company: "Arkona Technology", title: "Senior Frontend Developer",
      start: "2024-10", end: "2025-03", location: "Belgrade", mode: "part-time",
      summary: "Led end-to-end development of Arkona's website; built the GumaMax multi-vendor tire-ordering dashboard.",
      stack: ["React", "i18n"], url: "https://www.arkonatechnology.com/", current: false, showOnCv: true, projectSlug: "arkona",
    },
    {
      company: "ProCredit Bank", title: "Full-Stack Developer",
      start: "2024-03", end: "2025-10", location: "Sarajevo", mode: "on-site",
      summary: "Design-to-deployment ownership of internal banking products: HR dashboard, customer-referral system, ATM-feedback tooling.",
      stack: ["Vue", "React", "Flask", "Laravel", "MySQL"], current: false, showOnCv: true,
    },
    {
      company: "Superlex", title: "React + AI Engineer",
      start: "2024-02", end: "2024-05", location: "Switzerland", mode: "contract",
      summary: "Built authentication, verification, dashboard and file-upload features for an AI legal-advice product integrating ChatGPT.",
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
      summary: "Developed the Porsche Smart Driver App in an agile team serving international insurtech clients.",
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
      summary: "Full-stack React work on MyLawyer; led the Mine Tracking app from conception to deployment.",
      stack: ["React", "Node.js"], url: "https://solution404.io/", current: false, showOnCv: true,
    },
  ],
  lab: [
    {
      name: "Sui NFT DApp", year: "2024",
      line: "Live on the Sui blockchain: wallet connection, on-chain NFT minting and leveling, SUI coin management. Next.js, TypeScript, Zustand.",
      links: [
        { label: "Live", url: "https://dapp-test-hazel.vercel.app/" },
        { label: "GitHub", url: "https://github.com/DeveloperRedzy" },
      ],
    },
    {
      name: "GumaMax", year: "2025",
      line: "Multi-vendor tire-ordering dashboard for Arkona Technology: catalog, vendor management and ordering workflows.",
      previewSlug: "arkona",
    },
    {
      name: "ProCredit internal tools", year: "2024 — 2025",
      line: "HR dashboard, customer-referral system and ATM-feedback tooling. Vue, React, Flask, Laravel, MySQL. Internal, so no UI shown.",
    },
    {
      name: "Bloola CM & Bloola Factory", year: "2022 — 2023",
      line: "Contract management as a Microsoft Teams app, and a no-code drag-and-drop builder for small web apps on Material UI and Java Spring.",
    },
    {
      name: "BMW My Learning Finder", year: "2023",
      line: "Course-discovery tooling for BMW's learning platform on React and SharePoint.",
    },
  ],
};
