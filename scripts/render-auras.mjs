import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { auraSvg } from "../lib/aura.ts";

const seeds = ["liblynx", "din-solution", "neo-labs", "arkona", "nepa-invest", "rijad", "default"];
await mkdir("public/media/auras", { recursive: true });
for (const seed of seeds) {
  await sharp(Buffer.from(auraSvg(seed, 1200, 630))).png({ compressionLevel: 9 }).toFile(`public/media/auras/${seed}.png`);
  console.log(`auras/${seed}.png`);
}
