// Bundle budgets (spec §10): initial JS ≤ 200 KB gz; 3D chunks ≤ 400 KB gz and never referenced from the initial HTML.
// Run after `npm run build` (reads the static export in out/).
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";

const INITIAL_LIMIT = Number(process.env.BUDGET_INITIAL_KB ?? 200) * 1024;
const THREE_LIMIT = Number(process.env.BUDGET_3D_KB ?? 400) * 1024;
const dir = "out/_next/static/chunks";
const pages = ["out/index.html", "out/work/liblynx/index.html", "out/cv/index.html", "out/404.html"];

if (!existsSync(dir)) { console.error(`missing ${dir}: run npm run build first`); process.exit(1); }

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const chunks = new Map(
  readdirSync(dir, { recursive: true })
    .filter((f) => typeof f === "string" && f.endsWith(".js"))
    .map((f) => {
      const src = readFileSync(join(dir, f));
      return [f.replaceAll("\\", "/"), { gz: gzipSync(src, { level: 9 }).length, src: src.toString("utf8") }];
    }),
);

// 3D detection, two passes:
// 1. Signatures that survive minification (string literals / class names of three, R3F, postprocessing).
const SIGNATURES = [/THREE\.WebGLRenderer/, /WebGLRenderer: /, /__THREE__/, /"three"/, /THREE\.WebGLProgram/, /EffectComposer/, /\bpostprocessing\b/];
const signed = new Set([...chunks].filter(([, c]) => SIGNATURES.some((re) => re.test(c.src))).map(([f]) => f));
// 2. The import graph: Turbopack loads a dynamic import as a group of chunks
//    (`Promise.all(["static/chunks/a.js", ...].map(load)).then(() => require(id))`). A group that contains a signed chunk
//    is a 3D entry (HeroScene, ShaderFrame, FrameCanvas); every chunk that only ever loads as part of 3D groups is
//    3D too (scene/frame components, the postprocessing passes, SceneBridge). Chunks shared with non-3D groups
//    (GSAP core, ScrollTrigger) are not.
const groups = [];
for (const [, c] of chunks) {
  for (const m of c.src.matchAll(/Promise\.all\(\[((?:"static\/chunks\/[^"]+\.js",?)+)\]/g)) {
    groups.push([...m[1].matchAll(/"static\/chunks\/([^"]+\.js)"/g)].map((x) => x[1]));
  }
}
const groups3D = groups.filter((g) => g.some((f) => signed.has(f)));
const inOther = new Set(groups.filter((g) => !groups3D.includes(g)).flat());
const three = [...new Set([...signed, ...groups3D.flat().filter((f) => !inOther.has(f))])].filter((f) => chunks.has(f));
const threeTotal = three.reduce((a, f) => a + chunks.get(f).gz, 0);

let fail = false;
let initialMax = 0;
for (const page of pages) {
  const html = readFileSync(page, "utf8");
  // Every chunk the page references (script tags, preloads, flight data), minus the legacy `noModule` polyfill
  // that module-capable browsers never download.
  const noModule = new Set([...html.matchAll(/<script[^>]*src="\/_next\/static\/chunks\/([^"]+\.js)"[^>]*noModule[^>]*>/gi)].map((m) => m[1]));
  const refs = [...new Set([...html.matchAll(/\/_next\/static\/chunks\/([^"'\s)\\]+?\.js)/g)].map((m) => m[1]))].filter((f) => !noModule.has(f));
  const missing = refs.filter((f) => !chunks.has(f));
  if (missing.length) { console.error(`FAIL ${page} references missing chunks: ${missing.join(", ")}`); fail = true; }
  const total = refs.reduce((a, f) => a + (chunks.get(f)?.gz ?? 0), 0);
  initialMax = Math.max(initialMax, total);
  console.log(`initial JS ${page}: ${kb(total)} gz across ${refs.length} chunks${noModule.size ? ` (excl. ${noModule.size} noModule polyfill)` : ""}`);
  const leaked = refs.filter((f) => three.includes(f));
  if (leaked.length) { console.error(`FAIL 3D chunk in the initial bundle of ${page}: ${leaked.join(", ")}`); fail = true; }
}
console.log(`initial JS (max): ${kb(initialMax)} gz (budget ${kb(INITIAL_LIMIT)})`);
console.log(`3D chunks: ${kb(threeTotal)} gz across ${three.length} chunks (budget ${kb(THREE_LIMIT)})${three.length ? ` [${three.map((f) => `${f} ${kb(chunks.get(f).gz)}`).join(", ")}]` : ""}`);
if (!signed.size || !groups3D.length) { console.error("FAIL no 3D chunk/entry detected (signature or loader pattern changed?)"); fail = true; }
if (initialMax > INITIAL_LIMIT) { console.error(`FAIL initial JS budget ${kb(INITIAL_LIMIT)}`); fail = true; }
if (threeTotal > THREE_LIMIT) { console.error(`FAIL 3D chunk budget ${kb(THREE_LIMIT)}`); fail = true; }
process.exit(fail ? 1 : 0);
