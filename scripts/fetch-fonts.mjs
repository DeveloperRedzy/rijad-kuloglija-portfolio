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
    // Fontshare also appends unrelated families (e.g. Satoshi); keep only the one we asked for.
    const name = face.match(/font-family:\s*['"]?([^;'"]+)/)?.[1]?.trim().toLowerCase().replace(/\s+/g, "-");
    if (name !== family) continue;
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
