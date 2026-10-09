# Redzy Portfolio Redesign, Plan 1: Foundation, Content, Pages, CV

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Vite portfolio with a Next.js 16 static site that ships the full Redzy brand (monogram, icon set, project auras), all content, five case study pages with shared-element page transitions, a generated CV, SEO/OG, a 404 and the live footer details, with a static (non-3D) hero. Plan 2 (`2026-10-10-portfolio-redesign-signal-motion.md`) adds the Three.js Signal hero, GSAP motion, cursor, magnetic pills, hover previews and launch checks on top of this.

**Architecture:** Next.js App Router with `output: 'export'`; all copy lives in typed, Zod-validated modules under `content/`; components are small and grouped by page area; images are pre-processed by a sharp script into `public/media`; the CV PDF is printed from the `/cv` route by Playwright in `postbuild`.

**Tech Stack:** Next.js 16.4, React 19.3, TypeScript 5.x strict, Tailwind CSS 4, Zod 4, sharp 0.35, Playwright 1.64, Vitest 5, pdf-lib.

**Spec:** `docs/superpowers/specs/2026-10-09-portfolio-redesign-design.md` (read §3 brand, §4 routes, §5 home, §7 case studies, §8 CV, §9 content model, §10 tech, §11 assets, §12 testing before starting).

## Global Constraints

- Node 24, npm 11. Package versions: `next@^16.4`, `react@^19.3`, `tailwindcss@^4.3`, `zod@^4.6`, `sharp@^0.35`, `@playwright/test@^1.64`, `vitest@^5`, `typescript@^5.9` (not 7).
- `next.config.ts`: `output: 'export'`, `trailingSlash: true`, `images: { unoptimized: true }`. No server features, no API routes, no middleware.
- Dark only. Color tokens exactly as spec §3.2: canvas #0A0908, surface-1 #121110, surface-2 #1A1816, hairline #23211E, hairline-strong #2E2B28, ink-muted #8A857E, ink-soft #B8B2AA, ink #F2EFEA, signal #FF4A26, signal-soft #FFB3A3. Never pure #000 or #FFF.
- Fonts: Cabinet Grotesk 700/800 (display), Switzer 400/500/600 (body), IBM Plex Mono 400/500 (mono). Self-hosted woff2 in `public/fonts`, loaded with `next/font/local`.
- All copy lives in `content/`. No strings for roles, projects or profile inside components.
- Red (`signal`) is never a background of a large area and never body text color.
- English only. No theme toggle, no i18n, no contact form, no analytics other than Vercel Web Analytics.
- Branch: `redesign/signal`. Commit after every task with a message in the form `feat(area): ...`, `chore: ...`, `test: ...`, `docs: ...`, ending with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.
- Commands must be run from the repo root `/Users/redzydeveloper/Desktop/rijad-kuloglija-portfolio`.
- `assets/source/` is gitignored and holds originals; `public/media/` holds processed outputs and is committed.
- `prefers-reduced-motion: reduce` must leave every page fully readable with no animation (Plan 1 has almost no animation; keep CSS transitions ≤ 240 ms and wrap them in `@media (prefers-reduced-motion: no-preference)`).

## File structure (created by this plan)

```
app/layout.tsx                 fonts, metadata base, skip link, Grain, Navbar, Footer
app/globals.css                Tailwind 4 import + @theme tokens + base styles + print rules
app/fonts.ts                   next/font/local declarations
app/page.tsx                   home: composes hero + sections
app/work/[slug]/page.tsx       case study route, generateStaticParams
app/work/[slug]/opengraph-image.tsx
app/cv/page.tsx                CV page
app/not-found.tsx
app/opengraph-image.tsx, app/sitemap.ts, app/robots.ts, app/manifest.ts
components/brand/Monogram.tsx, Lockup.tsx, Icon.tsx, Aura.tsx
components/ui/Eyebrow.tsx, Pill.tsx, Grain.tsx, Vignette.tsx, Navbar.tsx, Footer.tsx, LocalTime.tsx, FaviconSwap.tsx, ConsoleSignature.tsx, Picture.tsx, PageTransition.tsx
components/hero/Hero.tsx, HeroPoster.tsx, AvailabilityBadge.tsx
components/home/WorkChapters.tsx, Companies.tsx, About.tsx, Experience.tsx, Lab.tsx, Contact.tsx, CopyEmailButton.tsx
components/work/ProductFrame.tsx, CaseStudy.tsx, Gallery.tsx, NextProject.tsx
components/cv/Cv.tsx
content/schema.ts, content/profile.ts, content/index.ts, content/work/{liblynx,din-solution,neo-labs,arkona,nepa-invest}.ts
lib/aura.ts                    deterministic SVG aura generator (seeded by string)
lib/media.ts                   typed helpers for public/media paths
public/brand/icons.svg         custom 14-icon sprite (hand-tuned paths, 24 grid, 1.5 stroke)
scripts/fetch-fonts.mjs, scripts/make-icons.mjs, scripts/render-auras.mjs, scripts/process-assets.mjs, scripts/capture-public-sites.mjs, scripts/build-cv-pdf.mjs
tests/unit/*.test.ts           vitest
tests/e2e/*.spec.ts            playwright
CLAUDE.md
```

---

### Task 1: Branch and Next.js 16 scaffold replacing the Vite app

**Files:**
- Delete: `src/`, `index.html`, `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, `tsconfig.app.json`, `tsconfig.node.json`, `eslint.config.js`, `vercel.json`, `public/_redirects`, `public/logo_*.{avif,webp}`, `public/favicon*.{ico,svg,png}`, `public/android-chrome-*.png`, `public/apple-touch-icon.png`, `public/site.webmanifest`, `public/sitemap.xml`, `public/robots.txt`, `package-lock.json`
- Create: `app/`, `next.config.ts`, `tsconfig.json`, `package.json` (from create-next-app), `.gitignore` additions
- Keep: `public/Rijad-Kuloglija-CV.pdf` (replaced in Task 11), `docs/`, `design/`, `README.md`

**Interfaces:**
- Produces: a buildable Next.js project where `npm run build` writes `out/index.html`.

- [ ] **Step 1: Create the branch**

```bash
git checkout -b redesign/signal
```

- [ ] **Step 2: Remove the Vite app**

```bash
git rm -r -q src index.html vite.config.ts tailwind.config.js postcss.config.js tsconfig.app.json tsconfig.node.json eslint.config.js vercel.json public/_redirects public/logo_dark.avif public/logo_dark.webp public/logo_light.avif public/logo_light.webp public/favicon.ico public/favicon.svg public/favicon-96x96.png public/android-chrome-192x192.png public/android-chrome-512x512.png public/apple-touch-icon.png public/site.webmanifest public/sitemap.xml public/robots.txt package-lock.json package.json tsconfig.json
rm -rf node_modules dist
git status --short | head
```

Expected: the deletions are staged; `public/Rijad-Kuloglija-CV.pdf`, `docs/`, `design/`, `README.md`, `.gitignore` remain.

- [ ] **Step 3: Scaffold Next.js into a temp folder and move it in**

```bash
cd /tmp && rm -rf redzy-scaffold && npx -y create-next-app@latest redzy-scaffold --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --disable-git --no-agent-feedback --yes
cd /Users/redzydeveloper/Desktop/rijad-kuloglija-portfolio
cp -R /tmp/redzy-scaffold/app ./app
mkdir -p public
cp /tmp/redzy-scaffold/package.json /tmp/redzy-scaffold/package-lock.json /tmp/redzy-scaffold/tsconfig.json /tmp/redzy-scaffold/next.config.ts /tmp/redzy-scaffold/postcss.config.mjs /tmp/redzy-scaffold/eslint.config.mjs /tmp/redzy-scaffold/next-env.d.ts ./
rm -f public/*.svg app/favicon.ico
rm -rf /tmp/redzy-scaffold
ls app public
```

Expected: `app/` has `layout.tsx`, `page.tsx`, `globals.css`; `public/` has only `Rijad-Kuloglija-CV.pdf`.

- [ ] **Step 4: Configure static export**

Replace `next.config.ts` with:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
```

Set `"name": "redzy-portfolio"` in `package.json` and add to `.gitignore`:

```
/out
/.next
/test-results
/playwright-report
```

- [ ] **Step 5: Install and build**

```bash
npm install
npm run build && ls out | head
```

Expected: build succeeds, `out/index.html` and `out/_next/` exist.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: replace Vite app with Next.js 16 static-export scaffold

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 2: Design tokens, fonts and base styles

**Files:**
- Create: `scripts/fetch-fonts.mjs`, `app/fonts.ts`, `public/fonts/` (downloaded), `tests/unit/tokens.test.ts`
- Modify: `app/globals.css`, `app/layout.tsx`, `package.json` (scripts)

**Interfaces:**
- Produces: CSS variables `--color-canvas … --color-signal-soft`, `--font-display`, `--font-body`, `--font-mono`; Tailwind utilities `bg-canvas`, `text-ink`, `font-display`, `font-body`, `font-mono`, `text-signal`, `border-hairline` etc.; exported `display`, `body`, `mono` from `app/fonts.ts` whose `.variable` class names go on `<html>`.

- [ ] **Step 1: Write the token test**

`tests/unit/tokens.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("app/globals.css", "utf8");

describe("design tokens", () => {
  it.each([
    ["--color-canvas", "#0a0908"],
    ["--color-surface-1", "#121110"],
    ["--color-surface-2", "#1a1816"],
    ["--color-hairline", "#23211e"],
    ["--color-hairline-strong", "#2e2b28"],
    ["--color-ink-muted", "#8a857e"],
    ["--color-ink-soft", "#b8b2aa"],
    ["--color-ink", "#f2efea"],
    ["--color-signal", "#ff4a26"],
    ["--color-signal-soft", "#ffb3a3"],
  ])("defines %s as %s", (name, value) => {
    const re = new RegExp(`${name}:\\s*${value};`, "i");
    expect(css).toMatch(re);
  });

  it("never uses pure black or white", () => {
    expect(css).not.toMatch(/#000(000)?\b/i);
    expect(css).not.toMatch(/#fff(fff)?\b/i);
  });
});
```

- [ ] **Step 2: Install Vitest and run the test to see it fail**

```bash
npm install -D vitest@^5
```

Add to `package.json` scripts: `"test": "vitest run"`, `"test:watch": "vitest"`. Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { include: ["tests/unit/**/*.test.ts", "tests/unit/**/*.test.tsx"] },
});
```

Run: `npm test`
Expected: FAIL, tokens not found in `globals.css`.

- [ ] **Step 3: Write the font download script**

`scripts/fetch-fonts.mjs`:

```js
// Downloads the woff2 files we self-host. Run once: node scripts/fetch-fonts.mjs
import { mkdir, writeFile } from "node:fs/promises";

const OUT = "public/fonts";
const UA = "Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/120 Safari/537.36";

const sources = [
  { css: "https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@700,800&display=swap", family: "cabinet-grotesk" },
  { css: "https://api.fontshare.com/v2/css?f[]=switzer@400,500,600&display=swap", family: "switzer" },
  { css: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap", family: "ibm-plex-mono" },
];

await mkdir(OUT, { recursive: true });

for (const { css, family } of sources) {
  const text = await (await fetch(css, { headers: { "user-agent": UA } })).text();
  const faces = text.split("@font-face").slice(1);
  for (const face of faces) {
    const weight = face.match(/font-weight:\s*(\d+)/)?.[1];
    const style = face.match(/font-style:\s*(\w+)/)?.[1] ?? "normal";
    const url = face.match(/url\(([^)]+\.woff2[^)]*)\)/)?.[1]?.replace(/['"]/g, "");
    // Google serves one face per unicode-range; keep the latin block only.
    const range = face.match(/unicode-range:\s*([^;]+)/)?.[1] ?? "";
    if (!url || !weight || (range && !range.includes("U+0000-00FF"))) continue;
    const abs = url.startsWith("//") ? `https:${url}` : url;
    const buf = Buffer.from(await (await fetch(abs, { headers: { "user-agent": UA } })).arrayBuffer());
    const file = `${OUT}/${family}-${weight}${style === "italic" ? "-italic" : ""}.woff2`;
    await writeFile(file, buf);
    console.log(`${file} ${buf.length} bytes`);
  }
}
```

Run: `node scripts/fetch-fonts.mjs && ls -la public/fonts`
Expected: 7 files: `cabinet-grotesk-700.woff2`, `cabinet-grotesk-800.woff2`, `switzer-400.woff2`, `switzer-500.woff2`, `switzer-600.woff2`, `ibm-plex-mono-400.woff2`, `ibm-plex-mono-500.woff2`, each > 10 KB.

- [ ] **Step 4: Declare fonts with next/font/local**

`app/fonts.ts`:

```ts
import localFont from "next/font/local";

export const display = localFont({
  src: [
    { path: "../public/fonts/cabinet-grotesk-700.woff2", weight: "700" },
    { path: "../public/fonts/cabinet-grotesk-800.woff2", weight: "800" },
  ],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

export const body = localFont({
  src: [
    { path: "../public/fonts/switzer-400.woff2", weight: "400" },
    { path: "../public/fonts/switzer-500.woff2", weight: "500" },
    { path: "../public/fonts/switzer-600.woff2", weight: "600" },
  ],
  variable: "--font-body",
  display: "swap",
  preload: true,
});

export const mono = localFont({
  src: [
    { path: "../public/fonts/ibm-plex-mono-400.woff2", weight: "400" },
    { path: "../public/fonts/ibm-plex-mono-500.woff2", weight: "500" },
  ],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});
```

- [ ] **Step 5: Write globals.css with the tokens**

Replace `app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-canvas: #0a0908;
  --color-surface-1: #121110;
  --color-surface-2: #1a1816;
  --color-hairline: #23211e;
  --color-hairline-strong: #2e2b28;
  --color-ink-muted: #8a857e;
  --color-ink-soft: #b8b2aa;
  --color-ink: #f2efea;
  --color-signal: #ff4a26;
  --color-signal-soft: #ffb3a3;
  --color-paper: #f7f4ef;
  --color-paper-ink: #1a1816;

  --font-display: var(--font-display), ui-sans-serif, system-ui, sans-serif;
  --font-body: var(--font-body), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-mono), ui-monospace, "SF Mono", Menlo, monospace;

  --ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);
  --radius-frame: 12px;
}

@layer base {
  html {
    background: var(--color-canvas);
    color: var(--color-ink);
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  body {
    font-family: var(--font-body);
    font-size: 16px;
    line-height: 1.6;
    min-height: 100dvh;
  }
  ::selection { background: var(--color-signal); color: var(--color-canvas); }
  :focus-visible { outline: 2px solid var(--color-signal); outline-offset: 2px; }
  a { color: inherit; text-decoration: none; }
}

@utility eyebrow {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
}

@utility display-xl {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(56px, 8vw, 112px);
  line-height: 0.92;
  letter-spacing: -0.035em;
}

@utility display-lg {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(40px, 5vw, 64px);
  line-height: 0.95;
  letter-spacing: -0.035em;
}

@utility display-md {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(32px, 3.2vw, 40px);
  line-height: 1;
  letter-spacing: -0.03em;
}

@utility headline {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(22px, 2vw, 26px);
  line-height: 1.15;
  letter-spacing: -0.02em;
}

@utility container-site {
  width: 100%;
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: 24px;
  @media (min-width: 768px) { padding-inline: 48px; }
  @media (min-width: 1280px) { padding-inline: 64px; }
}

@utility hairline-top { border-top: 1px solid var(--color-hairline); }
```

Update `app/layout.tsx` to use the font variables (full layout comes in Task 5; for now):

```tsx
import type { Metadata } from "next";
import { display, body, mono } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Redzy — Rijad Kuloglija",
  description: "Lead Software Developer. Software that keeps working after launch.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

Replace `app/page.tsx` with a token smoke page:

```tsx
export default function Home() {
  return (
    <main className="container-site py-24">
      <p className="eyebrow">Redzy · tokens</p>
      <h1 className="display-xl mt-4">Software that keeps working after launch.</h1>
      <p className="mt-6 max-w-[48ch] text-ink-soft text-lg">Body text in Switzer. <span className="text-signal">Signal.</span></p>
    </main>
  );
}
```

- [ ] **Step 6: Run tests and build**

Run: `npm test && npm run build`
Expected: tokens test PASS (11 tests); build OK. Open `npm run dev` and confirm Cabinet Grotesk renders the headline (letterforms with a single-storey "a").

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(brand): design tokens, self-hosted fonts and base styles

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---
### Task 3: Content schema and profile data

**Files:**
- Create: `content/schema.ts`, `content/profile.ts`, `tests/unit/content.test.ts`
- Modify: `package.json` (add `zod`)

**Interfaces:**
- Produces: `ProfileSchema`, `ProjectSchema`, `RoleSchema`, `MediaSchema`, `LabItemSchema` (Zod) and inferred types `Profile`, `Project`, `Role`, `Media`, `LabItem`; the `profile` object. Later tasks import `profile` from `@/content/profile` and `projects` from `@/content` (Task 4).

- [ ] **Step 1: Install Zod**

```bash
npm install zod@^4.6
```

- [ ] **Step 2: Write the schema**

`content/schema.ts`:

```ts
import { z } from "zod";

export const LinkSchema = z.object({ label: z.string().min(1), url: z.url() });

export const MediaSchema = z.object({
  src: z.string().startsWith("/media/"),
  alt: z.string().min(4),
  kind: z.enum(["desktop", "mobile", "video"]),
  caption: z.string().optional(),
  poster: z.string().startsWith("/media/").optional(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const RoleSchema = z.object({
  company: z.string().min(1),
  title: z.string().min(1),
  titleProgression: z.string().optional(),
  start: z.string().regex(/^\d{4}-\d{2}$/),
  end: z.string().regex(/^\d{4}-\d{2}$/).nullable(),
  location: z.string().min(1),
  mode: z.enum(["remote", "on-site", "hybrid", "contract", "part-time"]),
  summary: z.string().min(20),
  stack: z.array(z.string()).optional(),
  url: z.url().optional(),
  current: z.boolean(),
  showOnCv: z.boolean(),
  projectSlug: z.string().optional(),
});

export const ProjectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  index: z.number().int().min(1).max(5),
  name: z.string().min(1),
  categories: z.array(z.string().min(1)).min(1).max(4),
  oneLiner: z.string().min(10).max(140),
  role: z.string().min(1),
  roleNote: z.string().optional(),
  period: z.string().min(4),
  stack: z.array(z.string().min(1)).min(1),
  live: LinkSchema.optional(),
  repo: LinkSchema.optional(),
  body: z.object({
    overview: z.string().min(40),
    problem: z.string().min(40),
    contribution: z.string().min(40),
    engineering: z.string().min(40),
  }),
  delivered: z.array(z.string().min(10)).min(2).max(5),
  media: z.object({
    hero: z.union([MediaSchema, z.array(MediaSchema).min(2).max(3)]),
    gallery: z.array(MediaSchema).max(4),
  }),
  cvLine: z.string().min(20).max(220),
  featured: z.literal(true),
});

export const LabItemSchema = z.object({
  name: z.string().min(1),
  line: z.string().min(10),
  year: z.string().min(4),
  links: z.array(LinkSchema).optional(),
  previewSlug: z.string().optional(),
});

export const ProfileSchema = z.object({
  name: z.string(),
  title: z.string(),
  headline: z.string().max(60),
  lead: z.string().max(260),
  about: z.string().min(200).max(900),
  availability: z.string().max(80).nullable(),
  location: z.string(),
  since: z.number().int(),
  email: z.email(),
  domain: z.string(),
  links: z.object({ github: z.url(), linkedin: z.url() }),
  strengths: z.array(z.string()).length(6),
  stack: z.array(z.object({ group: z.string(), items: z.array(z.string()).min(1) })).min(3),
  education: z.array(z.object({ school: z.string(), degree: z.string(), years: z.string() })).min(1),
  languages: z.array(z.object({ name: z.string(), level: z.string() })).min(1),
  companies: z.array(z.string()).min(6),
  roles: z.array(RoleSchema).min(5),
  lab: z.array(LabItemSchema).min(3),
});

export type Link = z.infer<typeof LinkSchema>;
export type Media = z.infer<typeof MediaSchema>;
export type Role = z.infer<typeof RoleSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type LabItem = z.infer<typeof LabItemSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
```

- [ ] **Step 3: Write the failing content test**

`tests/unit/content.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { ProfileSchema } from "../../content/schema";
import { profile } from "../../content/profile";

describe("profile content", () => {
  it("validates against the schema", () => {
    const result = ProfileSchema.safeParse(profile);
    if (!result.success) console.error(result.error.format());
    expect(result.success).toBe(true);
  });

  it("lists roles newest first and marks current roles", () => {
    const starts = profile.roles.map((r) => r.start);
    const sorted = [...starts].sort((a, b) => (a < b ? 1 : -1));
    expect(starts).toEqual(sorted);
    expect(profile.roles.filter((r) => r.current).map((r) => r.company)).toEqual([
      "DIN Solution",
      "Neo Labs",
      "LibLynx via Clearview",
    ]);
  });

  it("has no legacy facts", () => {
    const text = JSON.stringify(profile);
    expect(text).not.toMatch(/Full-Stack Developer at ProCredit/);
    expect(text).not.toMatch(/5 years/);
  });
});
```

Run: `npm test`
Expected: FAIL, `content/profile` not found.

- [ ] **Step 4: Write the profile**

`content/profile.ts`:

```ts
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
      company: "ProCredit Bank", title: "Full-Stack Developer",
      start: "2024-03", end: "2025-10", location: "Sarajevo", mode: "on-site",
      summary: "Design-to-deployment ownership of internal banking products: HR dashboard, customer-referral system, ATM-feedback tooling.",
      stack: ["Vue", "React", "Flask", "Laravel", "MySQL"], current: false, showOnCv: true,
    },
    {
      company: "Arkona Technology", title: "Senior Frontend Developer",
      start: "2024-10", end: "2025-03", location: "Belgrade", mode: "part-time",
      summary: "Led end-to-end development of Arkona's website; built the GumaMax multi-vendor tire-ordering dashboard.",
      stack: ["React", "i18n"], url: "https://www.arkonatechnology.com/", current: false, showOnCv: true, projectSlug: "arkona",
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
```

- [ ] **Step 5: Run the test**

Run: `npm test`
Expected: PASS (content tests + tokens tests).

Note on the Neo Labs start date: DIN shows "Current" without a month; `2025-09` is the owner's best estimate and is listed in Plan 1 §Open items for confirmation. Ordering by `start` must stay newest first.

- [ ] **Step 6: Commit**

```bash
git add content tests package.json package-lock.json
git commit -m "feat(content): zod schema and profile data from the DIN portfolio

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 4: Project content files

**Files:**
- Create: `content/work/liblynx.ts`, `content/work/din-solution.ts`, `content/work/neo-labs.ts`, `content/work/arkona.ts`, `content/work/nepa-invest.ts`, `content/index.ts`
- Modify: `tests/unit/content.test.ts`

**Interfaces:**
- Produces: `projects: Project[]` ordered by `index`, `getProject(slug): Project | undefined`, `nextProject(slug): Project`, `projectSlugs: string[]` from `@/content`.
- Media paths referenced here are produced by Task 7 (`/media/work/<slug>/...`); until then the content test only checks shape, and Task 7 adds the file-existence test.

- [ ] **Step 1: Extend the content test**

Append to `tests/unit/content.test.ts`:

```ts
import { ProjectSchema } from "../../content/schema";
import { projects, getProject, nextProject, projectSlugs } from "../../content";

describe("projects", () => {
  it("has five valid projects ordered 1..5", () => {
    expect(projects).toHaveLength(5);
    projects.forEach((p, i) => {
      const r = ProjectSchema.safeParse(p);
      if (!r.success) console.error(p.slug, r.error.format());
      expect(r.success).toBe(true);
      expect(p.index).toBe(i + 1);
    });
    expect(projectSlugs).toEqual(["liblynx", "din-solution", "neo-labs", "arkona", "nepa-invest"]);
  });

  it("wraps next project around", () => {
    expect(nextProject("liblynx").slug).toBe("din-solution");
    expect(nextProject("nepa-invest").slug).toBe("liblynx");
    expect(getProject("nope")).toBeUndefined();
  });

  it("uses first person, not third person", () => {
    for (const p of projects) {
      const text = Object.values(p.body).join(" ");
      expect(text).not.toMatch(/\bRijad (leads|is|built|engineered|worked)\b/);
    }
  });
});
```

Run: `npm test`
Expected: FAIL, `content/index` not found.

- [ ] **Step 2: Write `content/work/liblynx.ts`**

```ts
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
    hero: { src: "/media/work/liblynx/hero-desktop-1600.webp", alt: "LibLynx report builder: composing a usage report with filter bricks", kind: "desktop", width: 1600, height: 1000 },
    gallery: [
      { src: "/media/work/liblynx/gallery-1-1600.webp", alt: "Saved reports list with sharing and reorder", kind: "desktop", width: 1600, height: 1000, caption: "Saved reports · sharing and reorder" },
      { src: "/media/work/liblynx/gallery-2-800.webp", alt: "Report builder on a phone", kind: "mobile", width: 800, height: 1734, caption: "Mobile · report composer" },
    ],
  },
  cvLine: "Lead developer of the report-builder application inside LibLynx's analytics platform: drag-and-drop COUNTER reporting, saved/shared/template/comparison workflows, Storybook component system. React 19, TypeScript, Material UI, TanStack Query.",
  featured: true,
};
```

- [ ] **Step 3: Write `content/work/din-solution.ts`**

```ts
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
```

- [ ] **Step 4: Write `content/work/neo-labs.ts`**

```ts
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
```

- [ ] **Step 5: Write `content/work/arkona.ts`**

```ts
import type { Project } from "../schema";

export const arkona: Project = {
  slug: "arkona",
  index: 4,
  name: "Arkona + GumaMax",
  categories: ["Software company", "Web platform", "Commerce dashboard"],
  oneLiner: "End-to-end ownership of a software company's own web presence, plus a multi-vendor tire-ordering dashboard.",
  role: "Senior Frontend Developer",
  roleNote: "part-time, Oct 2024 — Mar 2025",
  period: "Oct 2024 — Mar 2025",
  stack: ["React", "Responsive UI", "Performance", "i18n (EN/SR)", "Dashboard workflows"],
  live: { label: "arkonatechnology.com", url: "https://www.arkonatechnology.com/" },
  body: {
    overview:
      "Arkona Technology is a Belgrade software development company positioning itself as a long-term technology partner, building web, mobile and e-commerce products on a stack running from Symfony and Node.js to React and Next.js. A software company's own website is a portfolio piece by definition: it gets judged by engineers.",
    problem:
      "Full frontend ownership with the client's own developers as the audience: one engineer responsible for the architecture, the responsive behavior, the performance and the production delivery of a bilingual (English/Serbian) single-page React site with a dark visual identity. Alongside it, a commercial product with real operational complexity: tire ordering across multiple vendors.",
    contribution:
      "I led the end-to-end development of the website, architecture through deployment. I also developed GumaMax, a web-based tire-ordering dashboard enabling multi-vendor product sales and management: catalog, vendor management and ordering workflows.",
    engineering:
      "Responsive React frontend engineering with bilingual content and performance work on an image-heavy marketing site, plus a separate dashboard product handling multi-vendor catalog and ordering workflows where correctness of stock and pricing matters more than visual flourish.",
  },
  delivered: [
    "Arkona's production website, live and maintained",
    "GumaMax multi-vendor tire-ordering dashboard",
    "Frontend ownership from first commit to production",
  ],
  media: {
    hero: { src: "/media/work/arkona/hero-desktop-1600.webp", alt: "arkonatechnology.com home page", kind: "desktop", width: 1600, height: 1000 },
    gallery: [
      { src: "/media/work/arkona/gallery-1-800.webp", alt: "arkonatechnology.com on a phone", kind: "mobile", width: 800, height: 1734, caption: "Mobile · services" },
    ],
  },
  cvLine: "Led end-to-end development of Arkona Technology's bilingual React website and built GumaMax, a multi-vendor tire-ordering dashboard.",
  featured: true,
};
```

- [ ] **Step 6: Write `content/work/nepa-invest.ts`**

```ts
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
```

- [ ] **Step 7: Write `content/index.ts`**

```ts
import { profile } from "./profile";
import { liblynx } from "./work/liblynx";
import { dinSolution } from "./work/din-solution";
import { neoLabs } from "./work/neo-labs";
import { arkona } from "./work/arkona";
import { nepaInvest } from "./work/nepa-invest";
import type { Project } from "./schema";

export const projects: Project[] = [liblynx, dinSolution, neoLabs, arkona, nepaInvest].sort((a, b) => a.index - b.index);
export const projectSlugs = projects.map((p) => p.slug);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function nextProject(slug: string): Project {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}

export { profile };
export type { Project, Profile, Role, Media, LabItem, Link } from "./schema";
```

- [ ] **Step 8: Run tests**

Run: `npm test`
Expected: PASS. If a `min()` length fails, lengthen that string rather than loosening the schema.

- [ ] **Step 9: Commit**

```bash
git add content tests
git commit -m "feat(content): five case study content modules and project index

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---
### Task 5: Brand primitives: Monogram, Lockup, icon sprite, auras, favicons

**Files:**
- Create: `components/brand/Monogram.tsx`, `components/brand/Lockup.tsx`, `components/brand/Icon.tsx`, `components/brand/Aura.tsx`, `lib/aura.ts`, `public/brand/icons.svg`, `public/brand/redzy-mark.svg`, `scripts/make-icons.mjs`, `scripts/render-auras.mjs`, `tests/unit/brand.test.tsx`
- Modify: `package.json` (add `sharp`, scripts `icons`, `auras`)

**Interfaces:**
- Produces:
  - `<Monogram size={number} lit?: boolean; className?: string; title?: string />` renders the exact R geometry from spec §3.1; `lit=false` draws the dot in `ink-muted` (used by 404).
  - `<Lockup size?: number />` monogram + "Redzy" wordmark.
  - `<Icon name: IconName; size?: number; className?: string />` where `IconName = 'arrow-up-right' | 'arrow-right' | 'arrow-left' | 'mail' | 'copy' | 'check' | 'download' | 'external' | 'close' | 'menu' | 'play' | 'pause' | 'github' | 'linkedin'`.
  - `auraSvg(seed: string, width: number, height: number): string` deterministic SVG markup; `<Aura seed width height className />` inlines it.
  - `public/brand/icon-32.png`, `icon-180.png`, `icon-192.png`, `icon-512.png`, `og-default.png` and `public/media/auras/<slug>.png` generated by scripts.

- [ ] **Step 1: Write the failing brand tests**

`tests/unit/brand.test.tsx`:

```tsx
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Monogram } from "../../components/brand/Monogram";
import { Icon } from "../../components/brand/Icon";
import { auraSvg } from "../../lib/aura";

describe("Monogram", () => {
  it("renders the spec geometry and a lit signal dot", () => {
    const html = renderToStaticMarkup(<Monogram size={64} />);
    expect(html).toContain('d="M30,10 H52 A22,22 0 0 1 52,54 H30 Z M30,24 H52 A8,8 0 0 1 52,40 H30 Z"');
    expect(html).toContain('points="42,50 56,50 80,90 66,90"');
    expect(html).toContain('x="16" y="10" width="14" height="80"');
    expect(html).toMatch(/<circle[^>]*cx="46"[^>]*cy="32"[^>]*r="5"/);
    expect(html).toContain("var(--color-signal)");
  });
  it("uses the larger dot at favicon size and a muted dot when unlit", () => {
    expect(renderToStaticMarkup(<Monogram size={16} />)).toMatch(/r="6.5"/);
    expect(renderToStaticMarkup(<Monogram size={64} lit={false} />)).toContain("var(--color-ink-muted)");
  });
});

describe("Icon", () => {
  it("references the sprite by name", () => {
    const html = renderToStaticMarkup(<Icon name="arrow-up-right" />);
    expect(html).toContain('href="/brand/icons.svg#arrow-up-right"');
    expect(html).toContain('aria-hidden="true"');
  });
});

describe("aura", () => {
  it("is deterministic per seed and differs between seeds", () => {
    const a1 = auraSvg("liblynx", 1200, 630);
    const a2 = auraSvg("liblynx", 1200, 630);
    const b = auraSvg("nepa-invest", 1200, 630);
    expect(a1).toBe(a2);
    expect(a1).not.toBe(b);
    expect(a1).toContain("<feTurbulence");
    expect(a1).toContain("#FF4A26");
  });
});
```

Run: `npm test`
Expected: FAIL, modules missing. (`react-dom/server` needs the `.tsx` test include already set in `vitest.config.ts`; add `esbuild: { jsx: 'automatic' }` to the Vitest config if JSX fails to compile.)

- [ ] **Step 2: Write `Monogram.tsx`**

```tsx
export const MONOGRAM = {
  stem: { x: 16, y: 10, width: 14, height: 80 },
  bowl: "M30,10 H52 A22,22 0 0 1 52,54 H30 Z M30,24 H52 A8,8 0 0 1 52,40 H30 Z",
  leg: "42,50 56,50 80,90 66,90",
  dot: { cx: 46, cy: 32 },
} as const;

type Props = {
  size?: number;
  lit?: boolean;
  className?: string;
  title?: string;
  glow?: boolean;
};

export function Monogram({ size = 32, lit = true, className, title = "Redzy", glow = true }: Props) {
  const r = size <= 20 ? 6.5 : 5;
  const dotColor = lit ? "var(--color-signal)" : "var(--color-ink-muted)";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={title}
      className={className}
      style={lit && glow ? { filter: "drop-shadow(0 0 6px rgba(255,74,38,.55))" } : undefined}
    >
      <g fill="currentColor">
        <rect x={MONOGRAM.stem.x} y={MONOGRAM.stem.y} width={MONOGRAM.stem.width} height={MONOGRAM.stem.height} />
        <path fillRule="evenodd" d={MONOGRAM.bowl} />
        <polygon points={MONOGRAM.leg} />
      </g>
      <circle cx={MONOGRAM.dot.cx} cy={MONOGRAM.dot.cy} r={r} fill={dotColor} data-signal-dot />
    </svg>
  );
}
```

- [ ] **Step 3: Write `Lockup.tsx`**

```tsx
import { Monogram } from "./Monogram";

export function Lockup({ size = 22 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-[0.45em] text-ink" style={{ fontSize: size }}>
      <Monogram size={size} title="Redzy monogram" />
      <span className="font-display font-extrabold tracking-[-0.045em] leading-none" style={{ fontSize: size * 1.05 }}>
        Redzy
      </span>
    </span>
  );
}
```

- [ ] **Step 4: Write the icon sprite by hand**

`public/brand/icons.svg` (24-unit grid, 1.5 stroke, round caps; `github` and `linkedin` are fills):

```svg
<svg xmlns="http://www.w3.org/2000/svg" style="display:none">
  <defs>
    <g id="s" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </defs>
  <symbol id="arrow-up-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M8.5 7H17v8.5"/></symbol>
  <symbol id="arrow-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15"/><path d="m13.5 6.5 5.5 5.5-5.5 5.5"/></symbol>
  <symbol id="arrow-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12H5"/><path d="M10.5 6.5 5 12l5.5 5.5"/></symbol>
  <symbol id="mail" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="6" width="17" height="12" rx="2"/><path d="m4 7.5 8 5.5 8-5.5"/></symbol>
  <symbol id="copy" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11.5" height="11.5" rx="2"/><path d="M5.5 15H4.75A1.75 1.75 0 0 1 3 13.25v-8.5C3 3.78 3.78 3 4.75 3h8.5c.97 0 1.75.78 1.75 1.75V5.5"/></symbol>
  <symbol id="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></symbol>
  <symbol id="download" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11"/><path d="m6.5 10.5 5.5 5.5 5.5-5.5"/><path d="M4.5 20h15"/></symbol>
  <symbol id="external" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6"/><path d="M20 4 11 13"/><path d="M18 13.5V18.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6h5"/></symbol>
  <symbol id="close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 6 12 12"/><path d="M18 6 6 18"/></symbol>
  <symbol id="menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8.5h16"/><path d="M4 15.5h16"/></symbol>
  <symbol id="play" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 5.5v13l10.5-6.5z"/></symbol>
  <symbol id="pause" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 5.5v13"/><path d="M15.5 5.5v13"/></symbol>
  <symbol id="github" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z"/></symbol>
  <symbol id="linkedin" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3.5a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2zM3.3 9.1h3.5V21H3.3zM9.6 9.1H13v1.7c.5-.9 1.7-2 3.6-2 3.8 0 4.5 2.5 4.5 5.7V21h-3.5v-5.7c0-1.4 0-3.1-1.9-3.1s-2.2 1.5-2.2 3V21H9.6z"/></symbol>
</svg>
```

Remove the unused `<defs>` block if the linter complains; it is harmless.

- [ ] **Step 5: Write `Icon.tsx`**

```tsx
export type IconName =
  | "arrow-up-right" | "arrow-right" | "arrow-left" | "mail" | "copy" | "check" | "download"
  | "external" | "close" | "menu" | "play" | "pause" | "github" | "linkedin";

export function Icon({ name, size = 18, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} aria-hidden="true" focusable="false" className={className}>
      <use href={`/brand/icons.svg#${name}`} />
    </svg>
  );
}
```

- [ ] **Step 6: Write the aura generator**

`lib/aura.ts`:

```ts
// Deterministic "aura": soft red light + grain derived from a string seed.
function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

function rng(seed: number) {
  let s = seed || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5; s >>>= 0;
    return (s >>> 0) / 4294967296;
  };
}

export function auraSvg(seed: string, width: number, height: number): string {
  const h = hash(seed);
  const rand = rng(h);
  const id = `a${h.toString(36)}`;
  const lights = Array.from({ length: 3 }, (_, i) => ({
    cx: Math.round((0.15 + rand() * 0.7) * width),
    cy: Math.round((0.1 + rand() * 0.8) * height),
    r: Math.round((0.25 + rand() * 0.35) * Math.max(width, height)),
    o: (0.22 - i * 0.05).toFixed(2),
  }));
  const freq = (0.004 + rand() * 0.006).toFixed(4);
  const scale = Math.round(40 + rand() * 60);
  const grads = lights
    .map(
      (l, i) =>
        `<radialGradient id="${id}g${i}" cx="${l.cx}" cy="${l.cy}" r="${l.r}" gradientUnits="userSpaceOnUse">` +
        `<stop offset="0" stop-color="#FF4A26" stop-opacity="${l.o}"/><stop offset="1" stop-color="#FF4A26" stop-opacity="0"/></radialGradient>`,
    )
    .join("");
  const rects = lights.map((_, i) => `<rect width="${width}" height="${height}" fill="url(#${id}g${i})"/>`).join("");
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<defs>${grads}<filter id="${id}f" x="-20%" y="-20%" width="140%" height="140%">` +
    `<feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="3" seed="${h % 1000}" result="n"/>` +
    `<feDisplacementMap in="SourceGraphic" in2="n" scale="${scale}" xChannelSelector="R" yChannelSelector="G"/>` +
    `<feGaussianBlur stdDeviation="${Math.round(width / 40)}"/></filter></defs>` +
    `<rect width="${width}" height="${height}" fill="#0A0908"/>` +
    `<g filter="url(#${id}f)">${rects}</g></svg>`
  );
}
```

`components/brand/Aura.tsx`:

```tsx
import { auraSvg } from "@/lib/aura";

export function Aura({ seed, width = 1200, height = 630, className }: { seed: string; width?: number; height?: number; className?: string }) {
  const svg = auraSvg(seed, width, height);
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{ backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`, backgroundSize: "cover", backgroundPosition: "center" }}
    />
  );
}
```

- [ ] **Step 7: Run the brand tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 8: Write the mark SVG and the icon/aura scripts**

`public/brand/redzy-mark.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="#F2EFEA"><rect x="16" y="10" width="14" height="80"/><path fill-rule="evenodd" d="M30,10 H52 A22,22 0 0 1 52,54 H30 Z M30,24 H52 A8,8 0 0 1 52,40 H30 Z"/><polygon points="42,50 56,50 80,90 66,90"/></g><circle cx="46" cy="32" r="5" fill="#FF4A26"/></svg>
```

`app/icon.svg` (Next serves it as the favicon automatically):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="#0A0908"/><g fill="#F2EFEA" transform="translate(6,4) scale(0.9)"><rect x="16" y="10" width="14" height="80"/><path fill-rule="evenodd" d="M30,10 H52 A22,22 0 0 1 52,54 H30 Z M30,24 H52 A8,8 0 0 1 52,40 H30 Z"/><polygon points="42,50 56,50 80,90 66,90"/></g><circle cx="47.4" cy="32.8" r="6.5" fill="#FF4A26"/></svg>
```

`public/brand/icon-muted.svg`: same as `app/icon.svg` but the circle fill is `#8A857E` (used by FaviconSwap in Task 6).

```bash
npm install -D sharp@^0.35
```

`scripts/make-icons.mjs`:

```js
import sharp from "sharp";
import { readFile, mkdir } from "node:fs/promises";

const svg = await readFile("app/icon.svg");
await mkdir("public/brand", { recursive: true });
for (const size of [32, 180, 192, 512]) {
  await sharp(svg).resize(size, size).png().toFile(`public/brand/icon-${size}.png`);
  console.log(`icon-${size}.png`);
}
```

`scripts/render-auras.mjs`:

```js
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { auraSvg } from "../lib/aura.ts";

const seeds = ["liblynx", "din-solution", "neo-labs", "arkona", "nepa-invest", "rijad", "default"];
await mkdir("public/media/auras", { recursive: true });
for (const seed of seeds) {
  await sharp(Buffer.from(auraSvg(seed, 1200, 630))).png({ compressionLevel: 9 }).toFile(`public/media/auras/${seed}.png`);
  console.log(`auras/${seed}.png`);
}
```

Add scripts to `package.json`: `"icons": "node scripts/make-icons.mjs"`, `"auras": "node --experimental-strip-types scripts/render-auras.mjs"` (Node 24 strips types natively; if the import of `.ts` fails, run with `npx tsx scripts/render-auras.mjs` after `npm i -D tsx`).

Run: `npm run icons && npm run auras && ls public/brand public/media/auras`
Expected: four PNG icons and seven aura PNGs; open `public/media/auras/liblynx.png` and confirm soft red light on near-black with visible grain.

- [ ] **Step 9: Commit**

```bash
git add components lib public app/icon.svg scripts tests package.json package-lock.json
git commit -m "feat(brand): monogram, lockup, custom icon sprite, auras and app icons

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---
### Task 6: Layout shell: Navbar, Footer, Grain, Vignette, live details, page transitions

**Files:**
- Create: `components/ui/Navbar.tsx`, `components/ui/MobileMenu.tsx`, `components/ui/Footer.tsx`, `components/ui/LocalTime.tsx`, `components/ui/Grain.tsx`, `components/ui/Vignette.tsx`, `components/ui/FaviconSwap.tsx`, `components/ui/ConsoleSignature.tsx`, `components/ui/Pill.tsx`, `components/ui/Eyebrow.tsx`, `components/ui/PageTransition.tsx`, `tests/unit/local-time.test.ts`
- Modify: `app/layout.tsx`, `app/globals.css`, `package.json` (build date env)

**Interfaces:**
- Consumes: `profile` (Task 3), `Lockup`, `Monogram`, `Icon` (Task 5).
- Produces: `<Pill href variant="primary"|"outline" dot?: boolean transitionTypes?>`, `<Eyebrow>` (mono label), `<PageTransition>` wrapper used by every `page.tsx`, `formatSarajevoTime(date: Date): string`.

- [ ] **Step 1: Write the time formatting test**

`tests/unit/local-time.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { formatSarajevoTime } from "../../components/ui/LocalTime";

describe("formatSarajevoTime", () => {
  it("formats in Europe/Sarajevo 24h with the zone label", () => {
    expect(formatSarajevoTime(new Date("2026-01-15T11:05:00Z"))).toBe("12:05 CET");
    expect(formatSarajevoTime(new Date("2026-07-15T11:05:00Z"))).toBe("13:05 CEST");
  });
});
```

Run: `npm test` → FAIL (module missing).

- [ ] **Step 2: Write LocalTime**

`components/ui/LocalTime.tsx`:

```tsx
"use client";
import { useEffect, useState } from "react";

export function formatSarajevoTime(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Sarajevo", hour: "2-digit", minute: "2-digit", hour12: false, timeZoneName: "short",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const zone = get("timeZoneName").replace("GMT+1", "CET").replace("GMT+2", "CEST");
  return `${get("hour")}:${get("minute")} ${zone}`;
}

export function LocalTime() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setNow(formatSarajevoTime(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>Sarajevo · {now ?? "--:-- CET"}</span>;
}
```

Run: `npm test` → PASS.

- [ ] **Step 3: Write Pill and Eyebrow**

`components/ui/Pill.tsx`:

```tsx
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline";
  dot?: boolean;
  external?: boolean;
  transitionTypes?: string[];
  className?: string;
};

export function Pill({ href, children, variant = "primary", dot, external, transitionTypes, className = "" }: Props) {
  const base = "inline-flex items-center gap-2.5 rounded-full px-5 py-3 text-sm font-medium transition-[background,transform] duration-200 motion-reduce:transition-none";
  const look = variant === "primary"
    ? "bg-ink text-canvas hover:bg-signal-soft"
    : "border border-hairline-strong text-ink hover:border-ink-muted";
  const content = (
    <>
      {dot && <span aria-hidden className="h-2 w-2 rounded-full bg-signal shadow-[0_0_10px_3px_rgba(255,74,38,.7)]" />}
      {children}
    </>
  );
  if (external) {
    return <a href={href} target="_blank" rel="noreferrer" className={`${base} ${look} ${className}`} data-magnetic>{content}</a>;
  }
  return <Link href={href} transitionTypes={transitionTypes} className={`${base} ${look} ${className}`} data-magnetic>{content}</Link>;
}
```

`components/ui/Eyebrow.tsx`:

```tsx
export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}
```

- [ ] **Step 4: Write Grain and Vignette**

`components/ui/Grain.tsx`:

```tsx
const NOISE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='120' height='120' filter='url(#n)' opacity='.9'/></svg>`,
  );

export function Grain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] opacity-[0.065] mix-blend-overlay"
      style={{ backgroundImage: `url("${NOISE}")`, backgroundSize: "120px 120px" }}
    />
  );
}
```

`components/ui/Vignette.tsx`:

```tsx
export function Vignette() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[59]"
      style={{ background: "radial-gradient(120% 90% at 50% 50%, transparent 60%, rgba(10,9,8,.55) 100%)", opacity: 0.6 }}
    />
  );
}
```

- [ ] **Step 5: Write FaviconSwap and ConsoleSignature**

`components/ui/FaviconSwap.tsx`:

```tsx
"use client";
import { useEffect } from "react";

export function FaviconSwap() {
  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"][type="image/svg+xml"]');
    if (!link) return;
    const lit = link.href;
    const onChange = () => { link.href = document.hidden ? "/brand/icon-muted.svg" : lit; };
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);
  return null;
}
```

`components/ui/ConsoleSignature.tsx`:

```tsx
"use client";
import { useEffect } from "react";
import { profile } from "@/content/profile";

export function ConsoleSignature() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    const art = [
      "██████╗ ",
      "██╔══██╗   Redzy · Rijad Kuloglija",
      "██████╔╝   Lead Software Developer",
      "██╔══██╗ ",
      "██║  ██║   Send a signal → " + profile.email,
      "╚═╝  ╚═╝ ",
    ].join("\n");
    console.log("%c" + art, "color:#FF4A26;font-family:ui-monospace,monospace;font-size:12px;line-height:1.2");
  }, []);
  return null;
}
```

- [ ] **Step 6: Write Navbar and MobileMenu**

`components/ui/Navbar.tsx`:

```tsx
import Link from "next/link";
import { Lockup } from "@/components/brand/Lockup";
import { Icon } from "@/components/brand/Icon";
import { Pill } from "./Pill";
import { MobileMenu } from "./MobileMenu";
import { profile } from "@/content/profile";

export const NAV = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
];

export function Navbar({ backLink }: { backLink?: boolean }) {
  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      className="fixed inset-x-0 top-0 z-50 h-16 border-b border-hairline/60 bg-canvas/80 backdrop-blur-md"
    >
      <div className="container-site flex h-full items-center gap-6">
        <Link href="/" aria-label="Redzy home" transitionTypes={["nav-back"]} className="shrink-0">
          <Lockup size={20} />
        </Link>
        {backLink && (
          <Link href="/#work" transitionTypes={["nav-back"]} className="eyebrow hidden items-center gap-1.5 hover:text-ink md:inline-flex">
            <Icon name="arrow-left" size={14} /> All work
          </Link>
        )}
        <nav aria-label="Primary" className="ml-auto hidden items-center gap-6 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="eyebrow transition-colors hover:text-ink">{n.label}</Link>
          ))}
          <Pill href={`mailto:${profile.email}`} external dot className="py-2">Send a signal</Pill>
        </nav>
        <MobileMenu />
      </div>
    </header>
  );
}
```

`components/ui/MobileMenu.tsx`:

```tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/brand/Icon";
import { NAV } from "./Navbar";
import { profile } from "@/content/profile";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.documentElement.style.overflow = ""; };
  }, [open]);
  return (
    <div className="ml-auto md:hidden">
      <button type="button" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((o) => !o)} className="p-2 text-ink">
        <Icon name={open ? "close" : "menu"} size={22} />
      </button>
      {open && (
        <div id="mobile-menu" className="fixed inset-0 top-16 z-40 flex flex-col bg-canvas px-6 pt-10">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="display-md border-t border-hairline py-5">{n.label}</Link>
          ))}
          <a href={`mailto:${profile.email}`} className="mt-auto mb-10 border-t border-hairline pt-6 font-display text-2xl font-bold tracking-tight text-signal-soft">{profile.email}</a>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 7: Write Footer**

`components/ui/Footer.tsx`:

```tsx
import { LocalTime } from "./LocalTime";
import { profile } from "@/content/profile";

export function Footer() {
  const built = process.env.NEXT_PUBLIC_BUILD_DATE ?? "dev";
  return (
    <footer className="container-site flex flex-col gap-3 border-t border-hairline py-8 md:flex-row md:items-center md:justify-between">
      <p className="eyebrow"><LocalTime /></p>
      <p className="eyebrow">Status · shipping · built {built}</p>
      <p className="eyebrow">© {new Date().getFullYear()} Redzy · {profile.name}</p>
    </footer>
  );
}
```

Set the build date in `package.json`: `"build": "NEXT_PUBLIC_BUILD_DATE=$(date -u +%Y-%m-%d) next build"`.

- [ ] **Step 8: Write PageTransition and its CSS**

`components/ui/PageTransition.tsx`:

```tsx
import { ViewTransition } from "react";

const DIRECTIONAL = { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" } as const;

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter={DIRECTIONAL} exit={DIRECTIONAL} default="none">
      {children}
    </ViewTransition>
  );
}
```

Append to `app/globals.css`:

```css
/* View transitions (spec §15.1) */
::view-transition { pointer-events: none; }
::view-transition-group(site-header) { animation: none; z-index: 100; }
::view-transition-old(site-header) { display: none; }
::view-transition-new(site-header) { animation: none; }

::view-transition-group(.morph) { animation-duration: 400ms; }
::view-transition-image-pair(.morph) { animation-name: vt-blur; }
@keyframes vt-blur { 30% { filter: blur(3px); } }

::view-transition-old(.nav-forward) { --slide-offset: -60px; animation: 150ms ease-in both vt-fade reverse, 400ms ease-in-out both vt-slide reverse; }
::view-transition-new(.nav-forward) { --slide-offset: 60px; animation: 210ms ease-out 150ms both vt-fade, 400ms ease-in-out both vt-slide; }
::view-transition-old(.nav-back) { --slide-offset: 60px; animation: 150ms ease-in both vt-fade reverse, 400ms ease-in-out both vt-slide reverse; }
::view-transition-new(.nav-back) { --slide-offset: -60px; animation: 210ms ease-out 150ms both vt-fade, 400ms ease-in-out both vt-slide; }
@keyframes vt-fade { from { opacity: 0; filter: blur(3px); } to { opacity: 1; filter: blur(0); } }
@keyframes vt-slide { from { translate: var(--slide-offset) 0; } to { translate: 0 0; } }

@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(*), ::view-transition-new(*), ::view-transition-group(*) { animation-duration: 0s !important; animation-delay: 0s !important; }
}
```

- [ ] **Step 9: Assemble the root layout**

`app/layout.tsx`:

```tsx
import type { Metadata, Viewport } from "next";
import { display, body, mono } from "./fonts";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Grain } from "@/components/ui/Grain";
import { Vignette } from "@/components/ui/Vignette";
import { FaviconSwap } from "@/components/ui/FaviconSwap";
import { ConsoleSignature } from "@/components/ui/ConsoleSignature";
import { profile } from "@/content/profile";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(`https://www.${profile.domain}`),
  title: { default: "Redzy — Rijad Kuloglija", template: "%s — Redzy" },
  description: `${profile.title}. ${profile.headline}`,
  openGraph: { type: "website", siteName: "Redzy", locale: "en_US" },
  twitter: { card: "summary_large_image" },
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }, { url: "/brand/icon-32.png", sizes: "32x32", type: "image/png" }], apple: "/brand/icon-180.png" },
};

export const viewport: Viewport = { themeColor: "#0A0908", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-canvas text-ink">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-canvas">Skip to content</a>
        <Navbar />
        <main id="main" className="pt-16">{children}</main>
        <Footer />
        <Vignette />
        <Grain />
        <FaviconSwap />
        <ConsoleSignature />
      </body>
    </html>
  );
}
```

Navbar `backLink` for case pages is handled in Task 10 by rendering a second `<Navbar backLink />`? No: keep one navbar in the layout and pass the back link through a route segment: in Task 10 the case study page renders `<BackToWork />` inside its own head instead. Remove the `backLink` prop usage from the layout (it stays available on the component for the 404 page).

- [ ] **Step 10: Build and check**

Run: `npm test && npm run build`
Expected: PASS and a successful export. `npm run dev`: navbar sticks, mobile menu opens and closes with Escape, footer shows Sarajevo time after hydration, tab switch swaps the favicon dot to grey.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat(ui): layout shell with navbar, footer, grain, vignette, favicon swap and view-transition CSS

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 7: Asset pipeline: public-site captures, portrait, Nepa media, processed outputs

**Files:**
- Create: `scripts/capture-public-sites.mjs`, `scripts/process-assets.mjs`, `assets/README.md`, `lib/media.ts`, `tests/unit/media-exists.test.ts`
- Produce: `public/media/work/<slug>/*.webp|avif|mp4`, `public/media/about/portrait-*.{webp,avif}`
- Modify: `package.json` (scripts `capture`, `assets`)

**Interfaces:**
- Consumes: `projects` and `profile` (Tasks 3–4).
- Produces: every `media.src` path referenced in `content/` exists in `public/`; `mediaSrcSet(src: string): { avif: string; webp: string }` in `lib/media.ts`.

- [ ] **Step 1: Write the existence test**

`tests/unit/media-exists.test.ts`:

```ts
import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { projects } from "../../content";

describe("media files", () => {
  it("every referenced media src and poster exists in public/", () => {
    const missing: string[] = [];
    for (const p of projects) {
      const heroes = Array.isArray(p.media.hero) ? p.media.hero : [p.media.hero];
      for (const m of [...heroes, ...p.media.gallery]) {
        if (!existsSync(`public${m.src}`)) missing.push(m.src);
        if (m.poster && !existsSync(`public${m.poster}`)) missing.push(m.poster);
      }
    }
    expect(missing).toEqual([]);
  });
  it("portrait exists", () => {
    expect(existsSync("public/media/about/portrait-1200.webp")).toBe(true);
  });
});
```

Run: `npm test` → FAIL listing all missing files.

- [ ] **Step 2: Install Playwright and capture the public sites**

```bash
npm install -D @playwright/test@^1.64
npx playwright install chromium
```

`scripts/capture-public-sites.mjs`:

```js
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const sites = {
  liblynx: ["https://www.liblynx.com/"],
  "din-solution": ["https://www.dinsolution.com/"],
  "neo-labs": ["https://www.neo-labs.ai/", "https://www.neo-care.ai/", "https://www.neo-therapy.ai/"],
  arkona: ["https://www.arkonatechnology.com/"],
  "nepa-invest": ["https://www.nepainvest.com/"],
};

const browser = await chromium.launch();
for (const [slug, urls] of Object.entries(sites)) {
  const dir = `assets/source/captures/${slug}`;
  await mkdir(dir, { recursive: true });
  for (const [i, url] of urls.entries()) {
    for (const [name, vp] of [["desktop", { width: 1600, height: 1000 }], ["mobile", { width: 390, height: 844 }]]) {
      const page = await browser.newPage({ viewport: vp, deviceScaleFactor: 2, colorScheme: "light" });
      await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
      await page.waitForTimeout(1500);
      await page.addStyleTag({ content: "[class*=cookie],[id*=cookie],[class*=consent]{display:none!important}" });
      await page.screenshot({ path: `${dir}/${i}-${name}.png` });
      await page.close();
      console.log(slug, i, name);
    }
  }
}
await browser.close();
```

Run: `node scripts/capture-public-sites.mjs`
Expected: 14 PNGs under `assets/source/captures/`. Open each desktop capture; if a cookie banner or an unloaded hero is visible, re-run that site with a longer wait or hide the element by selector in the `addStyleTag` call.

- [ ] **Step 3: Copy Nepa Invest media into source**

```bash
mkdir -p assets/source/nepa
cp ~/Desktop/NepaInvest/public/projects/villa-park-obarak/villa-park-obarak-01.jpg assets/source/nepa/render-villa-park-obarak.jpg
cp ~/Desktop/NepaInvest/public/projects/bulevar-gorazde/bulevar-gorazde-01.jpg assets/source/nepa/render-bulevar-gorazde.jpg
cp ~/Desktop/NepaInvest/public/projects/pobjeda/pobjeda-tour.mp4 assets/source/nepa/tour-pobjeda.mp4
ls -la assets/source/nepa
```

- [ ] **Step 4: Write the processing script**

`scripts/process-assets.mjs`:

```js
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";

const out = (dir) => mkdir(`public/media/${dir}`, { recursive: true });

async function image(src, dest, { width, height, fit = "cover", position = "top", gray = false }) {
  let img = sharp(src).resize({ width, height, fit, position });
  if (gray) img = img.grayscale().modulate({ brightness: 1.02 }).linear(1.08, -6);
  await img.clone().webp({ quality: 82 }).toFile(`public/media/${dest}.webp`);
  await img.clone().avif({ quality: 55 }).toFile(`public/media/${dest}.avif`);
  console.log(dest);
}

const cap = (slug, i, kind) => `assets/source/captures/${slug}/${i}-${kind}.png`;

await Promise.all(["work/liblynx", "work/din-solution", "work/neo-labs", "work/arkona", "work/nepa-invest", "about"].map(out));

// Heroes and galleries (desktop 1600x1000, mobile 800x1734)
await image(cap("liblynx", 0, "desktop"), "work/liblynx/hero-desktop-1600", { width: 1600, height: 1000 });
await image(cap("liblynx", 0, "desktop"), "work/liblynx/gallery-1-1600", { width: 1600, height: 1000, position: "bottom" });
await image(cap("liblynx", 0, "mobile"), "work/liblynx/gallery-2-800", { width: 800, height: 1734 });
await image(cap("din-solution", 0, "desktop"), "work/din-solution/hero-desktop-1600", { width: 1600, height: 1000 });
await image(cap("din-solution", 0, "mobile"), "work/din-solution/gallery-1-800", { width: 800, height: 1734 });
await image(cap("neo-labs", 0, "desktop"), "work/neo-labs/hero-labs-1600", { width: 1600, height: 1000 });
await image(cap("neo-labs", 1, "desktop"), "work/neo-labs/hero-care-1600", { width: 1600, height: 1000 });
await image(cap("neo-labs", 2, "desktop"), "work/neo-labs/hero-therapy-1600", { width: 1600, height: 1000 });
await image(cap("neo-labs", 1, "mobile"), "work/neo-labs/gallery-1-800", { width: 800, height: 1734 });
await image(cap("neo-labs", 2, "mobile"), "work/neo-labs/gallery-2-800", { width: 800, height: 1734 });
await image(cap("arkona", 0, "desktop"), "work/arkona/hero-desktop-1600", { width: 1600, height: 1000 });
await image(cap("arkona", 0, "mobile"), "work/arkona/gallery-1-800", { width: 800, height: 1734 });
await image(cap("nepa-invest", 0, "desktop"), "work/nepa-invest/hero-desktop-1600", { width: 1600, height: 1000 });
await image("assets/source/nepa/render-villa-park-obarak.jpg", "work/nepa-invest/render-villa-park-obarak-1600", { width: 1600, height: 1000, position: "centre" });
await image("assets/source/nepa/render-bulevar-gorazde.jpg", "work/nepa-invest/render-bulevar-gorazde-1600", { width: 1600, height: 1000, position: "centre" });

// Portrait: 4:5 crop, grayscale (spec §5.5)
await image("assets/source/photo/untitled-6516.jpg", "about/portrait-1200", { width: 1200, height: 1500, position: "centre", gray: true });
await image("assets/source/photo/untitled-6516.jpg", "about/portrait-2400", { width: 2400, height: 3000, position: "centre", gray: true });

// Video: 1280 wide H.264, poster from the first second (requires ffmpeg: brew install ffmpeg)
execFileSync("ffmpeg", ["-y", "-i", "assets/source/nepa/tour-pobjeda.mp4", "-vf", "scale=1280:-2", "-c:v", "libx264", "-crf", "28", "-preset", "slow", "-an", "-movflags", "+faststart", "public/media/work/nepa-invest/tour-pobjeda-1280.mp4"], { stdio: "inherit" });
execFileSync("ffmpeg", ["-y", "-ss", "1", "-i", "public/media/work/nepa-invest/tour-pobjeda-1280.mp4", "-frames:v", "1", "/tmp/tour-poster.png"], { stdio: "inherit" });
await image("/tmp/tour-poster.png", "work/nepa-invest/tour-pobjeda-poster-1280", { width: 1280, height: 720, position: "centre" });
```

Add scripts: `"capture": "node scripts/capture-public-sites.mjs"`, `"assets": "node scripts/process-assets.mjs"`.

Run: `which ffmpeg || brew install ffmpeg; npm run assets && du -sh public/media`
Expected: all files produced; `public/media` under 12 MB; the mp4 under 4 MB (raise `-crf` to 30 if larger).

- [ ] **Step 5: Write the media helper and run tests**

`lib/media.ts`:

```ts
export function mediaSrcSet(src: string): { avif: string; webp: string } {
  if (!src.endsWith(".webp")) throw new Error(`expected a .webp src, got ${src}`);
  return { webp: src, avif: src.replace(/\.webp$/, ".avif") };
}
```

Run: `npm test`
Expected: PASS, including `media files` tests.

- [ ] **Step 6: Document the pipeline and commit**

`assets/README.md`:

```md
# Source assets (gitignored)

- `photo/` owner portraits (originals). About uses `untitled-6516.jpg`.
- `captures/<slug>/` Playwright captures of public sites (`npm run capture`).
- `app-screenshots/<slug>/` owner-supplied screenshots of apps behind login (LibLynx report builder, GumaMax, Neo panels). When present, point `content/work/<slug>.ts` media at processed versions and add the jobs to `scripts/process-assets.mjs`.
- `nepa/` renders and a tour video copied from the NepaInvest repo (owner approved).
- `din-screenshots/` fallback captures from the DIN joint portfolio.

Processed outputs live in `public/media` and are committed. Re-run `npm run assets` after changing sources.
```

```bash
git add -A
git commit -m "feat(assets): capture and processing pipeline, processed work media and portrait

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---
### Task 8: Picture, ProductFrame, static Hero and the Selected-work chapters

**Files:**
- Create: `components/ui/Picture.tsx`, `components/work/ProductFrame.tsx`, `components/hero/Hero.tsx`, `components/hero/HeroPoster.tsx`, `components/hero/AvailabilityBadge.tsx`, `components/home/WorkChapters.tsx`, `tests/unit/product-frame.test.tsx`
- Modify: `app/page.tsx`, `app/globals.css`

**Interfaces:**
- Consumes: `Media`, `Project`, `projects`, `profile`; `Pill`, `Eyebrow`, `Monogram`, `Icon`, `Aura`; `mediaSrcSet`.
- Produces:
  - `<Picture media={Media} sizes={string} priority?: boolean className? />` renders `<picture>` with AVIF + WebP sources (or `<video>` for `kind: 'video'`).
  - `<ProductFrame media={Media} slug={string} url?: string sizes? priority? className? />` with `ViewTransition name={`frame-${slug}`} share="morph"`; `data-frame={slug}` on the root so Plan 2 can attach sweeps and tilt.
  - `<Hero />`, `<WorkChapters />` sections with ids `hero` and `work`.

- [ ] **Step 1: Write the ProductFrame test**

`tests/unit/product-frame.test.tsx`:

```tsx
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProductFrame } from "../../components/work/ProductFrame";

const media = { src: "/media/work/liblynx/hero-desktop-1600.webp", alt: "LibLynx hero", kind: "desktop" as const, width: 1600, height: 1000 };

describe("ProductFrame", () => {
  it("renders avif+webp sources, the url bar and a data-frame hook", () => {
    const html = renderToStaticMarkup(<ProductFrame media={media} slug="liblynx" url="liblynx.com" />);
    expect(html).toContain('type="image/avif"');
    expect(html).toContain("/media/work/liblynx/hero-desktop-1600.avif");
    expect(html).toContain('data-frame="liblynx"');
    expect(html).toContain("liblynx.com");
    expect(html).toContain('alt="LibLynx hero"');
  });
  it("renders a muted looping video for video media", () => {
    const html = renderToStaticMarkup(
      <ProductFrame media={{ ...media, kind: "video", src: "/media/work/x/tour.mp4", poster: "/media/work/x/poster.webp" }} slug="x" />,
    );
    expect(html).toMatch(/<video[^>]*muted/);
    expect(html).toMatch(/<video[^>]*loop/);
    expect(html).toMatch(/<video[^>]*playsinline/i);
  });
});
```

Run: `npm test` → FAIL.

- [ ] **Step 2: Write Picture**

`components/ui/Picture.tsx`:

```tsx
import type { Media } from "@/content/schema";
import { mediaSrcSet } from "@/lib/media";

type Props = { media: Media; sizes?: string; priority?: boolean; className?: string };

export function Picture({ media, sizes = "100vw", priority = false, className = "" }: Props) {
  if (media.kind === "video") {
    return (
      <video
        className={className}
        src={media.src}
        poster={media.poster}
        width={media.width}
        height={media.height}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        aria-label={media.alt}
      />
    );
  }
  const { avif, webp } = mediaSrcSet(media.src);
  return (
    <picture>
      <source type="image/avif" srcSet={avif} sizes={sizes} />
      <img
        className={className}
        src={webp}
        alt={media.alt}
        width={media.width}
        height={media.height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
      />
    </picture>
  );
}
```

- [ ] **Step 3: Write ProductFrame**

`components/work/ProductFrame.tsx`:

```tsx
import { ViewTransition } from "react";
import type { Media } from "@/content/schema";
import { Picture } from "@/components/ui/Picture";

type Props = { media: Media; slug: string; url?: string; sizes?: string; priority?: boolean; className?: string; morph?: boolean };

export function ProductFrame({ media, slug, url, sizes, priority, className = "", morph = true }: Props) {
  const isMobile = media.kind === "mobile";
  const frame = (
    <figure
      data-frame={slug}
      className={`relative overflow-hidden rounded-[var(--radius-frame)] border border-hairline bg-surface-1 p-2.5 shadow-[0_30px_80px_rgba(0,0,0,.6)] ring-1 ring-signal/10 ${isMobile ? "mx-auto max-w-[320px]" : ""} ${className}`}
    >
      <div className="flex items-center gap-1.5 px-1.5 pb-2.5 pt-1">
        <span className="h-2 w-2 rounded-full bg-hairline-strong" /><span className="h-2 w-2 rounded-full bg-hairline-strong" /><span className="h-2 w-2 rounded-full bg-hairline-strong" />
        {url && <span className="eyebrow ml-2 normal-case tracking-[0.06em] text-ink-muted/80">{url}</span>}
      </div>
      <Picture media={media} sizes={sizes ?? (isMobile ? "320px" : "(min-width: 1024px) 60vw, 100vw")} priority={priority} className="block w-full rounded-md" />
      <span aria-hidden data-sweep className="pointer-events-none absolute inset-x-0 -top-1/2 h-1/2 opacity-0" style={{ background: "linear-gradient(180deg, rgba(255,74,38,0), rgba(255,74,38,.22), rgba(255,74,38,0))" }} />
    </figure>
  );
  if (!morph) return frame;
  return (
    <ViewTransition name={`frame-${slug}`} share="morph" default="none">
      {frame}
    </ViewTransition>
  );
}
```

Run: `npm test` → PASS.

- [ ] **Step 4: Write the static hero**

`components/hero/AvailabilityBadge.tsx`:

```tsx
import { profile } from "@/content/profile";

export function AvailabilityBadge({ className = "" }: { className?: string }) {
  if (!profile.availability) return null;
  return (
    <p className={`eyebrow inline-flex items-center gap-2 ${className}`}>
      <span aria-hidden className="relative inline-flex h-2 w-2">
        <span className="absolute inset-0 rounded-full bg-signal motion-safe:animate-ping opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
      </span>
      {profile.availability}
    </p>
  );
}
```

`components/hero/HeroPoster.tsx` (Plan 1 version: SVG monogram with a CSS glow; Plan 2 swaps in the 3D scene and a rendered poster):

```tsx
import { Monogram } from "@/components/brand/Monogram";

export function HeroPoster() {
  return (
    <div data-hero-poster className="relative mx-auto aspect-square w-[min(72vw,520px)] lg:w-[min(38vw,620px)]">
      <div aria-hidden className="absolute inset-[-20%] rounded-full" style={{ background: "radial-gradient(circle at 46% 36%, rgba(255,74,38,.28), rgba(255,74,38,.06) 35%, transparent 60%)" }} />
      <Monogram size={620} className="relative h-full w-full text-[#1C1A18] [filter:drop-shadow(0_0_24px_rgba(255,74,38,.35))]" title="Redzy monogram" glow={false} />
    </div>
  );
}
```

`components/hero/Hero.tsx`:

```tsx
import { Pill } from "@/components/ui/Pill";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { HeroPoster } from "./HeroPoster";
import { AvailabilityBadge } from "./AvailabilityBadge";
import { profile } from "@/content/profile";

export function Hero() {
  return (
    <section id="hero" data-hero className="relative min-h-[calc(100dvh-4rem)] overflow-hidden">
      <div className="container-site grid min-h-[calc(100dvh-4rem)] items-center gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Eyebrow>{profile.name} · {profile.title} · Sarajevo</Eyebrow>
          <h1 data-split className="display-xl mt-6 max-w-[14ch] text-balance">{profile.headline}</h1>
          <p data-split className="mt-8 max-w-[48ch] text-lg leading-relaxed text-ink-soft md:text-xl">{profile.lead}</p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Pill href={`mailto:${profile.email}`} external dot>Send a signal</Pill>
            <Pill href="/#work" variant="outline">Selected work</Pill>
          </div>
          <AvailabilityBadge className="mt-8" />
        </div>
        <div className="lg:col-span-5"><HeroPoster /></div>
      </div>
    </section>
  );
}
```

The `h-full w-full` classes override the SVG `width`/`height` attributes, so the monogram scales with its container while `size={620}` keeps the 5-unit dot radius.

- [ ] **Step 5: Write WorkChapters (CSS sticky stacking)**

`components/home/WorkChapters.tsx`:

```tsx
import Link from "next/link";
import { projects } from "@/content";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/brand/Icon";
import { Aura } from "@/components/brand/Aura";
import { ProductFrame } from "@/components/work/ProductFrame";

export function WorkChapters() {
  return (
    <section id="work" data-chapters className="relative">
      <div className="container-site pb-6 pt-24 md:pt-32">
        <Eyebrow>01 — Selected work</Eyebrow>
        <h2 data-split className="display-lg mt-4 max-w-[16ch]">Real products, in production.</h2>
      </div>
      <ol className="relative">
        {projects.map((p, i) => {
          const hero = Array.isArray(p.media.hero) ? p.media.hero[0] : p.media.hero;
          return (
            <li
              key={p.slug}
              data-chapter={p.slug}
              style={{ zIndex: i + 1 }}
              className="sticky top-16 min-h-[calc(100dvh-4rem)] border-t border-hairline bg-canvas"
            >
              <Aura seed={p.slug} className="absolute inset-0 opacity-[0.08]" />
              <div className="container-site relative grid min-h-[calc(100dvh-4rem)] items-center gap-10 py-16 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <p className="eyebrow text-signal">{String(p.index).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</p>
                  <p className="eyebrow mt-3">{p.categories.join(" · ")}</p>
                  <h3 className="display-lg mt-5">{p.name}</h3>
                  <p className="mt-5 max-w-[40ch] text-lg text-ink-soft">{p.oneLiner}</p>
                  <p className="eyebrow mt-6 normal-case tracking-normal text-ink-muted">{p.role} · {p.stack.slice(0, 4).join(" · ")}</p>
                  <Link href={`/work/${p.slug}/`} transitionTypes={["nav-forward"]} className="mt-8 inline-flex items-center gap-2 font-medium text-ink hover:text-signal-soft">
                    Read case study <Icon name="arrow-up-right" size={16} />
                  </Link>
                </div>
                <div className="lg:col-span-7">
                  <Link href={`/work/${p.slug}/`} transitionTypes={["nav-forward"]} aria-label={`Open ${p.name} case study`} className="block">
                    <ProductFrame media={hero} slug={p.slug} url={p.live?.label} priority={i === 0} />
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
```

Append to `app/globals.css` (stacking off on small screens):

```css
@media (max-width: 1023px) {
  [data-chapters] li { position: static; min-height: 0; }
}
```

- [ ] **Step 6: Assemble the home page**

`app/page.tsx`:

```tsx
import { PageTransition } from "@/components/ui/PageTransition";
import { Hero } from "@/components/hero/Hero";
import { WorkChapters } from "@/components/home/WorkChapters";

export default function Home() {
  return (
    <PageTransition>
      <Hero />
      <WorkChapters />
    </PageTransition>
  );
}
```

- [ ] **Step 7: Verify in the browser**

Run: `npm run build && npm run dev`
Check at 1440 px: hero fills the viewport with the monogram glowing on the right; scrolling stacks five chapters, each covering the previous; clicking a frame navigates to `/work/liblynx/` (404 until Task 10 — that is expected). At 390 px: chapters are plain sections with the frame above the text. Lighthouse (Chrome devtools, mobile) Performance ≥ 90 on `/`.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(home): static hero, product frames with shared-element names, sticky work chapters

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---
### Task 9: Home sections: Companies, About, Experience, Lab, Contact

**Files:**
- Create: `components/home/Companies.tsx`, `components/home/About.tsx`, `components/home/Experience.tsx`, `components/home/ExperienceList.tsx`, `components/home/Lab.tsx`, `components/home/Contact.tsx`, `components/home/CopyEmailButton.tsx`, `lib/format.ts`, `tests/unit/format.test.ts`
- Modify: `app/page.tsx`, `app/globals.css`

**Interfaces:**
- Consumes: `profile`, `projects`, `Eyebrow`, `Pill`, `Icon`, `Monogram`, `Aura`, `Picture`.
- Produces: `formatPeriod(start: string, end: string | null): string` ("2025 — now", "2024 — 2025", "2024"); sections with ids `about`, `experience`, `lab`, `contact`; `data-row` and `data-preview="<slug>"` hooks on experience/lab rows for Plan 2 hover previews.

- [ ] **Step 1: Write the period formatter test**

`tests/unit/format.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { formatPeriod } from "../../lib/format";

describe("formatPeriod", () => {
  it("formats open, multi-year and single-year ranges", () => {
    expect(formatPeriod("2025-07", null)).toBe("2025 — now");
    expect(formatPeriod("2024-03", "2025-10")).toBe("2024 — 2025");
    expect(formatPeriod("2024-02", "2024-05")).toBe("2024");
  });
});
```

Run: `npm test` → FAIL.

- [ ] **Step 2: Write the formatter**

`lib/format.ts`:

```ts
export function formatPeriod(start: string, end: string | null): string {
  const s = start.slice(0, 4);
  if (end === null) return `${s} — now`;
  const e = end.slice(0, 4);
  return s === e ? s : `${s} — ${e}`;
}

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}
```

Run: `npm test` → PASS.

- [ ] **Step 3: Write Companies (display-size marquee)**

`components/home/Companies.tsx`:

```tsx
import { profile } from "@/content/profile";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function Companies() {
  const names = [...profile.companies, ...profile.companies];
  return (
    <section aria-label="Products and companies" className="relative border-t border-hairline bg-canvas py-14 md:py-20">
      <div className="container-site"><Eyebrow>Products and companies I've built for</Eyebrow></div>
      <div className="group mt-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <ul className="flex w-max gap-12 whitespace-nowrap motion-safe:animate-[marquee_60s_linear_infinite] group-hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
          {names.map((n, i) => (
            <li key={`${n}-${i}`} aria-hidden={i >= profile.companies.length} className="display-md text-ink-muted transition-colors hover:text-ink">
              <span className="decoration-signal underline-offset-8 hover:underline">{n}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

Append to `app/globals.css`:

```css
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
```

- [ ] **Step 4: Write About**

`components/home/About.tsx`:

```tsx
import { profile } from "@/content/profile";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Aura } from "@/components/brand/Aura";

export function About() {
  const portrait = { src: "/media/about/portrait-1200.webp", alt: `${profile.name}, portrait by a window`, kind: "desktop" as const, width: 1200, height: 1500 };
  return (
    <section id="about" className="relative border-t border-hairline py-24 md:py-40">
      <div className="container-site grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="relative overflow-hidden rounded-[var(--radius-frame)] border border-hairline">
            <picture>
              <source type="image/avif" srcSet="/media/about/portrait-1200.avif 1200w, /media/about/portrait-2400.avif 2400w" sizes="(min-width:1024px) 30vw, 90vw" />
              <img src={portrait.src} srcSet="/media/about/portrait-1200.webp 1200w, /media/about/portrait-2400.webp 2400w" sizes="(min-width:1024px) 30vw, 90vw" alt={portrait.alt} width={portrait.width} height={portrait.height} loading="lazy" decoding="async" className="block w-full" />
            </picture>
            <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-screen" style={{ background: "linear-gradient(90deg, rgba(255,74,38,0) 45%, rgba(255,74,38,.38))" }} />
            <Aura seed="rijad" className="pointer-events-none absolute inset-0 opacity-30 mix-blend-screen" />
          </div>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <Eyebrow>02 — About</Eyebrow>
          <h2 data-split className="display-lg mt-4 max-w-[16ch]">Frontend architecture, backed by real backend work.</h2>
          <p data-split className="mt-8 max-w-[62ch] text-lg leading-relaxed text-ink-soft">{profile.about}</p>
          <div className="mt-12 grid gap-10 sm:grid-cols-2">
            <div>
              <Eyebrow>Strengths</Eyebrow>
              <ul className="mt-4 divide-y divide-hairline">
                {profile.strengths.map((s) => <li key={s} className="py-3 text-ink">{s}</li>)}
              </ul>
            </div>
            <div>
              <Eyebrow>Core stack</Eyebrow>
              <div className="mt-4 space-y-4">
                {profile.stack.map((g) => (
                  <div key={g.group}>
                    <p className="eyebrow text-ink-muted/70">{g.group}</p>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {g.items.map((i) => <li key={i} className="rounded-md border border-hairline bg-surface-1 px-2 py-1 font-mono text-[11px] tracking-[0.06em] text-ink-soft">{i}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="eyebrow mt-12">{profile.location} · Building since {profile.since} · {profile.education[0].degree}, {profile.education[0].school.split(",")[0]} · {profile.languages.map((l) => l.name.slice(0, 2).toUpperCase()).join(" / ")}</p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Write Experience with "Show all"**

`components/home/ExperienceList.tsx`:

```tsx
"use client";
import { useState } from "react";
import type { Role } from "@/content/schema";
import { formatPeriod } from "@/lib/format";
import { Icon } from "@/components/brand/Icon";

export function ExperienceList({ roles }: { roles: Role[] }) {
  const [all, setAll] = useState(false);
  const shown = all ? roles : roles.slice(0, 5);
  return (
    <>
      <ol className="mt-10 border-t border-hairline">
        {shown.map((r) => (
          <li key={`${r.company}-${r.start}`} data-row data-preview={r.projectSlug} className="group grid gap-2 border-b border-hairline py-5 transition-colors hover:border-signal/60 md:grid-cols-12 md:items-baseline md:gap-6">
            <p className={`eyebrow md:col-span-2 ${r.current ? "text-signal" : ""}`}>{formatPeriod(r.start, r.end)}</p>
            <div className="md:col-span-7">
              <p className="headline text-ink">{r.company} <span className="text-ink-muted">·</span> {r.titleProgression ?? r.title}</p>
              <p className="mt-1.5 max-w-[62ch] text-ink-soft">{r.summary}</p>
            </div>
            <p className="eyebrow md:col-span-3 md:text-right">{r.location} · {r.mode}</p>
          </li>
        ))}
      </ol>
      {roles.length > 5 && (
        <button type="button" onClick={() => setAll((a) => !a)} aria-expanded={all} className="mt-6 inline-flex items-center gap-2 font-medium text-ink hover:text-signal-soft">
          {all ? "Show fewer" : `Show all ${roles.length} roles`} <Icon name={all ? "arrow-up-right" : "arrow-right"} size={16} />
        </button>
      )}
    </>
  );
}
```

`components/home/Experience.tsx`:

```tsx
import { profile } from "@/content/profile";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ExperienceList } from "./ExperienceList";

export function Experience() {
  return (
    <section id="experience" className="border-t border-hairline py-24 md:py-40">
      <div className="container-site">
        <div className="flex items-end justify-between gap-6">
          <div>
            <Eyebrow>03 — Experience</Eyebrow>
            <h2 data-split className="display-lg mt-4">{profile.since} → now</h2>
          </div>
          <p className="eyebrow hidden md:block">{profile.roles.length} roles · {profile.roles.filter((r) => r.current).length} current</p>
        </div>
        <ExperienceList roles={profile.roles} />
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Write Lab**

`components/home/Lab.tsx`:

```tsx
import { profile } from "@/content/profile";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/brand/Icon";

export function Lab() {
  return (
    <section id="lab" className="border-t border-hairline py-24 md:py-32">
      <div className="container-site">
        <Eyebrow>04 — Lab &amp; more work</Eyebrow>
        <ol className="mt-8 border-t border-hairline">
          {profile.lab.map((item) => (
            <li key={item.name} data-row data-preview={item.previewSlug} className="grid gap-2 border-b border-hairline py-4 md:grid-cols-12 md:items-baseline md:gap-6">
              <p className="eyebrow md:col-span-2">{item.year}</p>
              <div className="md:col-span-7">
                <p className="font-medium text-ink">{item.name}</p>
                <p className="mt-1 max-w-[62ch] text-ink-soft">{item.line}</p>
              </div>
              <div className="flex gap-4 md:col-span-3 md:justify-end">
                {item.links?.map((l) => (
                  <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="eyebrow inline-flex items-center gap-1 hover:text-ink">{l.label} <Icon name="external" size={12} /></a>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Write CopyEmailButton and Contact**

`components/home/CopyEmailButton.tsx`:

```tsx
"use client";
import { useState } from "react";
import { Icon } from "@/components/brand/Icon";

export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async (e: React.MouseEvent) => {
    if (!navigator.clipboard) return; // falls through to mailto
    e.preventDefault();
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <a href={`mailto:${email}`} onClick={copy} data-magnetic className="group inline-flex items-center gap-4 rounded-full border border-hairline-strong px-6 py-4 font-display text-xl font-bold tracking-tight text-ink transition-colors hover:border-ink-muted md:text-3xl" aria-live="polite">
      <span>{copied ? "Copied" : email}</span>
      <Icon name={copied ? "check" : "copy"} size={20} className={copied ? "text-signal" : "text-ink-muted group-hover:text-ink"} />
    </a>
  );
}
```

`components/home/Contact.tsx`:

```tsx
import { profile } from "@/content/profile";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/brand/Icon";
import { Monogram } from "@/components/brand/Monogram";
import { CopyEmailButton } from "./CopyEmailButton";
import { AvailabilityBadge } from "@/components/hero/AvailabilityBadge";

export function Contact() {
  return (
    <section id="contact" className="relative border-t border-hairline py-28 md:py-44">
      <div className="container-site">
        <Eyebrow>05 — Contact</Eyebrow>
        <div className="mt-6 flex items-center gap-6">
          <h2 data-split className="display-xl">Send a signal.</h2>
          <Monogram size={64} className="hidden text-ink md:block" title="Redzy monogram" />
        </div>
        <div className="mt-12 flex flex-col items-start gap-6">
          <CopyEmailButton email={profile.email} />
          <div className="flex flex-wrap gap-6">
            <a href={profile.links.github} target="_blank" rel="noreferrer" className="eyebrow inline-flex items-center gap-2 hover:text-ink"><Icon name="github" size={16} /> GitHub</a>
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="eyebrow inline-flex items-center gap-2 hover:text-ink"><Icon name="linkedin" size={16} /> LinkedIn</a>
            <a href="/Rijad-Kuloglija-CV.pdf" className="eyebrow inline-flex items-center gap-2 hover:text-ink"><Icon name="download" size={16} /> Download CV (PDF)</a>
            <a href="/cv/" className="eyebrow inline-flex items-center gap-2 hover:text-ink"><Icon name="arrow-up-right" size={16} /> CV page</a>
          </div>
          <AvailabilityBadge />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 8: Add sections to the home page**

`app/page.tsx`:

```tsx
import { PageTransition } from "@/components/ui/PageTransition";
import { Hero } from "@/components/hero/Hero";
import { WorkChapters } from "@/components/home/WorkChapters";
import { Companies } from "@/components/home/Companies";
import { About } from "@/components/home/About";
import { Experience } from "@/components/home/Experience";
import { Lab } from "@/components/home/Lab";
import { Contact } from "@/components/home/Contact";

export default function Home() {
  return (
    <PageTransition>
      <Hero />
      <WorkChapters />
      <Companies />
      <About />
      <Experience />
      <Lab />
      <Contact />
    </PageTransition>
  );
}
```

- [ ] **Step 9: Verify and commit**

Run: `npm test && npm run build && npm run dev`
Check: marquee scrolls and pauses on hover; portrait is grayscale with a red light edge on the right; experience shows five rows, "Show all 10 roles" expands; email button copies and flips to "Copied"; all anchors from the navbar land on the right sections (offset by the 64 px navbar: add `scroll-margin-top: 4rem` to `section[id]` in `globals.css`).

```bash
git add -A
git commit -m "feat(home): companies marquee, about, experience, lab and contact sections

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---
### Task 10: Case study pages

**Files:**
- Create: `app/work/[slug]/page.tsx`, `components/work/CaseStudy.tsx`, `components/work/HeroTabs.tsx`, `components/work/Gallery.tsx`, `components/work/NextProject.tsx`, `components/work/BackToWork.tsx`, `components/work/ReadingProgress.tsx`
- Test: `tests/e2e/routes.spec.ts` (first e2e file; the runner config is in Task 13 Step 1, create it now if missing)

**Interfaces:**
- Consumes: `getProject`, `nextProject`, `projectSlugs`, `profile`; `ProductFrame`, `Picture`, `Aura`, `Eyebrow`, `Pill`, `Icon`, `PageTransition`.
- Produces: static routes `/work/<slug>/` for the five slugs; `data-reading-progress` bar hook for Plan 2.

- [ ] **Step 1: Write the failing route test**

`playwright.config.ts` (also used by Task 13):

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  retries: 0,
  use: { baseURL: "http://localhost:4173", trace: "retain-on-failure" },
  webServer: { command: "npx serve out -l 4173 --no-clipboard", url: "http://localhost:4173", reuseExistingServer: true, timeout: 60_000 },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
    { name: "reduced-motion", use: { ...devices["Desktop Chrome"], reducedMotion: "reduce" } },
  ],
});
```

```bash
npm install -D serve@^14
```

Add script `"e2e": "npm run build && playwright test"`.

`tests/e2e/routes.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

const routes: Array<[string, RegExp]> = [
  ["/", /Software that keeps working after launch/],
  ["/work/liblynx/", /LibLynx report builder/],
  ["/work/din-solution/", /DIN Solution/],
  ["/work/neo-labs/", /Neo Labs/],
  ["/work/arkona/", /Arkona \+ GumaMax/],
  ["/work/nepa-invest/", /Nepa Invest/],
];

for (const [path, h1] of routes) {
  test(`${path} renders its H1`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText(h1);
  });
}

test("case study links to next project and back to work", async ({ page }) => {
  await page.goto("/work/nepa-invest/");
  await expect(page.getByRole("link", { name: /Next · 01/ })).toHaveAttribute("href", "/work/liblynx/");
  await page.getByRole("link", { name: /All work/ }).first().click();
  await expect(page).toHaveURL(/\/#work$/);
});
```

Run: `npm run e2e`
Expected: FAIL on `/work/*` (404).

- [ ] **Step 2: Write the small components**

`components/work/BackToWork.tsx`:

```tsx
import Link from "next/link";
import { Icon } from "@/components/brand/Icon";

export function BackToWork() {
  return (
    <Link href="/#work" transitionTypes={["nav-back"]} className="eyebrow inline-flex items-center gap-1.5 hover:text-ink">
      <Icon name="arrow-left" size={14} /> All work
    </Link>
  );
}
```

`components/work/ReadingProgress.tsx` (CSS scroll-driven, no JS):

```tsx
export function ReadingProgress() {
  return <div aria-hidden data-reading-progress className="fixed left-0 top-16 z-40 h-0.5 w-full origin-left bg-signal [animation:reading-progress_linear_both] [animation-timeline:scroll()]" />;
}
```

Append to `app/globals.css`:

```css
@keyframes reading-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@supports not (animation-timeline: scroll()) { [data-reading-progress] { display: none; } }
```

`components/work/HeroTabs.tsx` (Neo Labs: three heroes as tabs):

```tsx
"use client";
import { useState } from "react";
import type { Media } from "@/content/schema";
import { ProductFrame } from "./ProductFrame";

export function HeroTabs({ heroes, slug, url }: { heroes: Media[]; slug: string; url?: string }) {
  const [i, setI] = useState(0);
  return (
    <div>
      <div role="tablist" aria-label="Products" className="mb-4 flex gap-2">
        {heroes.map((h, idx) => (
          <button key={h.src} role="tab" aria-selected={i === idx} onClick={() => setI(idx)} className={`eyebrow rounded-full border px-3 py-1.5 transition-colors ${i === idx ? "border-signal text-ink" : "border-hairline hover:text-ink"}`}>
            {h.caption ?? `0${idx + 1}`}
          </button>
        ))}
      </div>
      <ProductFrame media={heroes[i]} slug={slug} url={url} priority morph={i === 0} />
    </div>
  );
}
```

`components/work/Gallery.tsx`:

```tsx
import type { Media } from "@/content/schema";
import { ProductFrame } from "./ProductFrame";

export function Gallery({ items, slug }: { items: Media[]; slug: string }) {
  if (items.length === 0) return null;
  return (
    <ul className="grid gap-5 md:grid-cols-[2fr_1fr]">
      {items.map((m, i) => (
        <li key={m.src} className={m.kind === "mobile" ? "" : "md:col-span-1"}>
          <ProductFrame media={m} slug={`${slug}-g${i}`} morph={false} />
          {m.caption && <p className="eyebrow mt-3">{m.caption}</p>}
        </li>
      ))}
    </ul>
  );
}
```

`components/work/NextProject.tsx`:

```tsx
import Link from "next/link";
import type { Project } from "@/content/schema";
import { Icon } from "@/components/brand/Icon";
import { pad2 } from "@/lib/format";

export function NextProject({ project }: { project: Project }) {
  return (
    <Link href={`/work/${project.slug}/`} transitionTypes={["nav-forward"]} className="group flex items-center justify-between gap-6 rounded-[var(--radius-frame)] border border-hairline p-7 transition-colors hover:border-signal/60 md:p-9" style={{ background: "linear-gradient(90deg, rgba(255,74,38,.06), rgba(255,74,38,0))" }}>
      <div>
        <p className="eyebrow">Next · {pad2(project.index)} / 05</p>
        <p className="display-md mt-2">{project.name}</p>
        <p className="mt-1 text-ink-muted">{project.oneLiner}</p>
      </div>
      <Icon name="arrow-right" size={28} className="shrink-0 text-signal transition-transform group-hover:translate-x-1" />
    </Link>
  );
}
```

- [ ] **Step 3: Write CaseStudy**

`components/work/CaseStudy.tsx`:

```tsx
import type { Project } from "@/content/schema";
import { profile } from "@/content/profile";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Pill } from "@/components/ui/Pill";
import { Aura } from "@/components/brand/Aura";
import { Icon } from "@/components/brand/Icon";
import { ProductFrame } from "./ProductFrame";
import { HeroTabs } from "./HeroTabs";
import { Gallery } from "./Gallery";
import { NextProject } from "./NextProject";
import { BackToWork } from "./BackToWork";
import { ReadingProgress } from "./ReadingProgress";
import { pad2 } from "@/lib/format";

const SECTIONS: Array<[keyof Project["body"], string]> = [
  ["overview", "Overview"], ["problem", "Problem"], ["contribution", "Contribution"], ["engineering", "Engineering"],
];

export function CaseStudy({ project, next }: { project: Project; next: Project }) {
  const heroes = Array.isArray(project.media.hero) ? project.media.hero : [project.media.hero];
  const subject = encodeURIComponent(`About ${project.name}`);
  return (
    <article className="relative">
      <ReadingProgress />
      <Aura seed={project.slug} className="pointer-events-none absolute inset-x-0 top-0 h-[520px] opacity-[0.18] [mask-image:linear-gradient(180deg,#000,transparent)]" />
      <div className="container-site relative pt-10 md:pt-14">
        <BackToWork />
        <header className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow><span className="text-signal">{pad2(project.index)} / 05</span> &nbsp;·&nbsp; {project.categories.join(" · ")}</Eyebrow>
            <h1 data-split className="display-xl mt-5 max-w-[12ch]">{project.name}</h1>
            <p data-split className="mt-5 max-w-[30ch] text-xl leading-snug text-ink-soft">{project.oneLiner}</p>
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 lg:col-span-5">
            <div className="border-t border-hairline pt-3"><dt className="eyebrow">Role</dt><dd className="mt-1.5 text-ink">{project.role}{project.roleNote && <span className="block text-sm text-ink-muted">{project.roleNote}</span>}</dd></div>
            <div className="border-t border-hairline pt-3"><dt className="eyebrow">Period</dt><dd className="mt-1.5 text-ink">{project.period}</dd></div>
            <div className="border-t border-hairline pt-3"><dt className="eyebrow">Stack</dt><dd className="mt-1.5 text-sm leading-relaxed text-ink">{project.stack.join(" · ")}</dd></div>
            <div className="border-t border-hairline pt-3"><dt className="eyebrow">Live</dt><dd className="mt-1.5">{project.live ? <a href={project.live.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-signal-soft hover:text-ink">{project.live.label} <Icon name="arrow-up-right" size={14} /></a> : <span className="text-ink-muted">Private</span>}</dd></div>
          </dl>
        </header>

        <div className="mt-12 md:mt-16">
          {heroes.length > 1 ? <HeroTabs heroes={heroes} slug={project.slug} url={project.live?.label} /> : <ProductFrame media={heroes[0]} slug={project.slug} url={project.live?.label} priority />}
        </div>

        <div className="mt-16 grid md:mt-24 md:grid-cols-[200px_1fr]">
          {SECTIONS.map(([key, label]) => (
            <div key={key} className="contents">
              <h2 className="eyebrow border-t border-hairline pt-7 md:pb-7">{label}</h2>
              <p data-split className="max-w-[62ch] border-t border-hairline pb-7 pt-3 text-base leading-relaxed text-ink-soft md:pt-7 md:text-lg">{project.body[key]}</p>
            </div>
          ))}
          <h2 className="eyebrow border-t border-hairline pt-7 md:pb-7">Delivered</h2>
          <ul className="border-t border-hairline pb-7 pt-3 md:pt-7">
            {project.delivered.map((d) => <li key={d} className="flex gap-4 border-b border-surface-2 py-2.5 text-ink-soft"><span aria-hidden className="text-signal">—</span>{d}</li>)}
          </ul>
        </div>

        <div className="mt-12"><Gallery items={project.media.gallery} slug={project.slug} /></div>

        <div className="mt-14 flex flex-wrap gap-3">
          {project.live && <Pill href={project.live.url} external dot>Visit {project.live.label}</Pill>}
          <Pill href={`mailto:${profile.email}?subject=${subject}`} external variant="outline">Ask me about this project</Pill>
        </div>

        <div className="mb-24 mt-16"><NextProject project={next} /></div>
      </div>
    </article>
  );
}
```

- [ ] **Step 4: Write the route**

`app/work/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProject, nextProject, projectSlugs } from "@/content";
import { CaseStudy } from "@/components/work/CaseStudy";
import { PageTransition } from "@/components/ui/PageTransition";

export const dynamicParams = false;

export function generateStaticParams() {
  return projectSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return { title: p.name, description: p.oneLiner, alternates: { canonical: `/work/${p.slug}/` } };
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return (
    <PageTransition>
      <CaseStudy project={project} next={nextProject(slug)} />
    </PageTransition>
  );
}
```

- [ ] **Step 5: Run the e2e test**

Run: `npm run e2e -- --project=desktop`
Expected: PASS for all six routes and the next/back test.

Manual check in `npm run dev` (Chrome): click a chapter frame on the home page; the screenshot should morph into the case study hero frame (same `frame-<slug>` name) while the page slides left; "All work" slides back. Open the Neo Labs page and switch tabs.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(work): case study route and template with shared-element transitions

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---
### Task 11: CV page and generated PDF

**Files:**
- Create: `app/cv/page.tsx`, `components/cv/Cv.tsx`, `scripts/build-cv-pdf.mjs`, `tests/unit/cv-pdf.test.ts`, `tests/e2e/cv.spec.ts`
- Modify: `app/globals.css` (print rules), `package.json` (`postbuild`, `pdf-lib`), `public/Rijad-Kuloglija-CV.pdf` (regenerated)

**Interfaces:**
- Consumes: `profile`, `projects`, `formatPeriod`, `Monogram`.
- Produces: `/cv/` route; `out/Rijad-Kuloglija-CV.pdf` and `public/Rijad-Kuloglija-CV.pdf` (2 pages, A4).

- [ ] **Step 1: Write the PDF test (fails until the script exists)**

```bash
npm install -D pdf-lib@^1.17
```

`tests/unit/cv-pdf.test.ts`:

```ts
import { existsSync, readFileSync, statSync } from "node:fs";
import { PDFDocument } from "pdf-lib";
import { describe, expect, it } from "vitest";

describe("CV PDF", () => {
  it("exists, is A4 and has exactly 2 pages", async () => {
    const path = "public/Rijad-Kuloglija-CV.pdf";
    expect(existsSync(path)).toBe(true);
    expect(statSync(path).size).toBeGreaterThan(20_000);
    const doc = await PDFDocument.load(readFileSync(path));
    expect(doc.getPageCount()).toBe(2);
    const { width, height } = doc.getPage(0).getSize();
    expect(Math.round(width)).toBe(595);
    expect(Math.round(height)).toBe(842);
  });
});
```

Run: `npm test` → FAIL (old PDF is a different page count/size or will be after regeneration).

- [ ] **Step 2: Write the Cv component**

`components/cv/Cv.tsx`:

```tsx
import { profile } from "@/content/profile";
import { projects } from "@/content";
import { formatPeriod } from "@/lib/format";
import { Monogram } from "@/components/brand/Monogram";

const built = process.env.NEXT_PUBLIC_BUILD_DATE ?? "dev";

export function Cv() {
  const roles = profile.roles.filter((r) => r.showOnCv);
  return (
    <div className="cv mx-auto max-w-[800px] bg-paper px-8 py-10 text-paper-ink md:px-12 md:py-14 print:max-w-none print:px-0 print:py-0">
      <section className="cv-page">
        <header className="flex items-end justify-between gap-6 border-b border-paper-ink pb-4">
          <div>
            <p className="eyebrow inline-flex items-center gap-2 text-paper-ink/70"><Monogram size={12} glow={false} className="text-paper-ink" /> {profile.title}</p>
            <h1 className="mt-2 font-display text-[34px] font-extrabold leading-none tracking-[-0.03em]">{profile.name}</h1>
          </div>
          <address className="eyebrow not-italic text-right normal-case tracking-[0.04em] leading-[1.7] text-paper-ink/80">
            <a href={`mailto:${profile.email}`}>{profile.email}</a><br />
            <a href={`https://www.${profile.domain}`}>{profile.domain}</a><br />
            <a href={profile.links.github}>github.com/DeveloperRedzy</a><br />
            <a href={profile.links.linkedin}>linkedin.com/in/rijad-kuloglija</a><br />
            {profile.location} · Remote
          </address>
        </header>

        <p className="mt-5 max-w-[72ch] text-[13px] leading-relaxed text-paper-ink/85">{profile.about}</p>

        <h2 className="cv-h">Experience <span className="float-right">{profile.since} → now</span></h2>
        <ol>
          {roles.map((r) => (
            <li key={`${r.company}-${r.start}`} className="grid grid-cols-[88px_1fr] gap-3 py-2 text-[12px] leading-snug">
              <span className={`font-mono text-[10px] tracking-[0.06em] ${r.current ? "text-signal" : "text-paper-ink/60"}`}>{formatPeriod(r.start, r.end)}</span>
              <div>
                <p className="font-semibold">{r.company} · {r.titleProgression ?? r.title}</p>
                <p className="text-[11px] text-paper-ink/60">{r.location} · {r.mode}</p>
                <p className="mt-0.5 text-paper-ink/85">{r.summary}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-4 grid grid-cols-2 gap-6">
          <div>
            <h2 className="cv-h">Stack</h2>
            <ul className="flex flex-wrap gap-1">
              {profile.stack.flatMap((g) => g.items).map((i) => <li key={i} className="rounded border border-paper-ink/20 px-1.5 py-0.5 font-mono text-[9.5px] tracking-[0.04em]">{i}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="cv-h">Education · Languages</h2>
            {profile.education.map((e) => <p key={e.school} className="text-[12px]">{e.degree}, {e.school} ({e.years})</p>)}
            <p className="mt-1 text-[12px] text-paper-ink/70">{profile.languages.map((l) => `${l.name} ${l.level}`).join(" · ")}</p>
          </div>
        </div>
        <footer className="cv-foot"><span>{profile.domain}/cv · generated {built}</span><span>1 / 2</span></footer>
      </section>

      <section className="cv-page break-before-page">
        <h2 className="cv-h mt-0">Selected projects</h2>
        <ol>
          {projects.map((p) => (
            <li key={p.slug} className="grid grid-cols-[88px_1fr] gap-3 py-2.5 text-[12px] leading-snug">
              <span className="font-mono text-[10px] tracking-[0.06em] text-paper-ink/60">{p.period}</span>
              <div>
                <p className="font-semibold">{p.name} · {p.role}</p>
                <p className="mt-0.5 text-paper-ink/85">{p.cvLine}</p>
                {p.live && <p className="mt-0.5 text-[11px] text-paper-ink/60">{p.live.url}</p>}
              </div>
            </li>
          ))}
        </ol>
        <h2 className="cv-h">Lab &amp; more</h2>
        <ul>
          {profile.lab.map((l) => <li key={l.name} className="py-1 text-[12px]"><span className="font-semibold">{l.name}</span> <span className="text-paper-ink/60">({l.year})</span> — {l.line}</li>)}
        </ul>
        <footer className="cv-foot"><span>{profile.domain}/cv · generated {built}</span><span>2 / 2</span></footer>
      </section>
    </div>
  );
}
```

Append to `app/globals.css`:

```css
/* CV */
.cv .cv-h { font-family: var(--font-mono); font-size: 10px; letter-spacing: .12em; text-transform: uppercase; border-bottom: 1px solid var(--color-paper-ink); padding-bottom: 4px; margin: 18px 0 8px; }
.cv .cv-foot { display: flex; justify-content: space-between; margin-top: 18px; font-family: var(--font-mono); font-size: 9px; letter-spacing: .1em; color: color-mix(in oklab, var(--color-paper-ink) 55%, transparent); }
.cv a { text-decoration: underline; text-decoration-color: color-mix(in oklab, var(--color-paper-ink) 30%, transparent); text-underline-offset: 2px; }
@page { size: A4; margin: 16mm 18mm; }
@media print {
  html, body { background: var(--color-paper) !important; }
  header[style], footer:not(.cv-foot), [data-grain], .no-print { display: none !important; }
  main { padding-top: 0 !important; }
  .cv { padding: 0 !important; max-width: none !important; }
  .cv-page { break-inside: avoid; }
  .break-before-page { break-before: page; }
}
```

Give `Grain` and `Vignette` roots `data-grain` so the print rule hides them (edit both components: add `data-grain` to the outer div).

- [ ] **Step 3: Write the route**

`app/cv/page.tsx`:

```tsx
import type { Metadata } from "next";
import { Cv } from "@/components/cv/Cv";
import { Pill } from "@/components/ui/Pill";

export const metadata: Metadata = { title: "CV", description: "Rijad Kuloglija, Lead Software Developer. CV generated from the same data as this site.", alternates: { canonical: "/cv/" } };

export default function CvPage() {
  return (
    <div className="bg-paper">
      <div className="no-print mx-auto flex max-w-[800px] items-center justify-between px-8 pt-8 md:px-12">
        <p className="eyebrow text-paper-ink/60">Generated from the same data as the site</p>
        <Pill href="/Rijad-Kuloglija-CV.pdf" external variant="outline" className="border-paper-ink/30 text-paper-ink">Download PDF</Pill>
      </div>
      <Cv />
    </div>
  );
}
```

- [ ] **Step 4: Write the PDF build script and hook it to postbuild**

`scripts/build-cv-pdf.mjs`:

```js
import { chromium } from "@playwright/test";
import { createServer } from "node:http";
import { readFile, copyFile } from "node:fs/promises";
import { extname, join } from "node:path";

const root = "out";
const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".avif": "image/avif" };
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  try {
    const body = await readFile(join(root, p));
    res.writeHead(200, { "content-type": types[extname(p)] ?? "application/octet-stream" });
    res.end(body);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise((r) => server.listen(0, r));
const port = server.address().port;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.emulateMedia({ media: "print" });
await page.goto(`http://localhost:${port}/cv/`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.pdf({ path: `${root}/Rijad-Kuloglija-CV.pdf`, format: "A4", printBackground: true, preferCSSPageSize: true });
await browser.close();
server.close();
await copyFile(`${root}/Rijad-Kuloglija-CV.pdf`, "public/Rijad-Kuloglija-CV.pdf");
console.log("CV PDF written to out/ and public/");
```

`package.json` scripts: `"postbuild": "node scripts/build-cv-pdf.mjs"`.

Run: `npm run build && npm test`
Expected: build prints "CV PDF written"; the CV test PASSES (2 pages, A4). If it is 3 pages, reduce `.cv` font sizes by 0.5 px or trim `profile.about`; if 1 page, the `break-before-page` rule is not applying (check the class is on the second section).

- [ ] **Step 5: Add the e2e check**

`tests/e2e/cv.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("CV page renders and links the PDF", async ({ page }) => {
  await page.goto("/cv/");
  await expect(page.locator("h1")).toHaveText("Rijad Kuloglija");
  const pdf = page.getByRole("link", { name: "Download PDF" });
  await expect(pdf).toHaveAttribute("href", "/Rijad-Kuloglija-CV.pdf");
  const res = await page.request.get("/Rijad-Kuloglija-CV.pdf");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("pdf");
});
```

Run: `npm run e2e -- --project=desktop` → PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(cv): CV page from profile data and A4 PDF generated in postbuild

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---
### Task 12: SEO, OG images, JSON-LD, sitemap, robots, manifest, 404

**Files:**
- Create: `app/opengraph-image.tsx`, `app/work/[slug]/opengraph-image.tsx`, `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts`, `app/not-found.tsx`, `components/ui/JsonLd.tsx`, `tests/e2e/seo.spec.ts`
- Modify: `app/layout.tsx` (JSON-LD), `app/page.tsx` (metadata)

**Interfaces:**
- Consumes: `profile`, `projects`, `getProject`, `Monogram`, `Pill`, `auraSvg` (via the PNG rendered in Task 5).
- Produces: `/opengraph-image` (1200 × 630), `/work/<slug>/opengraph-image`, `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/404.html`.

- [ ] **Step 1: Write the SEO e2e test**

`tests/e2e/seo.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("home has metadata, OG image and Person JSON-LD", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Redzy — Rijad Kuloglija");
  const og = page.locator('meta[property="og:image"]');
  await expect(og).toHaveAttribute("content", /opengraph-image/);
  const ld = await page.locator('script[type="application/ld+json"]').textContent();
  expect(JSON.parse(ld!)["@type"]).toBe("Person");
});

test("case study has its own title, canonical and OG image", async ({ page }) => {
  await page.goto("/work/liblynx/");
  await expect(page).toHaveTitle("LibLynx report builder — Redzy");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/work\/liblynx\/$/);
  const og = await page.locator('meta[property="og:image"]').getAttribute("content");
  const res = await page.request.get(og!);
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("image/png");
});

test("sitemap, robots, manifest and 404 exist", async ({ page }) => {
  for (const path of ["/sitemap.xml", "/robots.txt", "/manifest.webmanifest"]) {
    expect((await page.request.get(path)).status()).toBe(200);
  }
  const res = await page.goto("/nope/");
  expect(res?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveText("Lost signal.");
});
```

Run: `npm run e2e -- --project=desktop` → FAIL.

- [ ] **Step 2: Write the OG images**

`app/opengraph-image.tsx`:

```tsx
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { profile } from "@/content/profile";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const aura = `data:image/png;base64,${(await readFile("public/media/auras/default.png")).toString("base64")}`;
  const display = await readFile("public/fonts/cabinet-grotesk-800.woff2");
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 72, backgroundImage: `url(${aura})`, backgroundSize: "cover", color: "#F2EFEA", fontFamily: "Cabinet" }}>
        <svg width="96" height="96" viewBox="0 0 100 100" style={{ position: "absolute", top: 72, left: 72 }}>
          <g fill="#F2EFEA"><rect x="16" y="10" width="14" height="80" /><path fillRule="evenodd" d="M30,10 H52 A22,22 0 0 1 52,54 H30 Z M30,24 H52 A8,8 0 0 1 52,40 H30 Z" /><polygon points="42,50 56,50 80,90 66,90" /></g>
          <circle cx="46" cy="32" r="5" fill="#FF4A26" />
        </svg>
        <div style={{ fontSize: 24, letterSpacing: 3, color: "#8A857E", textTransform: "uppercase" }}>{profile.name} · {profile.title}</div>
        <div style={{ fontSize: 76, fontWeight: 800, letterSpacing: -2.5, lineHeight: 0.95, marginTop: 20, maxWidth: 900 }}>{profile.headline}</div>
      </div>
    ),
    { ...size, fonts: [{ name: "Cabinet", data: display, weight: 800, style: "normal" }] },
  );
}
```

`app/work/[slug]/opengraph-image.tsx`:

```tsx
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { getProject, projectSlugs } from "@/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export function generateStaticParams() { return projectSlugs.map((slug) => ({ slug })); }

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug)!;
  const aura = `data:image/png;base64,${(await readFile(`public/media/auras/${slug}.png`)).toString("base64")}`;
  const display = await readFile("public/fonts/cabinet-grotesk-800.woff2");
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 72, backgroundImage: `url(${aura})`, backgroundSize: "cover", color: "#F2EFEA", fontFamily: "Cabinet" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 22, letterSpacing: 3, color: "#8A857E", textTransform: "uppercase" }}>
          <span style={{ color: "#FF4A26" }}>{String(p.index).padStart(2, "0")} / 05</span><span>{p.categories.join(" · ")}</span>
        </div>
        <div style={{ fontSize: 84, fontWeight: 800, letterSpacing: -3, lineHeight: 0.95, marginTop: 18 }}>{p.name}</div>
        <div style={{ fontSize: 28, color: "#B8B2AA", marginTop: 18, maxWidth: 980 }}>{p.oneLiner}</div>
        <div style={{ position: "absolute", top: 72, right: 72, fontSize: 24, letterSpacing: 3, color: "#8A857E" }}>REDZY · {p.role.toUpperCase()}</div>
      </div>
    ),
    { ...size, fonts: [{ name: "Cabinet", data: display, weight: 800, style: "normal" }] },
  );
}
```

- [ ] **Step 3: Write sitemap, robots, manifest, JSON-LD**

`app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import { projectSlugs, profile } from "@/content";

export const dynamic = "force-static";
const base = `https://www.${profile.domain}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, priority: 1 },
    { url: `${base}/cv/`, lastModified: now, priority: 0.6 },
    ...projectSlugs.map((s) => ({ url: `${base}/work/${s}/`, lastModified: now, priority: 0.8 })),
  ];
}
```

`app/robots.ts`:

```ts
import type { MetadataRoute } from "next";
import { profile } from "@/content/profile";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `https://www.${profile.domain}/sitemap.xml` };
}
```

`app/manifest.ts`:

```ts
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Redzy — Rijad Kuloglija", short_name: "Redzy", start_url: "/", display: "standalone",
    background_color: "#0A0908", theme_color: "#0A0908",
    icons: [{ src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" }, { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" }],
  };
}
```

`components/ui/JsonLd.tsx`:

```tsx
import { profile } from "@/content/profile";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org", "@type": "Person", name: profile.name, jobTitle: "Lead Software Developer",
    url: `https://www.${profile.domain}`, email: `mailto:${profile.email}`, address: { "@type": "PostalAddress", addressLocality: "Sarajevo", addressCountry: "BA" },
    sameAs: [profile.links.github, profile.links.linkedin], knowsAbout: profile.strengths,
    worksFor: profile.roles.filter((r) => r.current).map((r) => ({ "@type": "Organization", name: r.company, url: r.url })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
```

Add `<JsonLd />` inside `<body>` in `app/layout.tsx`. In `app/page.tsx` export `metadata = { alternates: { canonical: "/" } }`.

- [ ] **Step 4: Write the 404**

`app/not-found.tsx`:

```tsx
import { Monogram } from "@/components/brand/Monogram";
import { Pill } from "@/components/ui/Pill";

export default function NotFound() {
  return (
    <section className="container-site flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center text-center">
      <Monogram size={160} lit={false} glow={false} className="text-[#1C1A18]" title="Redzy monogram, unlit" />
      <p className="eyebrow mt-10">404</p>
      <h1 className="display-lg mt-3">Lost signal.</h1>
      <p className="mt-4 max-w-[36ch] text-ink-soft">This page isn't lit. The work, the story and the contact are all back home.</p>
      <Pill href="/" dot className="mt-10" transitionTypes={["nav-back"]}>Back to the signal</Pill>
    </section>
  );
}
```

- [ ] **Step 5: Build and test**

Run: `npm run build && ls out/opengraph-image* out/work/liblynx/ && npm run e2e -- --project=desktop`
Expected: `out/opengraph-image.png` (or a hashed name linked from the HTML) exists; the SEO spec PASSES. Open `out/work/liblynx/opengraph-image.png`: dark aura, red index, name in Cabinet Grotesk.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(seo): metadata, aura OG images, JSON-LD, sitemap, robots, manifest and 404

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---
### Task 13: E2E coverage, accessibility checks, CI, CLAUDE.md and the first Vercel preview

**Files:**
- Create: `tests/e2e/home.spec.ts`, `tests/e2e/a11y.spec.ts`, `.github/workflows/ci.yml`, `CLAUDE.md`, `docs/screenshots/after/.gitkeep`, `scripts/screenshot-after.mjs`
- Modify: `package.json` (`lint`, `typecheck`, `screens`), `README.md`

**Interfaces:**
- Produces: `npm run check` = lint + typecheck + unit; `npm run e2e`; `npm run screens` writes `docs/screenshots/after/*.jpg`.

- [ ] **Step 1: Write home and a11y e2e tests**

```bash
npm install -D @axe-core/playwright@^4
```

`tests/e2e/home.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("navbar anchors reach their sections", async ({ page }) => {
  await page.goto("/");
  for (const [name, id] of [["Work", "work"], ["About", "about"], ["Experience", "experience"], ["Contact", "contact"]]) {
    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name, exact: true }).click();
    await expect(page.locator(`#${id}`)).toBeInViewport({ ratio: 0.2 });
  }
});

test("work chapters stack on desktop and flow on mobile", async ({ page }, info) => {
  await page.goto("/");
  const first = page.locator("[data-chapter='liblynx']");
  const position = await first.evaluate((el) => getComputedStyle(el).position);
  expect(position).toBe(info.project.name === "mobile" ? "static" : "sticky");
});

test("email button copies to clipboard", async ({ page, context, browserName }) => {
  test.skip(browserName !== "chromium", "clipboard permissions are chromium-only");
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/#contact");
  await page.getByRole("link", { name: /rkuloglija@gmail.com/ }).click();
  await expect(page.getByText("Copied")).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("rkuloglija@gmail.com");
});

test("experience expands to all roles", async ({ page }) => {
  await page.goto("/#experience");
  await expect(page.locator("#experience [data-row]")).toHaveCount(5);
  await page.getByRole("button", { name: /Show all/ }).click();
  await expect(page.locator("#experience [data-row]")).toHaveCount(10);
});
```

`tests/e2e/a11y.spec.ts`:

```ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const path of ["/", "/work/liblynx/", "/cv/"]) {
  test(`${path} has no serious axe violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });
}
```

Run: `npm run e2e`
Expected: PASS across `desktop`, `mobile`, `reduced-motion`. Fix any axe finding in the component (most likely: contrast of `ink-muted` text under 11 px, or missing `aria-label` on icon-only links).

- [ ] **Step 2: Add lint and typecheck scripts**

`package.json`:

```json
"lint": "eslint .",
"typecheck": "tsc --noEmit",
"check": "npm run lint && npm run typecheck && npm test"
```

Run: `npm run check` → all green. Fix lint errors in place (no `eslint-disable` without a comment explaining why).

- [ ] **Step 3: Write the after-screenshot script**

`scripts/screenshot-after.mjs`:

```js
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.env.BASE_URL ?? "http://localhost:4173";
const routes = ["/", "/work/liblynx/", "/work/din-solution/", "/work/neo-labs/", "/work/arkona/", "/work/nepa-invest/", "/cv/", "/nope/"];
await mkdir("docs/screenshots/after", { recursive: true });
const browser = await chromium.launch();
for (const [name, vp] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
  const page = await browser.newPage({ viewport: vp });
  for (const r of routes) {
    await page.goto(base + r, { waitUntil: "networkidle" });
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((res) => setTimeout(res, 120)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(500);
    const file = `docs/screenshots/after/${name}${r.replace(/\//g, "-").replace(/-$/, "") || "-home"}.jpg`;
    await page.screenshot({ path: file, fullPage: true, type: "jpeg", quality: 70 });
    console.log(file);
  }
  await page.close();
}
await browser.close();
```

Add script `"screens": "node scripts/screenshot-after.mjs"`. Run with the e2e server up: `npx serve out -l 4173 & npm run screens`. Review every screenshot against the spec before committing them.

- [ ] **Step 4: CI**

`.github/workflows/ci.yml`:

```yaml
name: ci
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 24, cache: npm }
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run check
      - run: npm run build
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: failure()
        with: { name: playwright-report, path: playwright-report }
```

- [ ] **Step 5: Write CLAUDE.md and update README**

`CLAUDE.md`:

```md
# Redzy portfolio (rijadkuloglija.com)

Next.js 16 App Router, static export (`out/`), React 19, TypeScript strict, Tailwind 4. Dark only, English only.

## Commands
- `npm run dev` · `npm run build` (also writes the CV PDF in postbuild) · `npm run check` (lint + typecheck + unit) · `npm run e2e` (build + Playwright) · `npm run screens` (after-screenshots)
- Assets: `npm run capture` (public-site captures → assets/source/captures), `npm run assets` (sharp → public/media), `npm run icons`, `npm run auras`, `node scripts/fetch-fonts.mjs`

## Rules
- All copy lives in `content/` (`profile.ts`, `work/*.ts`) and is validated by `content/schema.ts`. Never hardcode roles, projects or profile text in components.
- Design tokens live in `app/globals.css` `@theme`; use the Tailwind utilities (`bg-canvas`, `text-ink`, `text-signal`, `display-xl`, `eyebrow`). Never pure #000/#FFF. Red is light, never a large fill or body text.
- Spec: `docs/superpowers/specs/2026-10-09-portfolio-redesign-design.md`. Plans: `docs/superpowers/plans/`.
- `assets/source/` is gitignored (originals). `public/media/` is committed (processed).
- Motion: respect `prefers-reduced-motion`; Plan 2 adds GSAP/R3F behind `lib/tiers.ts`.
- Commits: conventional prefix, end with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.
```

Replace `README.md` with a short description, the commands above and the deploy note (Vercel, same project, `main` = production).

- [ ] **Step 6: Push and open the Vercel preview**

```bash
git add -A
git commit -m "test: e2e suites, axe checks, CI workflow, CLAUDE.md and after-screenshots

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
git push -u origin redesign/signal
```

Vercel builds the branch automatically (framework preset switches to Next.js). Open the preview URL from the Vercel dashboard or `vercel ls`, run `npm run screens` with `BASE_URL=<preview-url>`, and check: fonts load (no FOUT after first paint), the CV PDF downloads, the OG image shows in a social preview tool, and Lighthouse mobile on `/` scores ≥ 90 Performance with CLS ≤ 0.05.

Record the preview URL and Lighthouse numbers in `docs/superpowers/plans/2026-10-10-portfolio-redesign-foundation.md` under "Plan 1 result" (append at the end).

---

## Self-review against the spec

- §3 brand: Monogram geometry (Task 5), tokens and type scale (Task 2), icon sprite (Task 5), auras (Task 5). Logo deliverables `redzy-lockup.svg`/`og-default.png` are produced indirectly (Lockup component, `/opengraph-image`); no separate files needed.
- §4 routes: all routes in Tasks 8–12. `/Rijad-Kuloglija-CV.pdf` in Task 11.
- §5 home: hero static version (Task 8; 3D in Plan 2), chapters (Task 8), companies/about/experience/lab/contact (Task 9), footer live details (Task 6).
- §7 case studies: Task 10 incl. Neo tabs, DIN text-heavy body, Nepa renders and video (Task 7).
- §8 CV: Task 11.
- §9 content model: Tasks 3–4.
- §10 tech: Task 1 config, Task 7 images, Task 12 SEO, Task 13 CI. Performance budgets are checked manually here and enforced by Lighthouse CI in Plan 2.
- §11 assets: Task 7. Owner app screenshots: `assets/README.md` documents the swap; LibLynx hero stays a public capture until they arrive (Open item 1).
- §12 testing: unit tests in every task, e2e in Tasks 10–13, visual screenshots in Task 13.
- §15 signature details covered here: 15.1 (Task 6 CSS + Task 8/10 names), 15.5 (Task 5), 15.7 (Tasks 5, 8, 10, 12), 15.11 favicon/footer/badge/console/marquee/vignette (Tasks 6, 8, 9), 15.12 404 (Task 12). Remaining 15.x items are in Plan 2.

## Open items carried into Plan 2
1. Owner confirms Neo Labs start month (`2025-09` assumed) and the Amodo row.
2. Owner-supplied app screenshots for LibLynx, GumaMax, Neo panels.
3. Hero poster is the SVG monogram until Plan 2 renders the 3D poster.
