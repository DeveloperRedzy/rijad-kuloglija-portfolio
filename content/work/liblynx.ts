import type { Project } from "../schema";

export const liblynx: Project = {
  slug: "liblynx",
  index: 1,
  name: "LibLynx report builder",
  categories: ["Enterprise SaaS", "Identity & access", "Analytics"],
  oneLiner: "Leading development of self-serve usage reporting inside an identity and access platform used by major publishers.",
  role: "Lead Software Developer",
  roleNote: "Through Clearview · sole engineer and designer · Lead since Oct 2025",
  period: "Jul 2025 — present",
  stack: ["React 19", "TypeScript", "Vite", "Material UI", "TanStack Query", "Zod", "dnd-kit", "Storybook", "Playwright"],
  live: { label: "liblynx.com", url: "https://www.liblynx.com/" },
  body: {
    overview:
      "LibLynx provides cloud-based identity and access management for publishers, libraries and knowledge organizations: the infrastructure that decides who can reach an online resource, how they authenticate and what usage gets reported afterward. Its customers include PLOS, The Economist Group, Digital Science, Emerald Publishing and Annual Reviews. This is production infrastructure with live institutional traffic.",
    problem:
      "Access management in scholarly publishing is a compatibility problem at scale: many authentication methods and platform technologies, audited reporting standards, and customers ranging from single libraries to purchasing consortia. The report builder addresses one part of it. Usage data is only useful if customers can compose the reports they need, across event types, date ranges and COUNTER metrics, without asking support or waiting on engineering.",
    contribution:
      "I'm the sole engineer and designer of the report-builder application, placed at LibLynx through Clearview: I design its interface and write its code. Customers compose usage reports from drag-and-drop “filter bricks”: each brick becomes a table column with its own filters, sorting and pagination run server-side, and exports run asynchronously. Around it I built saved reports with inline rename, organization-wide sharing and persistent drag-to-reorder; backend-driven template reports that build in one click; two-period comparison reports with change indicators; and an unsaved-changes guard that protects work in progress across navigation.",
    engineering:
      "The stack is React 19, TypeScript, Vite and Material UI, with TanStack Query for server state and dnd-kit for accessible drag-and-drop. API responses are validated with Zod, so a malformed response fails loudly instead of producing a wrong report. About thirty components are developed and documented in Storybook. The app ships in a same-origin iframe inside LibLynx's admin platform, with a postMessage bridge for content height and session expiry, a constraint that shapes dialog positioning, focus handling and scrolling. Exports follow a request, poll and download flow, and template configuration lives in the backend, so new report templates ship without a frontend release.",
  },
  delivered: [
    "The report-builder application, live inside LibLynx's analytics product",
    "Drag-and-drop report composition with server-side sorting, filtering and pagination",
    "Saved, shared, template and comparison reporting workflows",
    "A Storybook-documented component system and an iframe integration bridge into the host platform",
  ],
  decisions: [
    { choice: "Sorting, filtering and pagination run on the server", why: "Usage tables grow with every event type and date range; the browser only holds the page a customer is reading." },
    { choice: "Zod validation on every API response", why: "A malformed response stops at the API boundary and never reaches a report." },
    { choice: "Report templates configured in the backend", why: "New templates reach customers without a frontend release." },
    { choice: "Exports as request, poll and download", why: "Large exports are prepared in the background while the customer keeps working in the builder." },
  ],
  sinceLaunch:
    "Live inside LibLynx's analytics product since 2025. I'm still its only engineer and keep extending it as the platform grows.",
  figure: "report-flow",
  media: {
    hero: {
      src: "/media/work/liblynx/hero-desktop-1600.webp",
      alt: "liblynx.com home page: the LibLynx logo, hero imagery and the customer logos (desktop or phone capture)",
      kind: "desktop", width: 1600, height: 1000,
      caption: "liblynx.com (product marketing site; the report builder sits behind customer login)",
    },
    gallery: [
      { src: "/media/work/liblynx/gallery-2-800.webp", alt: "liblynx.com home page on a phone, scrolled to its customer logos", kind: "mobile", width: 800, height: 1734, caption: "liblynx.com · mobile" },
    ],
  },
  cvLine: "Sole engineer and designer of the report-builder application in LibLynx's analytics platform: drag-and-drop COUNTER reporting, saved, shared, template and comparison reports, and a Storybook component system. React 19, TypeScript, Material UI, TanStack Query.",
  featured: true,
};
