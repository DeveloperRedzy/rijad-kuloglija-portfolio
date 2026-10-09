// TODO(owner): replace hero/gallery with report-builder app screenshots from assets/source/app-screenshots/liblynx/ before launch (spec §7.2).
import type { Project } from "../schema";

export const liblynx: Project = {
  slug: "liblynx",
  index: 1,
  name: "LibLynx report builder",
  categories: ["Enterprise SaaS", "Identity & access", "Analytics"],
  oneLiner: "Leading a new analytics product inside enterprise infrastructure used by PLOS, The Economist Group and Digital Science.",
  role: "Lead Software Developer",
  roleNote: "via Clearview · Senior Frontend Developer → Lead, Oct 2025",
  period: "Jul 2025 — present",
  stack: ["React 19", "TypeScript", "Vite", "Material UI", "TanStack Query", "Zod", "dnd-kit", "Storybook"],
  live: { label: "liblynx.com", url: "https://www.liblynx.com/" },
  body: {
    overview:
      "LibLynx provides cloud-based identity and access management for publishers, libraries and knowledge organizations: the infrastructure that decides who can reach an online resource, how they authenticate, and what usage gets reported afterwards. Its customers include PLOS, The Economist Group, Digital Science, Emerald Publishing and Annual Reviews. This is production infrastructure with live institutional traffic, not a marketing site.",
    problem:
      "Access management in scholarly publishing is a compatibility problem at scale: many authentication methods, many platform technologies, audited reporting standards, and customers ranging from single libraries to purchasing consortia. On the analytics side, the problem my team owns is simpler to state and harder to ship: usage data is only valuable if customers can compose the reports they need, across event types, date ranges and COUNTER metrics, without asking support or waiting on engineering.",
    contribution:
      "I lead development of the report-builder application. I joined the LibLynx team through Clearview as a Senior Frontend Developer in July 2025 and was promoted to Lead Software Developer that October. Customers compose usage reports with a drag-and-drop 'filter brick' system: drop bricks to build table columns, configure per-column filters, sort and paginate server-side, and export asynchronously. Around it I built saved reports with inline rename, organization-wide sharing and drag-to-reorder persistence; backend-driven template reports that load and build in one click; two-period comparison reports with change indicators; and an unsaved-changes guard that protects work in progress across navigation.",
    engineering:
      "The stack is React 19, TypeScript, Vite and Material UI, with TanStack Query for server state, Zod validation on API responses, and dnd-kit for accessible drag-and-drop. The component system, about thirty components, is documented and developed in Storybook. The application ships embedded in a same-origin iframe inside LibLynx's existing admin platform, coordinated through a postMessage bridge for content height and session expiry, a real constraint that shapes dialog positioning, focus handling and scroll behavior. Report export runs as an async request → poll → download flow; template configuration lives in the backend so reports never go stale in the frontend.",
  },
  delivered: [
    "The report-builder application, live inside LibLynx's analytics product",
    "Drag-and-drop report composition with server-side sorting, filtering and pagination",
    "Saved, shared, template and comparison reporting workflows",
    "A Storybook-documented component system and an iframe integration bridge into the host platform",
  ],
  media: {
    hero: { src: "/media/work/liblynx/hero-desktop-1600.webp", alt: "liblynx.com home page (report-builder screenshots pending)", kind: "desktop", width: 1600, height: 1000 },
    gallery: [
      { src: "/media/work/liblynx/gallery-2-800.webp", alt: "liblynx.com on a phone", kind: "mobile", width: 800, height: 1734, caption: "liblynx.com · mobile" },
    ],
  },
  cvLine: "Lead developer of the report-builder application inside LibLynx's analytics platform: drag-and-drop COUNTER reporting, saved/shared/template/comparison workflows, Storybook component system. React 19, TypeScript, Material UI, TanStack Query.",
  featured: true,
};
