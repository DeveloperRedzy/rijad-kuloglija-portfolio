# Rijad's case studies extracted from https://din-portfolio-five.vercel.app/work/* on 2026-10-09


---

## /work/liblynx

LibLynx — Kuloglija × Kujović 
 Skip to content 
 ← All work Enterprise SaaS / Identity & Access / Analytics
 LibLynx
 Leading a new analytics product inside enterprise infrastructure.
 Engineer
 Rijad Kuloglija
 Role
 Lead Software Developer
 Technology
 React 19 · TypeScript · Vite · Material UI · TanStack Query · Storybook
 www.liblynx.com 
 Overview
 LibLynx provides cloud-based identity and access management for publishers, libraries and knowledge organizations — the infrastructure that decides who can reach an online resource, how they authenticate, and what usage gets reported afterwards.
 Its customers include PLOS, The Economist Group, Digital Science, Emerald Publishing and Annual Reviews. This is production infrastructure with live institutional traffic, not a marketing site.
 Product
 The platform spans a wide surface: branded access experiences across platforms the vendor doesn't control; flexible authentication including Single Sign-On, 2FA and mobile roaming; account structures that model consortia and complex institutional hierarchies; authorization logic covering subscriptions, metered access and vouchers; and a web admin portal with API automation for everything manual.
 On the analytics side, LibLynx generates audited, COUNTER-compliant usage reporting delivered through portals, exports and the SUSHI protocol, plus open-access and denial analytics that turn blocked-access attempts into sales intelligence.
 Problem
 Access management in scholarly publishing is a compatibility problem at scale: many authentication methods, many platform technologies, strict reporting standards that get audited, and customers ranging from single libraries to purchasing consortia. The product has to absorb that complexity so publishers don't have to.
 On the analytics side, the specific problem Rijad's team owns: usage data is only valuable if customers can actually compose the reports they need — across event types, date ranges and COUNTER metrics — without asking support or waiting on engineering.
 Contribution
 Rijad leads development of LibLynx's report-builder application. He joined the LibLynx team through Clearview as a Senior Frontend Developer in July 2025 and was promoted to Lead Software Developer that October. The product lets customers compose usage reports with a drag-and-drop 'filter brick' system: drop bricks to build table columns, configure per-column filters, sort and paginate server-side, and export asynchronously.
 Beyond report composition he has built the workflows around it: saved reports with inline rename, organization-wide sharing and drag-to-reorder persistence; backend-driven template reports that load and build in one click; two-period comparison reports with change indicators; and an unsaved-changes guard that protects work in progress across navigation.
 Engineering
 The stack is React 19, TypeScript, Vite and Material UI, with TanStack Query for server state, Zod validation on API responses, and dnd-kit for accessible drag-and-drop. The component system — about thirty components — is documented and developed in Storybook.
 The application ships embedded in a same-origin iframe inside LibLynx's existing admin platform, coordinated through a postMessage bridge contract for content height and session expiry — a real integration constraint that shapes dialog positioning, focus handling and scroll behavior. Report export runs as an async request → poll → download flow; template configuration lives entirely in the backend so reports never go stale in the frontend.
 What was delivered
 — The report-builder application, live inside LibLynx's analytics product
 — Drag-and-drop report composition with server-side sorting, filtering and pagination
 — Saved, shared, template and comparison reporting workflows
 — A Storybook-documented component system and an iframe integration bridge into the host platform
 Visit live product ↗ Ask Rijad about this project 
 Next project
 Neo Labs
 AI voice products people talk to every day.


---

## /work/neo-labs

Neo Labs — Kuloglija × Kujović 
 Skip to content 
 ← All work AI / Communication Platform
 Neo Labs
 AI voice products people talk to every day.
 Engineer
 Rijad Kuloglija
 Role
 Head of Communications & Software Innovation
 Technology
 AI voices & assistants · Next.js · Product platforms · Multilingual
 www.neo-labs.ai 
 Overview
 Neo Labs is an EU-based AI company (Ljubljana, founded 2025) building intelligent AI voices and assistants for communication across industries — starting with care and mental wellness, with entertainment next.
 Its shipped products are Neo Care, a daily AI check-in call service for seniors, and Neo Therapy, structured AI support calls for mental wellness — with Neo Books, an AI audiobook product, announced as coming soon.
 Product
 The platform thesis: AI voices that hold real conversations over ordinary phone calls, configured per person, in multiple languages and cultural contexts, available around the clock, and integrated with the workflows around them — reminders, reports, escalation.
 Both live products run on the same product model — scheduled calls, structured check-ins, family or personal reporting — expressed through two distinct brands with their own design systems.
 Problem
 Voice AI in care and mental wellness is a trust problem before it is a technology problem: the products serve vulnerable users in the EU, which means GDPR by default, honest positioning about what an AI service is and isn't, and escalation paths that cannot silently fail.
 Contribution
 Rijad is one of Neo Labs' four members, serving as Head of Communications & Software Innovation — responsible for how the products are engineered and how they speak to the people who depend on them.
 On the software side, he engineered the customer-facing web platforms of both live products, Neo Care and Neo Therapy — covered in their own case studies on this site.
 Engineering
 The product platforms are Next.js and Tailwind CSS applications deployed on Vercel — one shared product model shipped twice, with each brand keeping its own visual identity, configuration flows and reporting surfaces.
 What was delivered
 — Two live subscription products shipped on a shared product model
 — Customer-facing platforms for onboarding, scheduling and reporting
 — A company-level product and communications remit in a four-person team
 Visit live product ↗ Ask Rijad about this project 
 Next project
 DIN Solution
 Owning the technology function of an international consulting firm.


---

## /work/din-solution

DIN Solution — Kuloglija × Kujović 
 Skip to content 
 ← All work FinTech / Consulting / Technology Leadership
 DIN Solution
 Owning the technology function of an international consulting firm.
 Engineer
 Rijad Kuloglija
 Role
 CTO & Head of Software Development
 Technology
 Technology leadership · IT solutions · FinTech consulting · Web platform
 www.dinsolution.com/ 
 Overview
 DIN FinTech Solutions is an international consulting firm with offices in London, Sheridan (Wyoming) and Luxembourg, serving clients across the US and Europe. Its service lines span bookkeeping and accounting to US GAAP, IFRS and LUX GAAP standards, business and financial consulting, FinTech advisory, marketing, and IT and engineering solutions.
 The firm positions itself as an integrated strategy unit — finance, technology, engineering and marketing under one operating model — working as a long-term strategic partner rather than a temporary service provider.
 Product
 Four specialized teams — accounting and bookkeeping, engineering, IT, and marketing — run a shared four-stage process: Discover, Plan, Execute, Optimize. The IT arm covers system design, development and infrastructure optimization; FinTech consulting guides clients through selecting and implementing financial technologies.
 Problem
 A consulting firm whose pitch is precision has to run its own technology precisely. The role spans two directions at once: the technology behind the firm itself, and the software development capability it sells to clients through its IT and FinTech service lines.
 Contribution
 Rijad is DIN's CTO & Head of Software Development — responsible for the firm's technology direction and for leading its software development function, including the delivery behind the IT-solutions service line and the firm's own digital presence.
 Engineering
 This is the leadership complement to his hands-on work elsewhere on this site: setting technical direction, making build decisions across client engagements, and owning outcomes rather than tickets — in a firm where the engineering and finance sides have to speak to each other.
 What was delivered
 — Technology leadership across an international, multi-office consulting firm
 — The software development function behind DIN's IT and FinTech service lines
 — The firm's public web presence
 Visit live product ↗ Ask Rijad about this project 
 Next project
 Neo Care
 Daily AI phone calls that keep families connected to aging parents.


---

## /work/neo-care

Neo Care — Kuloglija × Kujović 
 Skip to content 
 ← All work AI / Care Technology
 Neo Care
 Daily AI phone calls that keep families connected to aging parents.
 Engineer
 Rijad Kuloglija
 Role
 Product Engineering
 Technology
 Next.js · AI voice calls · Scheduling & reports · Escalation workflows
 www.neo-care.ai 
 Overview
 Neo Care, a Neo Labs product, places daily AI-powered phone calls to seniors: a friendly wellbeing check, medication and appointment reminders, and conversation. It works over ordinary phone calls — the senior needs no app and no smartphone.
 Families set it up, configure schedules and questions, receive daily summaries and weekly reports, and are notified immediately when a call goes unanswered or the system suspects an emergency.
 Product
 The feature set is built around one loop: call, converse, structure, report. Configurable health check-ins, medication reminders with intake confirmation and missed-dose alerts, appointment and birthday reminders, an escalation protocol for suspected emergencies, and family reporting with health-trend visualization.
 The first call is an introduction — the system learns preferences and the right conversational tone for each person, then runs on the agreed schedule.
 Problem
 The buyer and the user are different people. The adult child configures and pays on the web; the parent just answers the phone. The product has to bridge that gap: run natural voice conversations on one side, and turn them into structured, trustworthy data — summaries, trends, alerts — on the other, under GDPR constraints and with an emergency path that cannot silently fail.
 Contribution
 Rijad engineered Neo Care's customer-facing web platform — the Next.js application through which families sign up, configure call schedules and check-in content, and receive reporting.
 Engineering
 The platform is a Next.js and Tailwind CSS application. The engineering weight is in the workflow surface: schedule configuration, per-person customization of check-in questions, multiple emergency contacts, and report delivery — the machinery around the calls rather than the calls alone.
 What was delivered
 — Customer-facing web platform for a live, subscription-based AI care service
 — Configuration, scheduling and family-reporting product surfaces
 — A product operating in the EU under GDPR with a defined escalation workflow
 Visit live product ↗ Ask Rijad about this project 
 Next project
 Neo Therapy
 Structured daily support between therapy sessions.


---

## /work/neo-therapy

Neo Therapy — Kuloglija × Kujović 
 Skip to content 
 ← All work AI / Mental Wellness Technology
 Neo Therapy
 Structured daily support between therapy sessions.
 Engineer
 Rijad Kuloglija
 Role
 Product Engineering
 Technology
 Next.js · AI voice calls · Progress tracking · Structured check-ins
 www.neo-therapy.ai 
 Overview
 Neo Therapy, Neo Care's sibling product at Neo Labs, applies the same call-based model to mental wellness: daily AI phone calls with structured therapeutic check-ins, reminders for exercises and techniques, and progress tracking over time.
 It is explicitly positioned as continuous support between and after professional therapy sessions — for people managing recovery, anxiety or recurring depression — not as a replacement for therapy.
 Product
 Daily wellbeing checks with pattern and change detection, exercise reminders with completion confirmation, appointment tracking, and weekly progress analyses that surface patterns and triggers.
 A crisis-prevention layer watches for early signals of destabilization and responds with personalized coping strategies — the product's most sensitive workflow, and the reason structure matters more here than in most consumer apps.
 Problem
 Therapeutic support is punctual — a session every week or month — while the difficult moments are continuous. The product problem is delivering structured, personalized daily contact at subscription cost, while handling a vulnerable user group with appropriate care, privacy and honesty about what an AI service is and isn't.
 Contribution
 As with Neo Care, Rijad engineered the customer-facing web platform — the application handling onboarding, therapeutic-goal configuration, call scheduling and progress reporting.
 Engineering
 A Next.js and Tailwind CSS application sharing its platform DNA with Neo Care but with a distinct product identity, warmer design system and its own configuration model: therapeutic goals and preferred conversation style instead of family oversight.
 What was delivered
 — Customer-facing web platform for a live subscription service
 — Goal configuration, scheduling and progress-tracking surfaces
 — A second product shipped on the shared Neo Labs product model
 Visit live product ↗ Ask Rijad about this project 
 Next project
 Asrify
 Long-term engineering on a production SaaS.


---

## /work/arkona

Arkona Technology — Kuloglija × Kujović 
 Skip to content 
 ← All work Software Company / Web Platform
 Arkona Technology
 End-to-end ownership of a software company's own web presence.
 Engineer
 Rijad Kuloglija
 Role
 Senior Frontend Developer
 Technology
 React · Responsive UI · Performance · i18n (EN/SR)
 www.arkonatechnology.com 
 Overview
 Arkona Technology is a Belgrade software development company positioning itself as a long-term technology partner — building web, mobile and e-commerce products on a stack running from Symfony and Node.js to React and Next.js.
 Rijad worked with Arkona as a Senior Frontend Developer, part-time from late 2024 to early 2025.
 Product
 A software company's own website is a portfolio piece by definition — it gets judged by engineers. The site is a bilingual (English/Serbian) single-page React application with a dark visual identity.
 Problem
 Full frontend ownership: one engineer responsible for the architecture, the responsive behavior, the performance and the production delivery, with the client's own developers as the audience.
 Contribution
 Rijad led the end-to-end development of the website — architecture through deployment. He also developed GumaMax, a web-based tire-ordering dashboard enabling multi-vendor product sales and management.
 Engineering
 Responsive React frontend engineering with bilingual content, plus a separate commercial dashboard product handling multi-vendor catalog and ordering workflows.
 What was delivered
 — Arkona's production website, live and maintained
 — GumaMax multi-vendor tire-ordering dashboard
 — Frontend ownership from first commit to production
 Visit live product ↗ Ask Rijad about this project 
 Next project
 Nepa Invest
 A commercial digital presence for a real-estate developer.


---

## /work/nepa-invest

Nepa Invest — Kuloglija × Kujović 
 Skip to content 
 ← All work Real Estate / Digital Product
 Nepa Invest
 A commercial digital presence for a real-estate developer.
 Engineer
 Rijad Kuloglija
 Role
 Web Engineering
 Technology
 Project galleries · Lead generation · Responsive UI
 www.nepainvest.com 
 Overview
 Nepa Invest is a real-estate investment and development company that acquires, develops and sells residential and commercial property. Its site presents active developments — Villa Park Obarak, Projekat Pobjeda and Bulevar Goražde — combining investment positioning with architecture imagery.
 Product
 Per-project presentations with substantial render galleries, video tours for selected projects, an investment-approach narrative, and consultation/lead-generation flows for buyers and partners.
 Problem
 Outside SaaS, the job changes: the site sells trust in physical assets. Image-heavy galleries have to stay fast, and the composition has to feel like the buildings it presents — polished and solid.
 Contribution
 Rijad engineered Nepa Invest's web presence — the project presentation, gallery and contact surfaces that carry the company's commercial positioning.
 Engineering
 An image-forward single-page site where performance work concentrates on media: galleries of up to eleven renders per project and embedded video tours, delivered responsively.
 What was delivered
 — Live commercial web presence for an active property developer
 — Project galleries and video-tour presentation for three developments
 — Lead-generation and consultation flows
 Visit live product ↗ Ask Rijad about this project 
 Next project
 Puzzles IT
 Lead engineering across a portfolio of full-stack products.


---

## /work/sui-nft-dapp

Sui NFT DApp — Kuloglija × Kujović 
 Skip to content 
 ← All work Engineering Lab / Web3
 Sui NFT DApp
 A working decentralized application on the Sui blockchain.
 Engineer
 Rijad Kuloglija
 Role
 Design & Development
 Technology
 Next.js · TypeScript · Sui blockchain · Tailwind CSS · Zustand
 dapp-test-hazel.vercel.app/ 
 Overview
 A decentralized application built on the Sui blockchain: users mint NFTs, level them up and manage SUI coins from a wallet-connected interface. Built as a serious technical exercise in web3 development practices, and live to try.
 Product
 Wallet connection, on-chain minting and state, and coin management — a complete interaction loop with a real blockchain rather than a mocked one.
 Problem
 Blockchain frontends invert normal assumptions: state lives on-chain, transactions are asynchronous and fallible, and the UI must stay honest about pending and failed operations.
 Contribution
 Rijad built the application: Next.js and TypeScript frontend, Zustand state management, Tailwind styling, and integration with the Sui ecosystem.
 Engineering
 Included here as lab work: it demonstrates range beyond client projects — picking up an unfamiliar ecosystem and shipping something functional and public in it.
 What was delivered
 — Live, publicly accessible DApp on Vercel
 — On-chain NFT minting and leveling flows
 — SUI coin management interface
 Visit live product ↗ Ask Rijad about this project 
 Next project
 MintedScale
 Turning audience data into products.
