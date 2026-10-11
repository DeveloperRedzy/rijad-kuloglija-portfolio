import { test, expect, type Page } from "@playwright/test";

/** Every http(s) request the page makes from now on (data:/blob: URLs never reach the network). */
function recordRequests(page: Page): string[] {
  const urls: string[] = [];
  page.on("request", (r) => { if (/^https?:/.test(r.url())) urls.push(r.url()); });
  return urls;
}

const offOrigin = (urls: string[], page: Page) => {
  const origin = new URL(page.url()).origin;
  return urls.filter((u) => new URL(u).origin !== origin);
};

/** Waits for the tier and, on Tier A/B, the lazily loaded motion layer, then for the network to go quiet. */
async function settle(page: Page) {
  await page.waitForFunction(() => {
    const { tier, motion } = document.documentElement.dataset;
    return tier === "C" || (tier !== undefined && motion === "ready");
  });
  await page.waitForLoadState("networkidle");
}

test("desktop Tier A with the 3D scene: no request leaves the origin", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  test.setTimeout(60_000); // the 3D scene and its chunks load under a software renderer
  await page.addInitScript(() => {
    localStorage.setItem("redzy:tier", "A");
    localStorage.setItem("redzy:scene", "force");
    sessionStorage.setItem("redzy:loaded", "1");
  });
  const urls = recordRequests(page);
  for (const path of ["/", "/work/nepa-invest/"]) {
    await page.goto(path);
    await settle(page);
  }
  expect(offOrigin(urls, page)).toEqual([]);
});

test("desktop GPU detection reads the self-hosted benchmarks", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  test.setTimeout(60_000); // the 3D scene and its chunks load under a software renderer
  // No tier override, so detect-gpu runs. Report a hardware renderer it has benchmarks for (headless Chromium reports
  // SwiftShader, for which detect-gpu fetches nothing).
  await page.addInitScript(() => {
    sessionStorage.setItem("redzy:loaded", "1");
    const RENDERER = 0x9246; // WEBGL_debug_renderer_info.UNMASKED_RENDERER_WEBGL
    for (const proto of [WebGLRenderingContext.prototype, WebGL2RenderingContext.prototype]) {
      const get = proto.getParameter;
      proto.getParameter = function (this: WebGLRenderingContext, p: number) {
        return p === RENDERER ? "ANGLE (Apple, ANGLE Metal Renderer: Apple M1, Unspecified Version)" : get.call(this, p);
      } as typeof proto.getParameter;
    }
  });
  const urls = recordRequests(page);
  const benchmarks = page.waitForResponse((r) => new URL(r.url()).pathname === "/detect-gpu/d-apple.json");
  await page.goto("/");
  expect((await benchmarks).status()).toBe(200);
  await settle(page);
  expect(offOrigin(urls, page)).toEqual([]);
});

test("mobile: no request leaves the origin", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile");
  await page.addInitScript(() => sessionStorage.setItem("redzy:loaded", "1"));
  const urls = recordRequests(page);
  for (const path of ["/", "/work/nepa-invest/"]) {
    await page.goto(path);
    await settle(page);
  }
  expect(offOrigin(urls, page)).toEqual([]);
});
