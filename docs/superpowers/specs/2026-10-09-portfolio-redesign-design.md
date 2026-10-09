# Redzy portfolio redesign: design spec

Date: 2026-10-09. Status: approved in brainstorming, awaiting owner review of this document.
Inputs: `docs/brief/2026-10-09-redesign-kickoff.md`, `docs/brief/2026-10-09-decisions.md`, DIN portfolio content in `docs/brief/din-*.{txt,md}`, visual companion screens in `.superpowers/brainstorm/`.

## 1. Summary

Replace the current Vite template portfolio at rijadkuloglija.com with a new site and brand, "Redzy". One idea carries the whole site: **the R monogram is a source of red light, and everything on the page is lit by it ("Signal").** The hero is a Three.js scene; scrolling pushes the camera into the light in the letter and the rest of the page emerges from it. Below the hero, the page is editorial: big type, hairline rules, monospace metadata, real product screenshots. Five case study pages carry the proof. A CV is generated from the same data as the site.

Audience: clients and partners who want someone to own a product end to end. Lead roles: CTO at DIN Solution, Lead Software Developer at LibLynx.

## 2. Goals and non-goals

Goals
- A timeless editorial base with one memorable "wow" moment, not a tech demo.
- Content refreshed to the DIN portfolio facts (October 2026), English only.
- Every project shown is real, live and linked; five get a case study page.
- CV never goes stale again: one data module feeds site, `/cv` and the PDF.
- Fast on mobile: the 3D layer is optional and loads after first paint.

Non-goals
- No light theme, no language switcher, no contact form, no CMS, no blog.
- No Anel Kujović material from the joint DIN portfolio.
- No generated stock imagery.

## 3. Brand system

### 3.1 Logo

Monogram "R" on a 100 × 100 grid, solid geometric, stroke weight 14 units everywhere:

```svg
<svg viewBox="0 0 100 100">
  <g id="r">
    <rect x="16" y="10" width="14" height="80"/>
    <path fill-rule="evenodd" d="M30,10 H52 A22,22 0 0 1 52,54 H30 Z M30,24 H52 A8,8 0 0 1 52,40 H30 Z"/>
    <polygon points="42,50 56,50 80,90 66,90"/>
  </g>
  <circle cx="46" cy="32" r="5" fill="#FF4A26"/>   <!-- the signal -->
</svg>
```

- The dot ("signal") sits in the counter of the bowl. On the web it glows (CSS drop-shadow or bloom in 3D). In print it is a flat dot.
- Sizes: r=5 at ≥ 32 px, r=6.5 at 16 px (favicon). Inverted tile: ink square with 18 % radius, R in canvas color, dot stays red.
- Wordmark: "Redzy" in Cabinet Grotesk 800, letter-spacing -0.045em. Lockup: monogram, 0.45em gap, wordmark; monogram height equals cap height.
- Deliverables: `public/brand/redzy-mark.svg`, `redzy-mark-inverted.svg`, `redzy-lockup.svg`, `favicon.svg`, `favicon.ico` (16/32), `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png`, `og-default.png` (1200 × 630). The old shield/crown raster logos are deleted.

### 3.2 Color tokens (dark only)

| Token | Value | Use |
|-------|-------|-----|
| `canvas` | #0A0908 | page background |
| `surface-1` | #121110 | cards, frames |
| `surface-2` | #1A1816 | hover surface, tags |
| `hairline` | #23211E | all 1 px rules |
| `hairline-strong` | #2E2B28 | outlined buttons |
| `ink-muted` | #8A857E | metadata, labels |
| `ink-soft` | #B8B2AA | body text |
| `ink` | #F2EFEA | headings, primary text, primary button fill |
| `signal` | #FF4A26 | the dot, glows, lit edges, current-role years, hover |
| `signal-soft` | #FFB3A3 | small red text on dark (links in meta) |

Rules: red never fills a large area and never colors body text. Pure #000 and #FFF are not used. Contrast: ink on canvas 17:1; ink-soft on canvas 10:1; ink-muted on canvas 5.3:1 (AA for 11 px mono with letter-spacing is acceptable, never below 11 px); signal on canvas 4.6:1 (large text only); signal-soft on canvas 9:1.

### 3.3 Typography

Self-hosted woff2 via `next/font/local`, Latin subset only (all site text is English and ASCII).

| Role | Font | Weight | Size / line / tracking |
|------|------|--------|------------------------|
| display-xl | Cabinet Grotesk | 800 | clamp(56px, 8vw, 112px) / 0.92 / -0.035em |
| display-lg | Cabinet Grotesk | 800 | clamp(40px, 5vw, 64px) / 0.95 / -0.035em |
| display-md | Cabinet Grotesk | 800 | 32–40px / 1.0 / -0.03em |
| headline | Cabinet Grotesk | 700 | 22–26px / 1.15 / -0.02em |
| body-lg | Switzer | 400 | 18–20px / 1.5 / 0 |
| body | Switzer | 400 | 16px / 1.6 / 0 |
| body-sm | Switzer | 400/500 | 14px / 1.5 / 0 |
| mono | IBM Plex Mono | 400/500 | 11–12px / 1.4 / 0.12em, uppercase for labels |

Measure: body ≤ 62ch, lead ≤ 48ch, display ≤ 14 words. Licenses: Cabinet Grotesk and Switzer (Fontshare, free for commercial use), IBM Plex Mono (OFL).

### 3.4 Layout and spacing

- Container 1200 px max, 24 px gutter on mobile, 48 px from 768, 64 px from 1280.
- 12-column grid on desktop; two-column "label left / text right" pattern (200 px label column) for case study bodies and About.
- Vertical rhythm: section padding 96 px mobile, 160 px desktop. Section eyebrow: mono "01 — Selected work".
- Radii: 6 px (tags), 12 px (frames), 999 (pills). Shadows only on screenshot frames: `0 30px 80px rgba(0,0,0,.6)`.
- Grain: a 120 px tiled SVG turbulence overlay at 6–7 % opacity over the whole page, `pointer-events: none`, `mix-blend-mode: overlay`.

### 3.5 Motion tokens

- Easing: `cubic-bezier(.22,1,.36,1)` for enters, `power2.out` in GSAP; durations 240 ms (UI), 600 ms (section enters), 1200 ms (light sweeps).
- Light sweep: a top-to-bottom red gradient band (height 40 % of element, opacity 0 → .22 → 0) that crosses an element once when it enters the viewport, driven by ScrollTrigger `once: true`.
- Cursor light: 320 px radial gradient (signal at 10 % → transparent) following the pointer with 120 ms lag, desktop pointer devices only.
- Navbar dot: 2.4 s ease-in-out pulse, scale 1 → 1.18, pauses when tab hidden.
- Reduced motion (`prefers-reduced-motion: reduce`): no loader, no pin, no sweeps, no cursor light, no pulse; everything renders in its final state.

## 4. Information architecture

| Route | Content | Rendering |
|-------|---------|-----------|
| `/` | Home: hero, selected work, companies, about, experience, lab, contact | static |
| `/work/liblynx` | LibLynx report builder | static |
| `/work/din-solution` | DIN Solution | static |
| `/work/neo-labs` | Neo Labs with Neo Care and Neo Therapy inside | static |
| `/work/arkona` | Arkona website + GumaMax dashboard | static |
| `/work/nepa-invest` | Nepa Invest | static |
| `/cv` | HTML CV, print stylesheet, "Download PDF" link | static |
| `/Rijad-Kuloglija-CV.pdf` | generated at build from `/cv` | static file |
| `/opengraph-image` and per-route OG | generated at build with `next/og` | static |
| `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest` | generated | static |
| `/404` | branded not-found with the monogram | static |

Navigation: Work, About, Experience, Contact (anchors on home; from case pages they link back to `/#section`), plus a primary pill "Send a signal" (mailto). Mobile: full-screen overlay menu with the same items and the big email.

## 5. Home page

Order and behavior. Each section has a mono eyebrow with its number.

### 5.1 Navbar
Sticky, 64 px, canvas with 80 % opacity + backdrop blur after the hero. Left: lockup (monogram + "Redzy"); the monogram's dot is the "landed" signal from the hero (see §6). Right: links, pill. On case pages the left shows "← All work" next to the lockup.

### 5.2 Hero (00)
Pinned for 250 vh on desktop. Left column: mono eyebrow "Rijad Kuloglija · Lead Software Developer · Sarajevo", display-xl headline, lead paragraph, two CTAs. Right: the 3D monogram, offset right so the dot sits near the horizontal center of the viewport. Full choreography in §6.

Copy v1 (editable in `content/profile.ts`):
- Headline: "Software that keeps working after launch."
- Lead: "Frontend architecture backed by real backend work. I take products from design to deployment and own them after. CTO at DIN Solution, Lead Software Developer at LibLynx."
- CTAs: "Send a signal" (mailto, primary, with the dot inside the pill) and "Selected work" (anchor, outlined).

### 5.3 Selected work (01)
Five chapters, each `min-height: 100vh`, `position: sticky; top: 0`, stacked so the next chapter slides over the previous (z-index increases, previous chapter scales to .96 and dims to .5 opacity as the next covers it). Chapter layout: left 5/12 text (index "01 / 05" in signal mono, category mono, display-lg project name, one-liner, role + stack line, "Read case study →"), right 7/12 screenshot in a dark browser frame (§7.3). A light sweep crosses the frame when the chapter becomes active. Mobile: stacking off, chapters become normal sections, screenshot above text.

Order: LibLynx, DIN Solution, Neo Labs, Arkona + GumaMax, Nepa Invest.

### 5.4 Companies strip (02)
Mono uppercase names in a slow marquee (60 s loop, pauses on hover and under reduced motion): LibLynx, Neo Labs, DIN Solution, ProCredit Bank, BMW, Deutsche Bundesbank, Arkona Technology, Superlex, Nepa Invest, Clearview, Solution404. Text only, no third-party logos. Eyebrow: "Products and companies I've built for".

### 5.5 About (03)
Two columns: portrait left (4/12, `assets/source/photo/untitled-6516.jpg` processed to 1200 px, grayscale with contrast 1.08, plus a red screen-blend gradient on the lit side), text right. Text: one positioning paragraph (DIN "About" paragraph, trimmed to ~90 words, first person), a "Strengths" list (6 items), and "Core stack" as mono tags grouped Frontend / Backend / Data / Infra. Facts row in mono: Sarajevo · Building since 2021 · B.Sc. CS, International Burch University · EN / DE / BS.

### 5.6 Experience (04)
A list of rows: mono period (signal-colored when current), company and title with progression where applicable (Senior → Lead), location and mode, one-line summary. Nine roles from DIN, newest first: DIN Solution, Neo Labs, LibLynx via Clearview, Arkona Technology, ProCredit Bank, Superlex, ACKE Creative Studio, Bloola GmbH & Co. KG, Solution404. Amodo (Flutter, 2022, Porsche Smart Driver App) is included as a tenth row because it is verified in the owner's CV. First five visible, "Show all" expands the rest. Rows get a hairline on top and a lit hairline on hover.

### 5.7 Lab and more work (05)
Compact mono list, no images: Sui NFT DApp (live + GitHub), GumaMax (dashboard, text only until screenshots arrive), ProCredit internal tools (HR dashboard, referral system, ATM feedback; no UI shown), Bloola CM and Bloola Factory (Microsoft Teams and no-code builder), BMW My Learning Finder. Each row: name, one line, year, links if public.

### 5.8 Contact (06)
Display-xl "Send a signal." with a small monogram that assembles next to it when the section enters (the same three parts as the loader, 600 ms). Below: the email as a large button (click copies to clipboard, label flips to "Copied" for 1.6 s, still an `href="mailto:"`), GitHub, LinkedIn, "Download CV (PDF)". Footer row: "Sarajevo · HH:MM CET" (live local time, client-rendered after hydration, static placeholder before), "© 2026 Redzy", "Built with Next.js, Three.js and GSAP".

## 6. The Signal: hero choreography

### 6.1 Scene
React Three Fiber canvas, `dpr` capped at 1.5, transparent background over the DOM (the fog and grain are DOM/CSS, cheap). Objects:
- The R: extruded from the SVG path (`three` `SVGLoader` → `ExtrudeGeometry`, depth 12 units, bevel 1.2), material `MeshPhysicalMaterial` dark brushed metal (color #1C1A18, metalness .85, roughness .38, clearcoat .2, anisotropy via a small normal map). Lit by one key `PointLight` positioned at the counter (46, 32), color #FF4A26, intensity animated, distance 220, plus a very dim cool fill from the upper left so the silhouette never disappears.
- The dot: emissive sphere (r 5) at the counter, emissive #FF4A26 intensity 2.4, with `Bloom` from `@react-three/postprocessing` (threshold .8, intensity 1.2, mipmap blur). This is the only post effect.
- Idle motion: the R tilts toward the pointer up to ±8° (lerp .06), the light intensity breathes ±10 % on a 4 s sine, and flares +40 % when the pointer is within 160 px of the dot.

### 6.2 Scroll timeline (desktop, pointer, GPU tier ≥ 2)
Hero wrapper is pinned by GSAP ScrollTrigger for 250 vh with `scrub: 0.6`. Progress `p` from 0 to 1 drives:

| p | Camera / scene | DOM |
|---|----------------|-----|
| 0 – .20 | camera z 6 → 2.8 toward the dot, R rotation settles to 0 | headline and lead translate -40 px and fade to 0; CTAs fade |
| .20 – .55 | camera z 2.8 → 0.3 aimed at the dot; light intensity ×3; bloom intensity 1.2 → 2.6 | nothing (scene fills viewport with red) |
| .55 – .62 | white-hot core: a DOM overlay (`#FFF1EC`) fades to 1 and back | |
| .62 – .82 | canvas opacity 1 → 0 and the R3F loop pauses; a DOM radial gradient anchored at the top center (signal at .55 → transparent) shrinks toward the navbar | the navbar dot scales from 6× to 1× and starts pulsing; this is the "landing" |
| .82 – 1 | | Selected work chapter 01 is revealed by a light sweep moving down; its rows and the frame fade in |

Scroll distance is short enough that the dive takes about half a screen of scrolling at normal speed. Scrolling back up reverses everything (scrub). After the first full dive, the hero stays pinned on return but the loader never replays.

### 6.3 Loader (first visit per session, desktop and mobile)
1.2 s, skippable by scroll or click, stored in `sessionStorage`. Canvas-free: pure DOM/SVG. The dot appears at center and pulses once (0 → 1 scale, 300 ms); the three parts of the R (stem, bowl, leg) fade in around it from 0 to 1 opacity over 500 ms, offset 80 ms, lit by a radial gradient from the dot; the wordmark fades in below; the whole thing then translates and scales into the navbar lockup position (400 ms) while the hero scene fades in behind.

### 6.4 Fallback tiers
Decided once on the client with `detect-gpu` (tier) plus `matchMedia` checks, stored in a context:
- **Tier A** (pointer, width ≥ 1024, GPU tier ≥ 2, no reduced motion): full scene and timeline (§6.1–6.3).
- **Tier B** (touch or width < 1024 or GPU tier 1): no R3F. The hero shows a pre-rendered WebP of the lit R (exported once from the scene at 1600 px, 2 variants for aspect), the dot is a DOM element with CSS glow and pulse. No pin. When the hero leaves the viewport a 400 ms red-to-transparent overlay plays once and the navbar dot appears. Light sweeps still run (CSS only).
- **Tier C** (reduced motion or GPU tier 0 or WebGL unavailable): Tier B poster, no overlay, no sweeps, no loader, navbar dot static.

The 3D chunk (`three`, R3F, drei pieces, postprocessing) is `dynamic(..., { ssr: false })` and loaded after `requestIdleCallback` on Tier A only. Budget: ≤ 380 KB gzipped for that chunk; the rest of the page must not wait for it.

## 7. Case study pages

### 7.1 Structure
Navbar (with "← All work") → head → hero media → body → gallery → CTAs → next project → footer. Head: mono "02 / 05 · categories", display-xl name (two lines allowed), one-liner (body-lg, ≤ 30ch), meta grid (Role with progression, Period, Stack, Live link). A faint red radial glow sits at the top right of the head (the signal is "above" the page).

Body: two-column rows with hairlines: Overview, Problem, Contribution, Engineering, Delivered (bulleted with signal dashes). Copy comes from `docs/brief/din-case-studies-2026-10-09.md`, rewritten to first person and trimmed; facts unchanged.

Gallery: 2–4 frames in a 2:1 grid, mono captions. CTAs: "Visit <domain>" primary, "Ask me about this project" (mailto with subject prefilled). Next project card with name and one-liner; order wraps around.

### 7.2 Per-project notes
- **LibLynx**: hero must be the report-builder app, not liblynx.com. Owner supplies screenshots; until then the build uses a placeholder frame with a blurred liblynx.com capture and a visible "App screenshots pending" note in the content file, which must be resolved before launch.
- **DIN Solution**: leadership role; hero is dinsolution.com (public), captured by us at 1600 px; Contribution and Engineering carry more text; Delivered lists the three items from DIN.
- **Neo Labs**: hero frame has three tabs (Labs, Care, Therapy) switching the screenshot; captured from neo-labs.ai, neo-care.ai, neo-therapy.ai. Owner may add panel screenshots. Body mentions GDPR, escalation workflows, two brands on one product model.
- **Arkona + GumaMax**: hero arkonatechnology.com; GumaMax as second frame when screenshots arrive, text only otherwise.
- **Nepa Invest**: hero nepainvest.com; gallery uses three renders from `~/Desktop/NepaInvest/public/projects` (one per development) and one video tour as a muted loop in a frame (owner approved).

### 7.3 Screenshot frame component
`<ProductFrame>`: surface-1 panel, 10 px padding, hairline border, a 1 px signal ring at 8 % opacity, fake browser bar (three dots + mono URL), image via `next/image` (static import, sizes set), `light sweep` on enter, pointer tilt up to 3° on Tier A. Variants: `desktop` (16:10), `mobile` (9:19.5), `video` (same chrome, `<video muted loop playsInline>` with poster).

## 8. CV

- `/cv` page renders from the same data: single column, cream paper `#F7F4EF`, ink `#1A1816`, same fonts, the dot and current-role years in signal. Sections: header (name, title, contact column), summary, experience (all roles, two to three lines each), stack as tags, education and languages, page 2: selected projects (five, three lines each with live URL). Footer: "rijadkuloglija.com/cv · generated YYYY-MM-DD · page n / 2".
- `@media print`: A4, 18 mm margins, no navbar, links underlined in muted ink, page break before projects.
- `scripts/build-cv-pdf.ts`: after `next build`, start a local server on the `out/` folder, open `/cv` in Playwright Chromium, `page.pdf({ format: 'A4', printBackground: true })`, write `out/Rijad-Kuloglija-CV.pdf` and `public/Rijad-Kuloglija-CV.pdf` (the public copy is committed so the file exists for preview deployments and for the Vercel static export). Runs in `postbuild`. CI fails if the PDF has more than 2 pages or is under 20 KB.

## 9. Content model

Single module `content/profile.ts` exporting a typed object validated with Zod at build (`content/schema.ts`), plus one file per project in `content/work/*.ts`.

```ts
type Link = { label: string; url: string };
type Role = {
  company: string; title: string; titleProgression?: string; // "Senior → Lead Software Developer"
  start: string; end: string | null;                          // ISO month "2025-07"
  location: string; mode: 'remote' | 'on-site' | 'hybrid' | 'contract' | 'part-time';
  summary: string; stack?: string[]; url?: string; current: boolean; showOnCv: boolean;
};
type Media = { src: string; alt: string; kind: 'desktop' | 'mobile' | 'video'; caption?: string; poster?: string };
type Project = {
  slug: string; index: number; name: string; categories: string[]; oneLiner: string;
  role: string; roleNote?: string; period: string; stack: string[]; live?: Link; repo?: Link;
  body: { overview: string; problem: string; contribution: string; engineering: string };
  delivered: string[]; media: { hero: Media | Media[]; gallery: Media[] };
  cvLine: string; featured: true;
};
type LabItem = { name: string; line: string; year: string; links?: Link[] };
type Profile = {
  name: string; title: string; headline: string; lead: string; about: string;
  location: string; since: number; email: string; links: { github: string; linkedin: string };
  strengths: string[]; stack: { group: string; items: string[] }[];
  education: { school: string; degree: string; years: string }[];
  languages: { name: string; level: string }[];
  companies: string[]; roles: Role[]; lab: LabItem[];
};
```

Projects import order defines the 01–05 index. The CV, the home chapters and the `/work` pages read only from these files. No copy lives in components.

## 10. Technical architecture

- **Framework**: Next.js 16 (App Router, `output: 'export'`), React 19.3, TypeScript 5.x strict. Tailwind CSS 4 with the tokens from §3 as CSS variables in `@theme`; component styles in Tailwind utilities plus a few CSS modules for the hero and frames. No UI kit.
- **Motion**: GSAP 3.15 + ScrollTrigger (free for this use), Lenis 1.3 for smooth scroll (desktop only, disabled on touch and reduced motion, synced to ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`). Framer Motion is dropped.
- **3D**: three 0.186, `@react-three/fiber` 9, `@react-three/drei` 10 (only `Center` and `useTexture`; no `Environment`, no HDRI downloads), `@react-three/postprocessing` 3 for Bloom, `detect-gpu` for tiers.
- **Fonts**: `next/font/local` with `display: 'swap'`, preloaded display weight only.
- **Images**: on-demand `next/image` optimization is unavailable with `output: 'export'`, so `scripts/process-assets.ts` runs `sharp` ahead of build to emit AVIF + WebP at 800/1200/1600/2400 widths into `public/media`, and a small `<Picture>` component renders the `srcset`. Source files stay in `assets/source/` (gitignored); processed outputs are committed.
- **Folder layout**

```
app/                 layout.tsx, page.tsx, work/[slug]/page.tsx, cv/page.tsx, not-found.tsx,
                     opengraph-image.tsx, sitemap.ts, robots.ts, manifest.ts
components/brand/    Monogram.tsx, Lockup.tsx, Loader.tsx
components/hero/     Hero.tsx (DOM + tiers), HeroScene.tsx (R3F, dynamic), HeroTimeline.ts (GSAP)
components/home/     WorkChapters.tsx, Companies.tsx, About.tsx, Experience.tsx, Lab.tsx, Contact.tsx
components/work/     CaseStudy.tsx, ProductFrame.tsx, Gallery.tsx, NextProject.tsx
components/cv/       Cv.tsx
components/ui/       Navbar.tsx, Footer.tsx, Pill.tsx, Eyebrow.tsx, Grain.tsx, CursorLight.tsx, LightSweep.tsx
content/             profile.ts, schema.ts, work/{liblynx,din-solution,neo-labs,arkona,nepa-invest}.ts
lib/                 tiers.ts (motion/GPU tier context), gsap.ts (plugin registration), lenis.ts, copy.ts
scripts/             process-assets.ts, build-cv-pdf.ts, capture-public-sites.ts
public/              brand/, fonts/, media/{work,about}/, Rijad-Kuloglija-CV.pdf
docs/                brief/, screenshots/{before,after}/, superpowers/{specs,plans}/
```

- **Performance budget** (Lighthouse mobile, Tier B): Performance ≥ 90, LCP ≤ 2.5 s, CLS ≤ 0.05, TBT ≤ 200 ms, initial JS ≤ 180 KB gzipped excluding the lazy 3D chunk. Desktop Tier A: Performance ≥ 80, 60 fps during the dive on an M1 MacBook Air, no frame > 32 ms in the Playwright trace.
- **SEO**: per-route `metadata` (title, description, canonical), OG image per case study generated with `next/og` (name, category, the monogram), JSON-LD `Person` on home with `sameAs` links, `sitemap.xml`, `robots.txt`. Old anchors keep working on `/`.
- **Analytics**: Vercel Web Analytics only (no cookies, no banner).
- **Accessibility**: semantic landmarks, skip link, focus rings in signal (2 px, 2 px offset), all frames have alt text, the 3D canvas is `aria-hidden` with the hero text in the DOM, marquee pauses on hover/focus and under reduced motion, color contrast per §3.2, keyboard-reachable copy-email button, `prefers-reduced-motion` honored globally (§3.5, §6.4).

## 11. Assets pipeline

- `assets/source/photo/` (owner's three portraits): pick `untitled-6516.jpg` for About, `untitled-7189.jpg` reserved for a secondary warm placement if needed. Processed with sharp: crop to 4:5, 1200 and 2400 px, grayscale, AVIF + WebP.
- `assets/source/din-screenshots/`: fallback only.
- `scripts/capture-public-sites.ts`: Playwright captures of liblynx.com, dinsolution.com, neo-labs.ai, neo-care.ai, neo-therapy.ai, arkonatechnology.com, nepainvest.com and the Sui dapp at 1600 × 1000 desktop and 390 × 844 mobile, saved to `assets/source/captures/<slug>/`, then processed into `public/media/work/<slug>/`.
- Owner-supplied app screenshots (LibLynx report builder, GumaMax, Neo panels) go to `assets/source/app-screenshots/<slug>/` and replace the public-site heroes where §7.2 says so.
- Nepa Invest renders and one tour video are copied from `~/Desktop/NepaInvest/public/projects`; video re-encoded to 1280 px H.264 ≤ 4 MB with a poster.
- Hero poster for Tier B: rendered once from the R3F scene via a dev-only route and committed as WebP (1600 × 1000 and 900 × 1200).

## 12. Testing and verification

- **Content**: Vitest + Zod: profile and every project validate; every `live` URL is https; indices are 1–5 and unique; every media `src` exists in `public/`.
- **Unit**: tier detection (`lib/tiers.ts`) returns A/B/C for the documented inputs; copy-to-clipboard button states; `Monogram` renders the exact path data.
- **E2E (Playwright)**: all routes return 200 and contain their H1; navbar links work; the hero on a desktop profile reaches "landed" state after scrolling 250 vh (navbar dot visible, chapter 01 visible); on a mobile profile the hero has no pin and the page scrolls normally; reduced-motion profile shows no loader and no canvas; `/cv` prints to a 2-page PDF; email button copies.
- **Visual**: Playwright full-page screenshots of every route at 1440 and 390 stored in `docs/screenshots/after/`; reviewed against this spec before merge.
- **Performance**: Lighthouse CI on the Vercel preview with the budgets from §10; failing budgets block merge.
- **Manual**: owner reviews the preview URL on their phone and laptop; sign-off is recorded in the plan.

## 13. Delivery and migration

- Work happens on branch `redesign/signal` in a fresh Next.js tree (the Vite app is removed in the same branch; git history keeps it). Vercel builds previews per push.
- `vercel.json` SPA rewrite and `public/_redirects` are removed; Next handles routing. `sitemap.xml` and `robots.txt` become generated.
- Launch: merge to `main`, confirm production at rijadkuloglija.com, re-run Lighthouse, submit the sitemap in Search Console.
- A `CLAUDE.md` is added with the stack, scripts (`dev`, `build`, `postbuild` CV, `assets`, `capture`, `test`, `e2e`), content rules (all copy in `content/`), and the design tokens pointer.

## 14. Open items before launch

1. App screenshots behind login from the owner: LibLynx report builder (required), GumaMax and Neo panels (nice to have).
2. Final copy pass on headline, lead, about paragraph and the five case studies (first person, trimmed). Owner approves copy on the preview.
3. Owner confirms the Amodo row and the "Head of Communications & Software Innovation" title wording for the CV.
4. Vercel project settings: framework preset switches to Next.js automatically on first build; confirm the domain stays attached.

## 15. Signature details (added 2026-10-10 after a research pass)

Everything below is custom, on-concept (the signal is light) and cheap enough to keep the budgets in §10. Items marked (A) run on Tier A only; the rest run everywhere unless reduced motion is on.

### 15.1 Page transitions: the frame travels
React 19.3 `<ViewTransition>` is stable in Next.js 16.4 (no flag). The `ProductFrame` in a home chapter and the hero frame on its case study share `name="frame-<slug>"` with `share="morph"`, so clicking a project makes the screenshot fly from the chapter into the case study head (400 ms, 3 px blur mid-flight). "← All work" is tagged `nav-back`; chapter links `nav-forward`; page content slides 60 px in the matching direction with asymmetric fade (exit 150 ms, enter 210 ms). The navbar is anchored (`viewTransitionName: site-header`). `::view-transition { pointer-events: none }`. Reduced motion sets all view-transition durations to 0.

### 15.2 Text reveals
GSAP is free for commercial use since the Webflow acquisition, including SplitText, DrawSVG and ScrollSmoother. Every `display-*` heading and the hero lead reveal line by line with `SplitText.create(el, { type: 'lines', mask: 'lines', autoSplit: true })`, `yPercent: 100 → 0`, stagger 0.08 s, once, triggered at 80 % viewport. Hero headline reveals right after the loader lands. Mono eyebrows fade in with a 2 px upward move. Reduced motion: no split, text is static.

### 15.3 Signal cursor (A)
Replaces the system cursor on pointer devices only: a 6 px signal dot that tracks the pointer with no lag, plus a 28 px ring with 120 ms lag that carries the glow from §3.5. Over links and buttons the ring grows to 48 px and the dot hides; over a `ProductFrame` the ring becomes a pill labeled "Open case ↗" in mono; over the hero R the ring collapses into the dot (the pointer "becomes" the signal). Implemented with GSAP `quickTo`; `cursor: none` only when the custom cursor is mounted; touch devices and reduced motion keep the system cursor.

### 15.4 Magnetic pills (A)
Primary and outlined pills attract the pointer within 80 px (translate up to 12 px, `power3.out`, release with elastic 0.6 s). The dot inside the primary pill moves 2 px opposite to the pull. Touch: tap scales to .98 for 120 ms.

### 15.5 Custom icon set
No icon library. One SVG sprite `public/brand/icons.svg` with 12 line icons drawn on a 24-unit grid, 1.5 stroke, round caps, slightly open joins so they read as drawn, not stamped: arrow-up-right, arrow-right, arrow-left, mail, copy, check, download, external, close, menu, play, pause, plus `github` and `linkedin` marks simplified to the same stroke weight. `<Icon name>` component references the sprite. Arrow icons draw on with DrawSVG on hover (A) and sit 2 px right on hover elsewhere.

### 15.6 Hover previews
In Experience and Lab rows, hovering (pointer devices) shows a 240 × 150 thumbnail that follows the pointer with GSAP `quickTo` lag and a 6° tilt in the direction of travel; the thumbnail is the related project frame or company site capture. Keyboard focus shows the same thumbnail anchored to the row's right edge.

### 15.7 Project auras: generative custom imagery
Each project gets a deterministic "aura": a seeded field of soft red light and grain, generated from the slug (seeded noise → SVG `feTurbulence` + `feDisplacementMap` + radial gradients), used (a) behind the case study head at 18 % opacity, (b) as the OG image background, (c) as the chapter background on home at 8 %. No two projects look alike; no stock images; the same function renders the About aura from the string "rijad". Rendered to static PNG at build for OG (`scripts/render-auras.mjs` with `sharp` from the SVG string) and inlined as SVG on pages.

### 15.8 Shader hover on frames (A)
The case study hero `ProductFrame` and gallery frames upgrade on Tier A to a small R3F plane with a custom fragment shader: on hover a 1.2 s displacement ripple (noise-driven `uProgress`) and a red light sweep computed in the shader instead of CSS. Below Tier A the CSS sweep from §3.5 is used. One shared `WebGLRenderer` via a single fixed `Canvas` with `View` tracking (drei `View`) so frames do not each create a context.

### 15.9 Progress rails
Selected work has a fixed vertical mono rail on the right (desktop) showing "01 / 05" with a signal tick that fills with chapter progress (ScrollTrigger scrub). Case study pages show a 2 px signal reading-progress line at the top under the navbar.

### 15.10 Loader with real progress
The loader's dot fills by actual readiness (`document.fonts.ready`, hero poster decoded, and on Tier A the 3D chunk loaded) with a floor of 900 ms and a cap of 2.4 s, then lands (§6.3). Skippable by scroll or click.

### 15.11 Live and tiny delights
- Navbar dot is a button: click sends a "ping", one light sweep across the viewport (600 ms); `aria-label="Send a ping"`; keyboard-accessible.
- Favicon: the SVG dot is signal when the tab is visible and ink-muted when hidden (`visibilitychange` swaps `<link rel="icon">`).
- Footer: live Sarajevo time, build date (`NEXT_PUBLIC_BUILD_DATE` set in the build script), "Status: shipping".
- Availability badge in hero and contact: `profile.availability` string (e.g. "Open to product engagements from Q1 2027") with a pulsing dot; owner edits in content.
- Console signature on load: the monogram in ASCII, "Send a signal → rkuloglija@gmail.com".
- Company marquee set in `display-md`, not mono; hovered name lights to ink with a signal underline.
- Vignette: a fixed radial darkening toward the viewport edges (8 %) so the light feels contained.

### 15.12 404
"Lost signal." The R renders with its dot off (ink-muted); moving the pointer near it makes the dot flicker on (Tier A) and a magnetic "Back to the signal" pill goes home. Mobile: the dot flickers on load.

### 15.13 Budgets after additions
Initial JS stays ≤ 200 KB gzipped (GSAP core + ScrollTrigger + SplitText ≈ 45 KB); the 3D chunk remains lazy and ≤ 400 KB gzipped including the shader-frame code. Lighthouse budgets from §10 are unchanged and still block merge.
