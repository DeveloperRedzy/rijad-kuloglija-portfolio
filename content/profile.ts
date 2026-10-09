import type { Profile } from "./schema";

export const profile: Profile = {
  name: "Rijad Kuloglija",
  title: "Lead Software Developer · Full-stack",
  headline: "Software that keeps working after launch.",
  lead:
    "Frontend architecture backed by real backend work. I take products from design to deployment and own them after. CTO at DIN Solution, Lead Software Developer at LibLynx.",
  about:
    "I've been building software professionally since 2021, from Sarajevo, for teams in Germany, Switzerland, the UK, Luxembourg and the US. My center of gravity is frontend architecture: React, Vue 3, TypeScript, Next.js, backed by real backend work in Laravel, Flask and Node. I lead the report-builder application on LibLynx, the identity and analytics platform used by PLOS, The Economist Group and Digital Science. I'm CTO at DIN Solution, an international FinTech consulting firm, and one of the four members of Neo Labs, where I engineered the customer-facing platforms of two AI voice products. Before that: internal banking products at ProCredit Bank, two years at Bloola on BMW and Deutsche Bundesbank projects, AI integrated into a Swiss legal-tech product, and a dApp shipped on Sui.",
  availability: "Open to product engagements from Q1 2027",
  location: "Sarajevo, Bosnia & Herzegovina",
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
    { school: "International Burch University, Sarajevo", degree: "B.Sc. Computer Science", years: "2017 – 2023" },
  ],
  languages: [
    { name: "Bosnian", level: "native" },
    { name: "English", level: "professional" },
    { name: "German", level: "upper intermediate" },
  ],
  companies: [
    "LibLynx", "Neo Labs", "DIN Solution", "ProCredit Bank", "BMW", "Deutsche Bundesbank",
    "Arkona Technology", "Superlex", "Nepa Invest", "Clearview", "Solution404",
  ],
  roles: [
    {
      company: "DIN Solution", title: "CTO & Head of Software Development",
      start: "2026-01", end: null, location: "London / Luxembourg / US", mode: "remote",
      summary: "Technology direction and the software development function of an international FinTech consulting firm, including delivery behind its IT-solutions service line.",
      url: "https://www.dinsolution.com/", current: true, showOnCv: true, projectSlug: "din-solution",
    },
    {
      company: "Neo Labs", title: "Head of Communications & Software Innovation",
      start: "2025-09", end: null, location: "EU", mode: "remote",
      summary: "One of the company's four members. Engineered the customer-facing platforms of its AI voice products, Neo Care and Neo Therapy, and own how the products are built and communicated.",
      stack: ["Next.js", "Tailwind CSS", "Vercel"], url: "https://www.neo-labs.ai/", current: true, showOnCv: true, projectSlug: "neo-labs",
    },
    {
      company: "LibLynx via Clearview", title: "Lead Software Developer", titleProgression: "Senior Frontend Developer → Lead Software Developer",
      start: "2025-07", end: null, location: "Remote", mode: "remote",
      summary: "Joined the LibLynx development team through Clearview as Senior Frontend Developer; promoted to Lead in October 2025. Lead development of the platform's report-builder application.",
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
      summary: "Built auth, verification, dashboard and file-upload features for an AI legal-advice product with ChatGPT integration.",
      stack: ["React", "OpenAI API"], current: false, showOnCv: true,
    },
    {
      company: "ACKE Creative Studio", title: "React Developer",
      start: "2023-05", end: "2023-07", location: "Ilijaš", mode: "contract",
      summary: "Delivered a personalized React dashboard MVP for music producers in three months, covering the full product lifecycle.",
      stack: ["React", "Material UI"], current: false, showOnCv: true,
    },
    {
      company: "Amodo", title: "Flutter Developer",
      start: "2022-09", end: "2022-10", location: "Zagreb", mode: "contract",
      summary: "Developed the Porsche Smart Driver App in an Agile team serving international Insurtech clients.",
      stack: ["Flutter"], current: false, showOnCv: false,
    },
    {
      company: "Bloola GmbH & Co. KG", title: "React Developer",
      start: "2021-09", end: "2023-11", location: "Gevelsberg, Germany", mode: "contract",
      summary: "Agile development on projects for BMW and Deutsche Bundesbank: contract management, a drag-and-drop app builder, and course-discovery tooling on React + SharePoint.",
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
      line: "A live decentralized app on the Sui blockchain: wallet connection, on-chain NFT minting and leveling, SUI coin management. Next.js, TypeScript, Zustand.",
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
      name: "ProCredit internal tools", year: "2024 – 2025",
      line: "HR dashboard, customer-referral system and ATM-feedback tooling for a bank. Vue, React, Flask, Laravel, MySQL. No UI shown.",
    },
    {
      name: "Bloola CM & Bloola Factory", year: "2022 – 2023",
      line: "Contract management as a Microsoft Teams app, and a no-code drag-and-drop builder for small web apps on Material UI + Java Spring.",
    },
    {
      name: "BMW My Learning Finder", year: "2023",
      line: "Course-discovery tooling for BMW's learning platform on React + SharePoint.",
    },
  ],
};
