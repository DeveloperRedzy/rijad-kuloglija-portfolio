// Runs Lighthouse CI for both profiles (desktop, then mobile) and fails at the end if either failed, so both report
// sets always exist (.lighthouseci/reports, .lighthouseci/reports-mobile).
import { spawnSync } from "node:child_process";

const runs = [
  ["desktop", ["autorun", "--config=lighthouserc.json"]],
  ["mobile", ["autorun", "--config=lighthouserc.mobile.json"]],
];
const failed = [];
for (const [name, args] of runs) {
  console.log(`\n=== lhci ${name} ===`);
  const r = spawnSync("npx", ["--no-install", "lhci", ...args], { stdio: "inherit" });
  if (r.status !== 0) failed.push(name);
}
if (failed.length) {
  console.error(`\nlhci failed: ${failed.join(", ")}`);
  process.exit(1);
}
console.log("\nlhci: desktop and mobile passed");
